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
$reportName = "test-report-$timestamp"

# Create report directory
$reportDir = "$reportsPath/$reportName"
if (-not (Test-Path $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir
}

# Create temporary file to list all collections
$collectionsList = "collections-list.json"
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
$collections | ConvertTo-Json | Out-File -FilePath $collectionsList

# Run all collections with a single report
Write-Host "`nRunning all collections..." -ForegroundColor Green

# Run each collection individually and combine results
foreach ($collection in $collections) {
    Write-Host "`nRunning collection: $collection`n"
    newman run $collection -r cli
}

# Remove temporary file
Remove-Item $collectionsList

Write-Host "`n===============================================" -ForegroundColor Green
Write-Host "All tests have been executed!" -ForegroundColor Green
Write-Host "Combined report available at: $reportDir/combined-report.html" -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Green 