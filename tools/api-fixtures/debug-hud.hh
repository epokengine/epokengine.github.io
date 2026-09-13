#pragma once
// Documentation extraction only: expose every conditional Debug HUD declaration.
// This is not a game build configuration and must never be staged into a game.
#define EPOK_DEBUG_FPS 1
#define EPOK_DEBUG_CPU 1
#define EPOK_DEBUG_GTE 1
#define EPOK_DEBUG_GPU 1
#define EPOK_DEBUG_SPU 1

// Clang's read-only AST extraction needs a constant-expression offsetof on
// Windows as well. The MSVC spelling uses a cast that this parser rejects.
#include <cstddef>
#undef offsetof
#define offsetof(type, member) __builtin_offsetof(type, member)
