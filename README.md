# flatline-lsp-client

See [Flatline-LSP](https://github.com/okdshin/flatline_lsp)


# Setup vscode

(Please install `flatline_lsp` before setup vscode)

Set the path of the flatline_lsp binary to `Flatline Lsp Bin` in settings.json. (e.g. `/home/user/.flatline_lsp/flatline_lsp`)

Also you might modify `Languages`.

Then restart vscode.


# Manualy build the package and install

```
npm install -g vsce
vsce package
code code --install-extension flatline-lsp-client-<version>.vsix  # please specify version 
```

Then setup vscode.
