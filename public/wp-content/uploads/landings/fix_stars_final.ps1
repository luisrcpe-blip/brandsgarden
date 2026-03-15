$path = "c:\Users\USUARIO\Local Sites\brandsgarden\app\public\wp-content\uploads\landings\perfumes\script.js"
$c = [System.IO.File]::ReadAllText($path)
# Replace broken stars with HTML entities
$c = $c.Replace('â˜…', '&#9733;')
$c = $c.Replace('★', '&#9733;')
[System.IO.File]::WriteAllText($path, $c, [System.Text.Encoding]::UTF8)
Write-Host "Fixed stars with HTML entities"
