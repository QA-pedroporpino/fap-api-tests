# Script to run all Postman test collections

# Collections directory
$collectionsPath = "api-tests/collections"

# Create reports directory if it doesn't exist
$reportsPath = "api-tests/reports"
if (-not (Test-Path $reportsPath)) {
    New-Item -ItemType Directory -Path $reportsPath
}

# Current date and time for report name
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"

# Create report directory
$reportDir = "$reportsPath/$timestamp"
if (-not (Test-Path $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir
}

# Collections to run
$collections = @(
    "api-tests/collections/-api-v1-certificates.postman_collection.json",
    "api-tests/collections/-api-v1-clinics.postman_collection.json",
    "api-tests/collections/-api-v1-exams.postman_collection.json",
    "api-tests/collections/-api-v1-exams_prices.postman_collection.json",
    "api-tests/collections/-api-v1-health.postman_collection.json",
    "api-tests/collections/-api-v1-managers.postman_collection.json",
    "api-tests/collections/-api-v1-profiles.postman_collection.json",
    "api-tests/collections/-api-v1-professionals.postman_collection.json",
    "api-tests/collections/-api-v1-speciality_prices.postman_collection.json",
    "api-tests/collections/-api-v1-specialties.postman_collection.json",
    "api-tests/collections/-api-v1-table_prices.postman_collection.json"
)

# Initialize counters for summary
$totalCollections = $collections.Count
$successfulCollections = 0
$failedCollections = 0

# Run all collections with individual reports
Write-Host "`nStarting test execution at $(Get-Date)" -ForegroundColor Green
Write-Host "Total collections to run: $totalCollections`n" -ForegroundColor Green

# Run each collection individually with its own report
foreach ($collection in $collections) {
    $collectionName = [System.IO.Path]::GetFileNameWithoutExtension($collection)
    $reportPath = "$reportDir/$collectionName-report.html"
    
    Write-Host "`nRunning collection: $collectionName" -ForegroundColor Yellow
    Write-Host "Report will be saved to: $reportPath" -ForegroundColor Gray
    
    try {
        $result = newman run $collection `
            -r cli,htmlextra `
            --reporter-htmlextra-export $reportPath `
            --reporter-htmlextra-title "$collectionName" `
            --reporter-htmlextra-darkTheme `
            --reporter-htmlextra-showOnlyFails `
            --reporter-htmlextra-logs `
            --reporter-htmlextra-testPaging `
            --reporter-htmlextra-browserTitle "$collectionName Test Results"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Collection completed successfully" -ForegroundColor Green
            $successfulCollections++
        } else {
            Write-Host "✗ Collection completed with failures" -ForegroundColor Red
            $failedCollections++
        }
    }
    catch {
        Write-Host "✗ Error running collection: $_" -ForegroundColor Red
        $failedCollections++
    }
}

# Print summary
Write-Host "`n===============================================" -ForegroundColor Green
Write-Host "Test Execution Summary" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host "Total Collections: $totalCollections" -ForegroundColor White
Write-Host "Successful: $successfulCollections" -ForegroundColor Green
Write-Host "Failed: $failedCollections" -ForegroundColor Red
Write-Host "Reports Location: $reportDir" -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Green

# Exit with appropriate code
if ($failedCollections -gt 0) {
    exit 1
} else {
    exit 0
} 