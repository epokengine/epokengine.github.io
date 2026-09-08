"""Capture the real Epok editor and viewport into website-owned assets.

Usage: python tools/capture-editor.py /path/to/Epok [--blueprint-project PATH]
Requires the engine's built debug editor and Python tool requirements.
All project edits and preferences are isolated; screenshot bytes are unmodified.
"""
import argparse
import importlib.util
import json
import os
from pathlib import Path
import shutil
import socket
import subprocess
import sys
import tempfile
import time
import uuid

parser = argparse.ArgumentParser()
parser.add_argument('engine', type=Path)
parser.add_argument('--blueprint-project', type=Path)
args = parser.parse_args()
engine = args.engine.resolve()
editor = engine / 'target/debug/epok-editor.exe'
out = Path(__file__).resolve().parent.parent / 'assets/captures'
out.mkdir(parents=True, exist_ok=True)
home = Path(tempfile.mkdtemp(prefix='epok-website-capture-'))
environment = dict(os.environ, LOCALAPPDATA=str(home / 'local'), XDG_DATA_HOME=str(home / 'local'))
spec = importlib.util.spec_from_file_location('epok_capture_client', engine / 'tests/integration/mcp.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

def run(arguments):
    return subprocess.run(arguments, cwd=engine, env=environment, check=True,
                          capture_output=True, text=True, encoding='utf-8', timeout=180,
                          creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0)).stdout

blueprint_project = args.blueprint_project
if not blueprint_project:
    fixture = json.loads(run([sys.executable, str(engine / 'tests/integration/create_blueprint_visual_fixture.py'),
                             '--destination', str(home / 'Blueprint Demo')]))
    blueprint_project = Path(fixture['project'])
run([str(editor), '--project', str(blueprint_project), '--open-blueprint',
     'assets/Blueprints/BP_Interaction.epokbp', '--screenshot-blueprint-canvas',
     '--window-size', '1581x917', '--screenshot', str(out / 'epok-blueprints.png')])
print('Captured native Blueprint editor.', flush=True)

project = home / 'Courtyard'
shutil.copytree(engine / 'examples/rpg-2-5d-demo', project,
                ignore=shutil.ignore_patterns('.epok', 'Export', 'Build', 'UserSettings'))
preferences = home / 'local/Epok/Editor.epokprefs'
preferences.parent.mkdir(parents=True, exist_ok=True)
with socket.socket() as probe:
    probe.bind(('127.0.0.1', 0))
    port = probe.getsockname()[1]
token = uuid.uuid4().hex + uuid.uuid4().hex
module.documents.write_text(preferences, json.dumps({'mcp': {'enabled': True, 'port': port, 'token': token}}))
with (home / 'editor.log').open('w') as log:
    child = subprocess.Popen([str(editor), '--project', str(project), '--window-size', '1600x1000'],
                             cwd=engine, env=environment, stdout=log, stderr=log,
                             creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
    try:
        def listening():
            if child.poll() is not None:
                raise RuntimeError('Editor exited; see ' + str(home / 'editor.log'))
            try:
                with socket.create_connection(('127.0.0.1', port), timeout=.1):
                    return True
            except OSError:
                return False
        module.wait_until(listening)
        client = module.Client(port, token)
        client.request('initialize', {'protocolVersion': '2025-11-25', 'capabilities': {},
                                     'clientInfo': {'name': 'epok-website-capture', 'version': '1'}})
        client.request('notifications/initialized', notification=True)
        client.tool('editor_view', scene_2d=False, grid=True, wire=False,
                    view={'yaw': .65, 'pitch': .5576, 'center': [0, 0, 0], 'zoom': .85})
        # Wait for asynchronous project imports before recording the editor.
        module.wait_until(lambda: not client.tool('editor_state')['import_active'], timeout=90)
        time.sleep(.5)
        client.screenshot('editor', out / 'epok-editor.png')
        client.tool('editor_view', grid=False)
        client.screenshot('scene', out / 'epok-scene-view.png')
        print('Captured native editor and Scene View.', flush=True)
    finally:
        child.terminate()
        child.wait(timeout=15)
print('Screenshots: ' + str(out))
