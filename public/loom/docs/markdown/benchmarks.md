# Loom Benchmarks

Loom is built to excel in shell operations, string manipulation, and system automation. Our performance suite tests both the interpreted mode and the native `weave` compiler.

## Results Summary

| Benchmark | Interpreted | Weaved (Native) | Improvement |
| :--- | :--- | :--- | :--- |
| **Fibonacci (35)** | ~61,051ms | **~1,209ms** | **~50.5x!** |
| **Sieve (1M Primes)** | ~5,807ms | **~840ms** | **~6.9x** |
| **String Stress** | ~627ms | **~305ms** | **~2.0x** |
| **Shell Stress** | ~3,449ms | ~3,392ms | Negligible |

## Analysis

## Massive Recursive Speedup
The `weave` compiler excels at deep recursion tasks. By compiling Loom code directly into native Rust binaries, we reduce the stack and tree-walking overhead, resulting in a **50x increase** in performance for recursive algorithms like Fibonacci.

## Efficient Shell Integration
Our shell spawning logic is implemented directly in Rust's high-performance standard library. Whether interpreted or compiled, Loom spawns 10,000 shell commands in just over 3 seconds, making it one of the fastest choices for complex automation tasks.

## Optimized String Handling
Loom uses Rust's efficient string buffers for all concatenation operations. Our string stress test (100,000 concatenations) completes in under 1 second even when interpreted, and roughly twice as fast when compiled.

## Actually Smart Memory Management
Using our new `vec()` pre-allocation builtin allows you to handle massive datasets (like 1,000,000 integers in a Sieve) with minimal GC or reallocation pressure.

---
*Benchmarks conducted on a modern Linux environment. Weaved results are compiled to a standalone Rust binary.*
