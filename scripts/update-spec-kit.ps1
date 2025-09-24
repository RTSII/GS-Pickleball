<#
Helper: update-spec-kit.ps1
Creates `third_party/spec-kit` if missing and performs a shallow clone of the official GitHub repo.
If the folder exists and is a git repo, it will fetch the latest main and hard-reset to origin/main.

Run from project root (where this script lives):
    powershell -ExecutionPolicy Bypass -File .\scripts\update-spec-kit.ps1
#>

param(
    [string]$TargetDir = "third_party/spec-kit",
    [string]$Repo = "https://github.com/github/spec-kit.git",
    [string]$Branch = "main",
    [switch]$ForceClone
)

$projRoot = Split-Path -Parent $MyInvocation.MyCommand.Path | Resolve-Path
Set-Location $projRoot

if (-not (Test-Path -Path "third_party")) {
    Write-Host "Creating third_party directory..."
    New-Item -Path "third_party" -ItemType Directory | Out-Null
}

if (-not (Test-Path -Path $TargetDir) -or $ForceClone) {
    if (Test-Path -Path $TargetDir) {
        Write-Host "Removing existing path because -ForceClone was requested..."
        Remove-Item -Recurse -Force $TargetDir
    }
    Write-Host "Cloning $Repo (depth=1) into $TargetDir..."
    git clone --depth 1 --branch $Branch $Repo $TargetDir
    if ($LASTEXITCODE -ne 0) { throw "git clone failed with exit code $LASTEXITCODE" }
    Write-Host "Done."
    exit 0
}

# If path exists, try to update in-place if it's a git repo
if (Test-Path -Path (Join-Path $TargetDir ".git")) {
    Write-Host "Target directory is a git repo: updating..."
    Push-Location $TargetDir
    git fetch --depth 1 origin $Branch
    if ($LASTEXITCODE -ne 0) { Write-Host "git fetch failed (non-fatal)." }
    git reset --hard origin/$Branch
    if ($LASTEXITCODE -ne 0) { throw "git reset failed with exit code $LASTEXITCODE" }
    Pop-Location
    Write-Host "Updated $TargetDir to latest $Branch." 
    exit 0
}

# If folder exists but not a git repo, warn and exit
Write-Host "Target path exists but is not a git repository: $TargetDir"
Write-Host "If you want to replace it with the official spec-kit, run this script with -ForceClone." 
exit 1
