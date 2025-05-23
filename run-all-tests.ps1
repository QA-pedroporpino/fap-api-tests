# Script to run all Postman test collections

# Collections directory
$collectionsPath = "api-tests/collections"

# Create reports directory if it doesn't exist
$reportsPath = "api-tests/reports"
if (-not (Test-Path $reportsPath)) {
    New-Item -ItemType Directory -Path $reportsPath
}

# Collections to run (excluding login collection since we'll handle it separately)
$collections = @(
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

# First, run the login script
Write-Host "`nExecuting login to get fresh token..." -ForegroundColor Green
node api-tests/run-tests.js "-auth-login-.postman_collection.json"

# Check if login was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "`nLogin successful! Running all collections..." -ForegroundColor Green

# Run each collection
foreach ($collection in $collections) {
    Write-Host "`nRunning collection: $collection`n" -ForegroundColor Yellow
        newman run $collection -g "api-tests/collections/workspace.postman_globals.json" -r cli
}

Write-Host "`n===============================================" -ForegroundColor Green
Write-Host "All tests have been executed!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green 
} else {
    Write-Host "`nLogin failed! Please check your credentials and try again." -ForegroundColor Red
    exit 1
} 