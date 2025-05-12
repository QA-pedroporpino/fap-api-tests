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

# Run all collections with individual reports
Write-Host "`nRunning all collections..." -ForegroundColor Green

# Run each collection individually with its own report
foreach ($collection in $collections) {
    $collectionName = [System.IO.Path]::GetFileNameWithoutExtension($collection)
    Write-Host "`nRunning collection: $collectionName`n" -ForegroundColor Yellow
    
    newman run $collection `
        -r cli,htmlextra `
        --reporter-htmlextra-export "$reportDir/$collectionName-report.html" `
        --reporter-htmlextra-title "$collectionName Test Report" `
        --reporter-htmlextra-darkTheme `
        --reporter-htmlextra-showOnlyFails
}

Write-Host "`n===============================================" -ForegroundColor Green
Write-Host "All tests have been executed!" -ForegroundColor Green
Write-Host "Reports available at: $reportDir" -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Green 