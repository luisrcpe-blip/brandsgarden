$path = "c:\Users\USUARIO\Local Sites\brandsgarden\app\public\wp-content\uploads\landings\perfumes\script.js"
$lines = Get-Content -Path $path -Encoding UTF8
# Line 2401 is index 2400
$lines[2400] = '                    <div class="text-warning mb-2" style="font-size: 1rem;">★★★★★</div>'
# Fixing popup stars too if they are broken
# Based on previous view, they were around 2494
for ($i=2490; $i -lt 2505; $i++) {
    if ($lines[$i] -like "*â˜…*") {
        $lines[$i] = $lines[$i].Replace("â˜…", "★")
    }
}
Set-Content -Path $path -Value $lines -Encoding UTF8
Write-Host "Fixed stars in script.js"
