# Expressive Comments in Loom

Loom features a unique "Expressive Comment" system that makes your code more scannable, self-documenting, and easier to maintain. These aren't just for humans—the `loom doc` command uses them to generate professional Markdown documentation automatically.

## The Comment Types

Loom recognizes six distinct comment types, each with a specific semantic meaning:

| Prefix | Type | Purpose |
| :--- | :--- | :--- |
| `// ` | Regular | Standard code explanation or temporary notes. |
| `//*` | Section | Logic block labels or major architectural boundaries. |
| `//!` | Urgent | Critical warnings, security notes, or important constraints. |
| `//?` | Trace | Runtime debug trace and logic doubts. |
| `//.` | Meta | Metadata like author, version, date, or status. |
| `//;` | Legal | Licensing, copyright, or organizational headers. |

## Runtime Features

### 🔍 Verbose Tracing

While `//?` comments are great for documentation, they are also alive during execution! If you run your script with the `--verbose-trace` flag, Loom will print these comments to the console as it hits those lines.

```bash
loom run main.lm --verbose-trace
# Output: [TRACE] should we implement rate limiting here?
```

This allows for "printf debugging" without actually writing or deleting print statements. Your thoughts about the code become the logs!

### ⏳ Time-Travel Error Logs

Loom automatically tracks the last 100 state changes (variable assignments, etc.) in a rolling history. If your script crashes with a Runtime Error, Loom will generate a `crash_report.md` file in the current directory.

This report includes:
- The exact error message.
- The last 10 state changes (e.g., `x = 10`, `y = "hello"`).
- The environment context (file name, flags used).

This "Time-Travel" debugging helps you see exactly what values variables had right before the failure point.

## Example Usage

Here is how you might structure a real Loom module:

```loom
//; loom auth system | licensed under mit
//; copyright (c) 2026 virex

//* user identity
//. author: virex | version: 1.0.2 | status: stable

frame User {
    username: str,
    id: int,
}

act login(u: str, p: str) -> Result<bool> {
    //? should we implement rate limiting here?
    let hash = hash_pass(p) //! never log or leak this value
    
    //* database lookup
    let task = spawn { db_query(u, hash) }
    return task.await()
}
```

## Automatic Documentation

When you run the `loom doc` command:

```bash
loom doc auth_system.lm
```

Loom extracts these comments and generates a `auth_system.md` file. 

- `//;` and `//.` are grouped into **Legal** and **Metadata** sections at the top.
- `//*` creates a new **Heading** in the document.
- `//!` is highlighted as **URGENT** in the documentation.
- `//?` is noted as a **Question/Debug** item.
- Regular `//` comments are included as descriptive text under their respective sections.

## Why Use Expressive Comments?

1.  Your eyes can quickly scan for `//*` to find logic or `//!` to find risks.
2.  You get beautiful documentation without needing external tools like JSDoc or Doxygen.
3.  Explicitly marking a line as a question (`//?`) or a warning (`//!`) communicates intent much more clearly than a generic comment.
