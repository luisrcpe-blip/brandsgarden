$depsUrl = "https://raw.githubusercontent.com/ernestorivero/Ubigeo-Peru/master/json/ubigeo_peru_2016_departamentos.json"
$provsUrl = "https://raw.githubusercontent.com/ernestorivero/Ubigeo-Peru/master/json/ubigeo_peru_2016_provincias.json"
$distsUrl = "https://raw.githubusercontent.com/ernestorivero/Ubigeo-Peru/master/json/ubigeo_peru_2016_distritos.json"

Write-Host "Fetching data..."
# Use UTF8 encoding for the web request
$deps = Invoke-RestMethod -Uri $depsUrl
$provs = Invoke-RestMethod -Uri $provsUrl
$dists = Invoke-RestMethod -Uri $distsUrl

$depMap = @{}
foreach ($d in $deps) { $depMap[$d.id] = $d.name }

$provMap = @{}
foreach ($p in $provs) { $provMap[$p.id] = @{ name = $p.name; dep_id = $p.department_id } }

$locations = New-Object System.Collections.Generic.List[string]

foreach ($d in $dists) {
    $distName = $d.name
    $provId = $d.province_id
    $provInfo = $provMap[$provId]
    
    if ($provInfo) {
        $provName = $provInfo.name
        $depId = $provInfo.dep_id
        $depName = $depMap[$depId]
        
        if ($depName) {
            # Fixes for user requests (Handling potential encoding issues in comparison)
            # Normalizing common searchable names
            if ($distName -match "Lurigancho") { $distName = "Lurigancho - Chosica" }
            if ($distName -match "Crespo y Castillo") { $distName = "Aucayacu (Jose Crespo y Castillo)" }
            
            # Clean string
            $fullLoc = "$depName - $provName - $distName"
            $fullLoc = $fullLoc -replace '  ', ' ' # Remove double spaces
            
            $locations.Add($fullLoc.Trim())
        }
    }
}

# Unique and Sorted
$sortedLocations = $locations | Sort-Object -Unique

Write-Host "Total unique locations: $($sortedLocations.Count)"

$scriptPath = "c:\Users\USUARIO\Local Sites\brandsgarden\app\public\wp-content\uploads\landings\perfumes\script.js"
$content = Get-Content -Path $scriptPath -Raw

$itemsStr = ($sortedLocations | ForEach-Object { "'$_'" }) -join ",`n        "
$replacement = "const PERU_LOCATIONS = [`n        $itemsStr`n    ];"

# Regex to replace the entire array
$pattern = [regex]::Escape("const PERU_LOCATIONS = [") + "[\s\S]*?" + [regex]::Escape("];")
$newContent = [regex]::Replace($content, $pattern, $replacement)

# Save with UTF8 (with BOM for Windows compliance or plain UTF8)
[System.IO.File]::WriteAllText($scriptPath, $newContent, [System.Text.Encoding]::UTF8)

Write-Host "Successfully updated PERU_LOCATIONS in script.js with all Peruvian districts."
