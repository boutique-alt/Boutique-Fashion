$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

$envFile = Join-Path $PWD ".env"
if (-not (Test-Path $envFile)) {
  Write-Error ".env not found. Copy .env.example and fill in Supabase values first."
}

$vars = @("VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY", "VITE_RAZORPAY_KEY_ID", "VITE_UPI_ID", "VITE_UPI_PAYEE_NAME")
$values = @{}

Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') {
    $key = $matches[1].Trim()
    $val = $matches[2].Trim()
    if ($vars -contains $key -and $val) {
      $values[$key] = $val
    }
  }
}

if (-not $values["VITE_SUPABASE_URL"] -or -not $values["VITE_SUPABASE_ANON_KEY"]) {
  Write-Error "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env"
}

Write-Host "Linking Vercel project (complete login if prompted)..." -ForegroundColor Cyan
npx vercel link

foreach ($key in $vars) {
  if (-not $values.ContainsKey($key)) { continue }
  $val = $values[$key]
  Write-Host "Setting $key for production, preview, development..." -ForegroundColor Yellow
  $val | npx vercel env add $key production
  $val | npx vercel env add $key preview
  $val | npx vercel env add $key development
}

Write-Host ""
Write-Host "Done. Redeploy for changes to take effect:" -ForegroundColor Green
Write-Host "  npx vercel --prod" -ForegroundColor Green
