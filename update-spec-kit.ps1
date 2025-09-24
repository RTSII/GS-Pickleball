# GitHub Spec Kit Update Script (PowerShell)
# Updates to the latest version using the official recommended method

Write-Host "Updating GitHub Spec Kit to latest version..." -ForegroundColor Cyan
Write-Host "Installing latest version via pip..." -ForegroundColor Yellow
pip install --upgrade git+https://github.com/github/spec-kit.git@main

$uvExists = Get-Command uv -ErrorAction SilentlyContinue
if ($null -ne $uvExists) {
    Write-Host "Updating uv tool..." -ForegroundColor Yellow
    uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
    Write-Host "uv tool updated successfully!" -ForegroundColor Green
} else {
    Write-Host "uv tool not found, skipping uv update..." -ForegroundColor Gray
}

Write-Host "Spec Kit update completed!" -ForegroundColor Green
Write-Host "Verifying installation..." -ForegroundColor Yellow
specify --version

Write-Host ""
Write-Host "Available commands:" -ForegroundColor Cyan
Write-Host "- /constitution - Update project principles"
Write-Host "- /specify      - Create feature specifications"
Write-Host "- /clarify      - Clarify requirements (NEW!)"
Write-Host "- /plan         - Generate implementation plans"
Write-Host "- /tasks        - Create task lists"
Write-Host "- /implement    - Execute implementation"
Write-Host ""
Write-Host "Tip: Restart Windsurf to ensure all slash commands are loaded"
