# Shell Scripting

Loom integrates shell commands natively, allowing you to execute Bash scripts, command-line utilities, and system processes as easily as calling a function.

## The `$` Operator

The `$` operator executes the following expression as a shell command.

### Basic Usage

You can execute a simple string literal directly:

```loom
let res = $ "echo Hello World"
print(res.stdout)
```

### Capturing Output

The result of a shell command is a `ShellOutput` object, which contains three fields:
1.  `stdout`: Standard output (string).
2.  `stderr`: Standard error (string).
3.  `status`: Exit code (int).

```loom
let result = $ "ls -la"

if result.status == 0 {
    print("Files found: " + result.stdout)
} else {
    print("Error listing files: " + result.stderr)
}
```

### Dynamic Commands

You can use variables and string concatenation to build commands dynamically.

```loom
let filename = "data.txt"
let cmd = "cat " + filename
let output = $ cmd
print(output.stdout)
```

## String Interpolation

Loom supports interpolation inside strings using `{variable}` syntax. This makes constructing shell commands cleaner. In addition to simple variables, you can also interpolate fields of frames or objects using dot notation.

```loom
let user = "root"
let process = "nginx"

// Much cleaner than "ps -u " + user + " | grep " + process
let result = $ "ps -u {user} | grep {process}"

print(result.stdout)

// Interpolating fields directly
let config = { port: 8080, host: "localhost" }
print("Connecting to {config.host}:{config.port}")
```

## Advanced Examples

### Piping

You can use standard shell pipes (`|`) within the command string.

```loom
let count = $ "cat huge_file.log | grep ERROR | wc -l"
print("Error count: " + count.stdout)
```

### Environment Variables

You can access environment variables using standard shell syntax (e.g., `$HOME`, `$PATH`) within the command string, as it is executed by `sh -c`.

```loom
let home = $ "echo $HOME"
print("Home directory: " + home.stdout)
```

## Security Best Practices

**Warning: Injection Risk**

Using interpolation or string concatenation with untrusted input creates a shell injection vulnerability.

**Vulnerable Code:**

```loom
// If 'user_input' is "; rm -rf /", this destroys the system.
let cmd = "echo " + user_input
$ cmd
```

**Mitigation:**
*   **Validate Input**: Ensure variables contain only safe characters (alphanumeric) before using them in a shell command.
*   **Sanitize**: Escape special characters if the input is untrusted.
*   **Use with Caution**: Only use `$` with inputs you control or have strictly validated.
