$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "Deploying send-status-email to Supabase..." -ForegroundColor Cyan
Write-Host "If prompted, complete login in your browser." -ForegroundColor Yellow

npx supabase link --project-ref qfxcqsmayfwisnsruoab
npx supabase functions deploy send-status-email --project-ref qfxcqsmayfwisnsruoab

Write-Host "Done. Test by placing an order or updating a return status." -ForegroundColor Green
