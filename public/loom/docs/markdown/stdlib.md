# Loom Standard Library

This page documents the built-in functions and methods available in the Loom programming language.

## Global Functions:

## I/O and System
- `print(...)`: Prints one or more values to the standard output, separated by spaces and followed by a newline.
- `input(prompt)`: Displays an optional prompt and reads a line from the standard input (`stdin`). Returns a `Str`.
- `clear()`: Clears the terminal screen and resets the cursor to the top-left corner.
- `read(filename)`: Reads the contents of a file. Returns an `Ok(content)` or `Err(message)`.
- `write(filename, content)`: Writes the given content to a file. Returns `Ok(None)` or `Err(message)`.
- `ls(path)`: Lists the entries in a directory. `path` is optional and defaults to `"."`. Returns a `List` of strings or an `Err`.
- `exists(path)`: Returns `true` if the path exists, `false` otherwise.
- `is_dir(path)`: Returns `true` if the path exists and is a directory.
- `is_file(path)`: Returns `true` if the path exists and is a file.
- `sleep(ms)`: Pauses execution for the specified number of milliseconds.
- `env(key)`: Returns the value of an environment variable, or `None` if it's not set.
- `set_env(key, value)`: Sets an environment variable.

## Data Conversion
- `str(val)`: Converts a value to its string representation.
- `int(val)`: Converts a value to an integer. Supports integers, floats, booleans, and strings.
- `float(val)`: Converts a value to a float. Supports integers, floats, and strings.
- `bool(val)`: Converts a value to a boolean. `0`, `""`, and `None` are `false`; most other things are `true`.
- `ord(char)`: Returns the Unicode integer code point of a character or the first character of a string.
- `chr(code)`: Returns a string containing the character with the specified Unicode code point.
- `json(json_str)`: Parses a JSON string into Loom values (Maps, Lists, etc.). Returns `Ok(value)` or `Err`.

## Concurrency and Results
- `Ok(val)`: Creates a successful result value.
- `Err(msg)`: Creates an error result value with a message.
- `Some(val)`: Creates an optional value containing something.
- `spawn expr`: Runs an expression in a background task. Returns a `Task`.
- `await task`: Waits for a task to complete. Returns `Ok(val)` or `Err`.

## Networking
- `net.connect(ip, port)`: Attempts to connect to a TCP address. Returns `Ok(None)` or `Err`.

## Utilities
- `xor(a, b)`: Performs a bitwise XOR operation on two integers.

---

## Type-Specific Methods:

## String Methods
- `s.len()`: Returns the number of characters in the string.
- `s.replace(old, new)`: Returns a new string with all occurrences of `old` replaced by `new`.
- `s.starts_with(prefix)`: Returns `true` if the string starts with the prefix.
- `s.ends_with(suffix)`: Returns `true` if the string ends with the suffix.
- `s.split(delim)`: Splits the string into a `List` of strings based on the delimiter.

## List Methods
- `l.len()`: Returns the number of items in the list.
- `l.push(item)`: Appends an item to the end of the list.
- `l.map(func)`: Returns a new list by applying `func` to each element.
- `l.filter(func)`: Returns a new list containing only elements for which `func` returns `true`.

## Map Methods
- `m.len()`: Returns the number of entries in the map.
- `m.keys()`: Returns a `List` of all keys in the map.
- `m.values()`: Returns a `List` of all values in the map.

## Result Methods (Ok/Err)
- `r.is_ok()`: Returns `true` if the result is `Ok`.
- `r.is_err()`: Returns `true` if the result is `Err`.

---

## Shell Integration:

When using the shell operator `$ "command"`, the result is a `ShellOutput` object with the following fields:

- `res.stdout`: The standard output of the command (string).
- `res.stderr`: The standard error of the command (string).
- `res.status`: The exit status code (integer).
