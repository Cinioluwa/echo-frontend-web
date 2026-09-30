# Stops the Vite dev server started by scripts/stop-dev-server.ps1 / npm run dev.
# Usage: powershell -NoProfile -ExecutionPolicy Bypass -File scripts\stop-dev-server.ps1
param([int]$Port = 5173)

$listening = netstat -ano | Select-String -Pattern "LISTENING" | Select-String -Pattern ":$Port\s"

if (-not $listening) {
  Write-Output "No process is listening on port $Port."
  exit 0
}

$pids = $listening |
  ForEach-Object { ($_ -split '\s+')[-1] } |
  Where-Object { $_ -match '^\d+$' } |
  Sort-Object -Unique

foreach ($processId in $pids) {
  try {
    $proc = Get-Process -Id $processId -ErrorAction Stop
    Write-Output ("Stopping PID {0} ({1}) on port {2}..." -f $processId, $proc.ProcessName, $Port)
    Stop-Process -Id $processId -Force -ErrorAction Stop
  } catch {
    Write-Output ("PID {0} is no longer running." -f $processId)
  }
}

Write-Output "Dev server stopped."
