# 🧹 Code Quality Maintenance Script (PowerShell)
# This script runs all code quality checks and provides a summary

param(
    [switch]$Verbose
)

Write-Host "🧹 Running Code Quality Checks..." -ForegroundColor Blue
Write-Host "==================================" -ForegroundColor Blue

# Initialize counters
$totalChecks = 0
$passedChecks = 0
$failedChecks = 0
$warnings = 0

# Function to print colored output
function Write-Status {
    param(
        [string]$Status,
        [string]$Message
    )
    
    switch ($Status) {
        "PASS" { Write-Host "✅ $Message" -ForegroundColor Green }
        "FAIL" { Write-Host "❌ $Message" -ForegroundColor Red }
        "WARN" { Write-Host "⚠️  $Message" -ForegroundColor Yellow }
        default { Write-Host "ℹ️  $Message" -ForegroundColor Blue }
    }
}

# 1. TypeScript Type Checking
Write-Host "`n📝 TypeScript Type Checking..." -ForegroundColor Blue
try {
    $null = npm run typecheck 2>$null
    Write-Status "PASS" "TypeScript types are valid"
    $passedChecks++
} catch {
    Write-Status "FAIL" "TypeScript type errors found"
    $failedChecks++
}
$totalChecks++

# 2. ESLint Linting
Write-Host "`n🧹 ESLint Linting..." -ForegroundColor Blue
try {
    $lintOutput = npm run lint 2>&1
    if ($lintOutput -match "problems") {
        $problemCount = [regex]::Match($lintOutput, "(\d+) problems").Groups[1].Value
        Write-Status "WARN" "ESLint found $problemCount issues"
        $warnings++
    } else {
        Write-Status "PASS" "ESLint passed"
        $passedChecks++
    }
} catch {
    Write-Status "WARN" "ESLint check failed"
    $warnings++
}
$totalChecks++

# 3. Build Verification
Write-Host "`n🔨 Build Verification..." -ForegroundColor Blue
try {
    $null = npm run build 2>$null
    Write-Status "PASS" "Build successful"
    $passedChecks++
} catch {
    Write-Status "FAIL" "Build failed"
    $failedChecks++
}
$totalChecks++

# 4. Unused Dependencies Check
Write-Host "`n📦 Unused Dependencies..." -ForegroundColor Blue
try {
    $null = npx depcheck --quiet 2>$null
    Write-Status "PASS" "No unused dependencies"
    $passedChecks++
} catch {
    Write-Status "WARN" "Unused dependencies found (run 'npx depcheck' for details)"
    $warnings++
}
$totalChecks++

# 5. Unused Exports Check
Write-Host "`n🔍 Unused Exports..." -ForegroundColor Blue
try {
    $unusedExports = (npx ts-prune 2>$null | Measure-Object -Line).Lines
    if ($unusedExports -eq 0) {
        Write-Status "PASS" "No unused exports"
        $passedChecks++
    } else {
        Write-Status "WARN" "Found $unusedExports unused exports (run 'npx ts-prune' for details)"
        $warnings++
    }
} catch {
    Write-Status "WARN" "Could not check for unused exports"
    $warnings++
}
$totalChecks++

# 6. Unused Files Check
Write-Host "`n📁 Unused Files..." -ForegroundColor Blue
try {
    $null = npx knip --reporter=json > knip-report.json 2>$null
    if (Test-Path "knip-report.json") {
        $reportContent = Get-Content "knip-report.json" -Raw
        if ($reportContent -match '"unusedFiles":\[\]') {
            Write-Status "PASS" "No unused files"
            $passedChecks++
        } else {
            Write-Status "WARN" "Found unused files (run 'npx knip' for details)"
            $warnings++
        }
        Remove-Item "knip-report.json" -Force
    } else {
        Write-Status "WARN" "Could not check for unused files"
        $warnings++
    }
} catch {
    Write-Status "WARN" "Could not check for unused files"
    $warnings++
}
$totalChecks++

# 7. Bundle Size Check
Write-Host "`n📊 Bundle Size Analysis..." -ForegroundColor Blue
if (Test-Path "dist/index.html") {
    $bundleSize = (Get-ChildItem "dist" -Recurse | Measure-Object -Property Length -Sum).Sum
    $bundleSizeMB = [math]::Round($bundleSize / 1MB, 2)
    Write-Status "INFO" "Bundle size: $bundleSizeMB MB"
    $passedChecks++
} else {
    Write-Status "WARN" "No build artifacts found"
    $warnings++
}
$totalChecks++

# Summary
Write-Host "`n==================================" -ForegroundColor Blue
Write-Host "📊 CODE QUALITY SUMMARY" -ForegroundColor Blue
Write-Host "==================================" -ForegroundColor Blue

Write-Host "Total Checks: $totalChecks" -ForegroundColor Blue
Write-Host "Passed: $passedChecks" -ForegroundColor Green
Write-Host "Failed: $failedChecks" -ForegroundColor Red
Write-Host "Warnings: $warnings" -ForegroundColor Yellow

# Calculate percentage
if ($totalChecks -gt 0) {
    $passPercentage = [math]::Round(($passedChecks * 100) / $totalChecks)
    Write-Host "`nSuccess Rate: $passPercentage%" -ForegroundColor Blue
}

# Recommendations
Write-Host "`n💡 RECOMMENDATIONS:" -ForegroundColor Blue

if ($failedChecks -gt 0) {
    Write-Host "• Fix TypeScript and build errors first" -ForegroundColor Red
}

if ($warnings -gt 0) {
    Write-Host "• Address ESLint issues for better code quality" -ForegroundColor Yellow
    Write-Host "• Review unused dependencies and exports" -ForegroundColor Yellow
    Write-Host "• Consider removing unused files" -ForegroundColor Yellow
}

if ($failedChecks -eq 0 -and $warnings -eq 0) {
    Write-Host "• Excellent! Code quality is high" -ForegroundColor Green
    Write-Host "• Keep up the good work!" -ForegroundColor Green
}

# Exit with appropriate code
if ($failedChecks -gt 0) {
    exit 1
} else {
    exit 0
}
