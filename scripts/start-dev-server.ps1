# Starts the Vite dev server fully detached from the calling shell, logging to
# dev-server.log / dev-server-err.log in the project root.
$root = Split-Path -Parent $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }

Start-Process -FilePath "npm.cmd" `
  -ArgumentList "run", "dev" `
  -WorkingDirectory $root `
  -RedirectStandardOutput (Join-Path $root "dev-server.log") `
  -RedirectStandardError (Join-Path $root "dev-server-err.log") `
  -WindowStyle Hidden

Write-Output "Dev server launch requested. Logs: $root\dev-server.log"
