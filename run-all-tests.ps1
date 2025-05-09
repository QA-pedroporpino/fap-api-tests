# Script para executar todas as coleções de teste do Postman

# Diretório das coleções
$collectionsPath = "api-tests/collections"

# Criar diretório de relatórios se não existir
$reportsPath = "api-tests/reports"
if (-not (Test-Path $reportsPath)) {
    New-Item -ItemType Directory -Path $reportsPath
}

# Data e hora atual para o nome do relatório
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$reportName = "test-report-$timestamp"

# Criar diretório para o relatório
$reportDir = "$reportsPath/$reportName"
if (-not (Test-Path $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir
}

# Criar arquivo temporário para listar todas as coleções
$collectionsList = "collections-list.json"
$collections = @(
    "api-tests/collections/-api-v1-clinics.postman_collection.json",
    "api-tests/collections/-api-v1-managers.postman_collection.json",
    "api-tests/collections/-api-v1-profiles.postman_collection.json",
    "api-tests/collections/-api-v1-speciality_prices.postman_collection.json",
    "api-tests/collections/-api-v1-specialties.postman_collection.json",
    "api-tests/collections/-api-v1-table_prices.postman_collection.json"
)
$collections | ConvertTo-Json | Out-File -FilePath $collectionsList

# Executar todas as coleções de uma vez com um único relatório
Write-Host "`nExecutando todas as coleções..." -ForegroundColor Green

# Executar cada coleção individualmente e combinar os resultados
foreach ($collection in $collections) {
    Write-Host "`nExecutando coleção: $collection`n"
    newman run $collection -r cli
}

# Remover arquivo temporário
Remove-Item $collectionsList

Write-Host "`n===============================================" -ForegroundColor Green
Write-Host "Todos os testes foram executados!" -ForegroundColor Green
Write-Host "Relatório combinado disponível em: $reportDir/combined-report.html" -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Green 