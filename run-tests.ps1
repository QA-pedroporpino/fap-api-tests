# Criar diretório de relatórios se não existir
if (!(Test-Path -Path "./api-tests/reports")) {
    New-Item -ItemType Directory -Path "./api-tests/reports"
}

# Executar testes de managers e gerar relatório
Write-Host "Executando testes de Managers..."
newman run "./api-tests/collections/-api-v1-managers.postman_collection.json" -r htmlextra --reporter-htmlextra-export "./api-tests/reports/managers-report.html" --reporter-htmlextra-title "Managers API Test Report"

# Executar testes de profiles e gerar relatório
Write-Host "Executando testes de Profiles..."
newman run "./api-tests/collections/-api-v1-profiles.postman_collection.json" -r htmlextra --reporter-htmlextra-export "./api-tests/reports/profiles-report.html" --reporter-htmlextra-title "Profiles API Test Report"

Write-Host "`nRelatórios gerados em:"
Write-Host "- ./api-tests/reports/managers-report.html"
Write-Host "- ./api-tests/reports/profiles-report.html" 