# Preview what version NBGV would generate
# Requires: dotnet tool install -g nbgv

param(
    [switch]$Install,
    [switch]$All
)

if ($Install) {
    Write-Host "Installing nbgv tool globally..." -ForegroundColor Cyan
    dotnet tool install -g nbgv
    Write-Host "Done!" -ForegroundColor Green
    exit 0
}

# Check if nbgv is installed
$nbgvPath = Get-Command nbgv -ErrorAction SilentlyContinue
if (-not $nbgvPath) {
    Write-Host "nbgv is not installed. Run: " -ForegroundColor Yellow -NoNewline
    Write-Host "npm run get-version -- -Install" -ForegroundColor Cyan
    Write-Host "Or manually: dotnet tool install -g nbgv" -ForegroundColor Gray
    exit 1
}

# Check if version.json exists
if (-not (Test-Path "version.json")) {
    Write-Host "version.json not found. NBGV requires this file." -ForegroundColor Red
    Write-Host "Create one with: nbgv install" -ForegroundColor Gray
    exit 1
}

Write-Host "`nNerdbank.GitVersioning Preview" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

if ($All) {
    # Show all version info
    nbgv get-version
} else {
    # Show key version formats
    $version = nbgv get-version -v SimpleVersion
    $semver = nbgv get-version -v SemVer2
    $nuget = nbgv get-version -v NuGetPackageVersion
    $commit = nbgv get-version -v GitCommitId
    $height = nbgv get-version -v VersionHeight

    Write-Host "`nSimple Version:  " -NoNewline; Write-Host $version -ForegroundColor Green
    Write-Host "SemVer2:         " -NoNewline; Write-Host $semver -ForegroundColor Green
    Write-Host "NuGet Version:   " -NoNewline; Write-Host $nuget -ForegroundColor Green
    Write-Host "Git Height:      " -NoNewline; Write-Host $height -ForegroundColor Yellow
    Write-Host "Commit:          " -NoNewline; Write-Host $commit -ForegroundColor Gray

    Write-Host "`nFor Chrome manifest.json, use: " -NoNewline
    Write-Host $version -ForegroundColor Cyan
    Write-Host "(Chrome only accepts X.Y.Z or X.Y.Z.W format)`n" -ForegroundColor Gray
}
