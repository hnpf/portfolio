# Tutorial: Building a System Monitor CLI


## *reminder: docs may be inaccurate.*
*its best to refer to the docs in the Loom programming language github page if you are running into problems.*

---

## Everything being said, in this tutorial, we will build a real-world CLI tool using Loom. We will create a `sysmon` utility that:
1.  Checks the current disk usage.
2.  Checks the current memory usage.
3.  Checks for a specific process.
4.  Runs these checks concurrently for speed.

## Step 1: Defining Our Data

First, let's define a **Trait** for things that can be displayed, and a **Frame** to hold our results.

```loom
//* core data structures

trait Displayable {
    act display(self)
}

frame CheckResult {
    name: str,
    passed: bool,
    details: str,
}

//* implementation

weave Displayable into CheckResult {
    act display(self) {
        let status = if self.passed { "[PASS]" } else { "[FAIL]" }
        print(status + " " + self.name + ": " + self.details)
    }
}

// Try it out!
let test = CheckResult { 
    name: "Loom Tutorial", 
    passed: true, 
    details: "Compiler is active." 
}
test.display()
```

## Step 2: Implementing Checks

Now, let's write functions that use the shell `$` operator to get system info. We'll use expressive comments to document our intent.

```loom
//* system monitor

act check(name, cmd) {
    let res = $ cmd
    let passed = false
    
    // nested if because the lexer is picky today lol
    if res.status == 0 {
        if res.stdout.len() > 0 {
            passed = true
        }
    }

    let details = if passed { res.stdout } else { "failed/not found" }
    print((if passed { "[PASS] " } else { "[FAIL] " }) + name + ": " + details)
}

act main() {
    print("starting system monitor...")
    
    let t1 = spawn { check("disk", "df -h / | tail -1 | awk '{print $5}'") }
    let t2 = spawn { check("bash", "pgrep -x bash") }
    let t3 = spawn { check("fake", "pgrep -x nonexistent") }

    print("--- report ---")
    t1.await()
    t2.await()
    t3.await()
}

main()


```

## Step 3: Importing Logic from Markdown

Loom supports **Ghost Imports**. Instead of just importing `.lm` files, you can import `.md` files directly! This allows your documentation to be the source of truth for your logic.

Create a file named `logic.md`:

```markdown
# My System Logic

This markdown file contains our process checking logic.
```
```loom
act check_process(proc_name: str) -> CheckResult {
    let res = $ "pgrep -x " + proc_name + " | head -n 1"
    
    if res.status == 0 {
        CheckResult { name: "Process check (" + proc_name + ")", passed: true, details: "PID: " + res.stdout }
    } else {
        CheckResult { name: "Process check (" + proc_name + ")", passed: false, details: "Not found" }
    }
}
```

Then in main script:

```loom
pull "logic.md" // Ghost import!
```

Loom will scan the markdown for  ` ```loom `  blocks and execute them in order.

## Step 4: Hardware-Aware Safety

When running on constrained hardware, you can wrap your logic in a `safety` block. This informs the runtime about resource limits.

```loom
safety(mem: 128MB) {
    print("Running memory-sensitive checks...")
    let res = run_heavytask()
}
```

If the script attempts to exceed these limits, Loom will throw a Runtime Error (and generate a crash report!).

## Step 5: Running Concurrently

We want to run these checks at the same time using `spawn`.

```loom
//* main entry point

act main() {
    print("Running System Monitor...")
    
    // Spawn tasks
    let t1 = spawn { check_disk() }
    let t2 = spawn { check_process("bash") }
    let t3 = spawn { check_process("nonexistent") }
    
    // Await results
    let results = [t1, t2, t3].map(act(t) {
        return t.await()
    })
    
    print("\n--- Report ---")
    
    for res in results {
        when res {
            Ok(check) => check.display(),
            Err(e)    => print("Check error: " + e)
        }
    }
}

main()
```

## Step 6: Documentation

Because we used expressive comments, we can generate a README for our tool instantly:

```bash
loom doc sysmon.lm
```

This will create a `sysmon.md` that lists our "URGENT" notes and "Query" thoughts for future contributors.

## Step 7: Native Compilation

To get a fast binary for your system:

```bash
loom weave sysmon.lm -o sysmon
./sysmon
```

You have now built a concurrent, self-documenting system monitoring tool in roughly 50 lines of code!
