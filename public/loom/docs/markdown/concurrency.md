# Concurrency in Loom

Loom makes concurrency simple and safe with lightweight tasks. Tasks are managed by the runtime (Tokio under the hood) and provide structured concurrency primitives.

## Tasks

A task represents a concurrent unit of work.

### Spawning Tasks

Use the `spawn` keyword to start a new task. It takes a block of code and returns a `Task` handle immediately.

```loom
print("Starting main task")

let handle = spawn {
    print("Background task running...")
    // Simulate work
    let x = 10 * 10
    return x
}

print("Main task continues...")

// Wait for the result and print it
let result = handle.await()
print("Result: " + result)
```

The spawned block executes concurrently with the main thread.

### Awaiting Results

To synchronize and get the result of a task, call the `.await()` method on the handle. This blocks the current task until the spawned task completes.

```loom
let result = handle.await()

when result {
    Ok(val) => print("Task completed with: " + val),
    Err(e)  => print("Task failed: " + e),
}
```

The result is wrapped in a `Result` type (`Ok` or `Err`), handling potential failures gracefully.

## Concurrent Data Processing

Tasks are powerful when combined with list mapping. You can process items in parallel easily.

```loom
act process_item(id) {
    print("Processing item " + id)
    return id * 2
}

act main() {
    let ids = [1, 2, 3, 4, 5]
    
    // Launch a task for each item
    let tasks = ids.map(act(id) {
        return spawn { process_item(id) }
    })
    
    // Collect results
    let results = tasks.map(act(t) {
        let res = t.await()
        if let Ok(val) = res { return val } else { return 0 }
    })
    
    print("Results: " + results)
}
```

## Task Handles

The core primitive returned by `spawn` is a task handle that supports the `.await()` method.

```loom
let result = handle.await()
```

The result is wrapped in a `Result` type (`Ok` or `Err`), handling potential failures gracefully.

## Best Practices

*   **Avoid Shared Mutable State**: Loom encourages passing data into tasks and receiving results back, rather than modifying shared global variables.
*   **Handle Errors**: Always check the `Result` of an `await()` call.
*   **Structured Concurrency**: Ensure all spawned tasks are awaited or managed to prevent orphaned processes (though the runtime will clean them up eventually).
