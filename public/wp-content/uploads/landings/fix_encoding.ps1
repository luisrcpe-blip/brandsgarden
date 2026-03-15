$path = "c:\Users\USUARIO\Local Sites\brandsgarden\app\public\wp-content\uploads\landings\perfumes\script.js"

# Read as UTF8 (handling current corrupt state by literal replacement)
$content = [System.IO.File]::ReadAllText($path)

# Map of common mojibake to correct characters
$replacements = @{
    "â˜…" = "★";
    "Ã³" = "ó";
    "Ã©" = "é";
    "Ã­" = "í";
    "Ã¡" = "á";
    "Ãº" = "ú";
    "Ã±" = "ñ";
    "Â¡" = "¡";
    "â Œ" = "❌";
    "ðŸš€" = "🚀";
    "ðŸššðŸ’¨" = "🚚💨";
    "Ã€" = "À";
    "Ãˆ" = "È";
    "Ã‰" = "É";
    "Ã" = "í"; # Special case for broken char + space or similar
    "Â" = ""; # Often used as prefix for broken chars
}

# Perform replacements
foreach ($key in $replacements.Keys) {
    if ($key -ne "") {
        $content = $content.Replace($key, $replacements[$key])
    }
}

# Additional specific fixes for the file
$content = $content.Replace("despuÃ©s", "después")
$content = $content.Replace("ubicaciÃ³n", "ubicación")
$content = $content.Replace("bÃºsqueda", "búsqueda")
$content = $content.Replace("mÃ¡s", "más")
$content = $content.Replace("tÃ©rmino", "término")
$content = $content.Replace("atenciÃ³n", "atención")
$content = $content.Replace("llegÃ³", "llegó")
$content = $content.Replace("aquÃ­", "aquí")
$content = $content.Replace("sÃºper", "súper")
$content = $content.Replace("rÃ¡pido", "rápido")
$content = $content.Replace("maÃ±ana", "mañana")
$content = $content.Replace("SecciÃ³n", "Sección")
$content = $content.Replace("DinÃ¡mico", "Dinámico")
$content = $content.Replace("RecÃ­belo", "Recíbelo")
$content = $content.Replace("vÃ¡lido", "válido")
$content = $content.Replace("mÃ­nimo", "mínimo")
$content = $content.Replace("dÃ­gitos", "dígitos")
$content = $content.Replace("numÃ©ricos", "numéricos")
$content = $content.Replace("electrÃ³nico", "electrónico")
$content = $content.Replace("telÃ©fono", "teléfono")
$content = $content.Replace("estÃ¡", "está")
$content = $content.Replace("vacÃ­o", "vacío")
$content = $content.Replace("tambiÃ©n", "también")
$content = $content.Replace("especÃ­ficamente", "específicamente")
$content = $content.Replace("TenÃ­a", "Tenía")

# Save back as UTF8 (No BOM)
[System.IO.File]::WriteAllText($path, $content, (New-Object System.Text.UTF8Encoding($false)))

Write-Host "UTF-8 Encoding fixed in script.js"
