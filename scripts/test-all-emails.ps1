$anon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmeGNxc21heWZ3aXNuc3J1b2FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyODA4ODcsImV4cCI6MjA5Nzg1Njg4N30.wuUPq_nlX8mwdZ3cI2FAqYkL7TTqNmhkAqHCnN8qZ9U"
$url = "https://qfxcqsmayfwisnsruoab.supabase.co/functions/v1/send-status-email"
$scenarios = Get-Content "$PSScriptRoot\test-email-scenarios.json" | ConvertFrom-Json

foreach ($scenario in $scenarios) {
  $body = $scenario.payload | ConvertTo-Json -Depth 10 -Compress
  $tmp = Join-Path $env:TEMP "email-test-$($scenario.name).json"
  $body | Set-Content -Path $tmp -Encoding UTF8

  $response = curl.exe -s -w "`nHTTP:%{http_code}" -X POST $url `
    -H "Authorization: Bearer $anon" `
    -H "apikey: $anon" `
    -H "Content-Type: application/json" `
    -H "x-webhook-secret: bootiq-email-test-2026" `
    --data-binary "@$tmp"

  Write-Host "`n=== $($scenario.name) ===" -ForegroundColor Cyan
  Write-Host $response
  Start-Sleep -Seconds 1
}
