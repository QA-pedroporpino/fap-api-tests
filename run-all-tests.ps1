# Script to run all Postman test collections

# Collections directory
$collectionsPath = "api-tests/collections"

# Create reports directory if it doesn't exist
$reportsPath = "api-tests/reports"
if (-not (Test-Path $reportsPath)) {
    New-Item -ItemType Directory -Path $reportsPath
}

# Collections to run
$collections = @(
    "api-tests/collections/-auth-login-.postman_collection.json",
    "api-tests/collections/-api-v1-certificates.postman_collection.json",
    "api-tests/collections/-api-v1-clients.postman_collection.json",
    "api-tests/collections/-api-v1-clinics.postman_collection.json",
    "api-tests/collections/-api-v1-exams.postman_collection.json",
    "api-tests/collections/-api-v1-exams_prices.postman_collection.json",
    "api-tests/collections/-api-v1-health.postman_collection.json",
    "api-tests/collections/-api-v1-holidays.postman_collection.json",
    "api-tests/collections/-api-v1-managers.postman_collection.json",
    "api-tests/collections/-api-v1-profiles.postman_collection.json",
    "api-tests/collections/-api-v1-professionals.postman_collection.json",
    "api-tests/collections/-api-v1-schedules.postman_collection.json",
    "api-tests/collections/-api-v1-speciality_prices.postman_collection.json",
    "api-tests/collections/-api-v1-specialties.postman_collection.json",
    "api-tests/collections/-api-v1-table_prices.postman_collection.json"
)

# Run all collections
Write-Host "`nRunning all collections..." -ForegroundColor Green

# Run each collection
foreach ($collection in $collections) {
    Write-Host "`nRunning collection: $collection`n" -ForegroundColor Yellow
    newman run $collection -r cli
}

Write-Host "`n===============================================" -ForegroundColor Green
Write-Host "All tests have been executed!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green 