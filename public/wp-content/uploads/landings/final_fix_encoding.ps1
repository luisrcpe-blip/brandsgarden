$path = "c:\Users\USUARIO\Local Sites\brandsgarden\app\public\wp-content\uploads\landings\perfumes\script.js"

# Read the file as UTF8
$content = [System.IO.File]::ReadAllText($path)

# Dictionary of broken -> correct
$fix = @{
    "PerÃº" = "Perú";
    "despuÃ©s" = "después";
    "ðŸš€" = "🚀";
    "ubicaciÃ³n" = "ubicación";
    "bÃºsqueda" = "búsqueda";
    "mÃ¡s" = "más";
    "tÃ©rmino" = "término";
    "atenciÃ³n" = "atención";
    "llegÃ³" = "llegó";
    "aquÃ­" = "aquí";
    "sÃºper" = "súper";
    "rÃ¡pido" = "rápido";
    "maÃ±ana" = "mañana";
    "SecciÃ³n" = "Sección";
    "DinÃ¡mico" = "Dinámico";
    "RecÃ­belo" = "Recíbelo";
    "vÃ¡lido" = "válido";
    "mÃ­nimo" = "mínimo";
    "dÃ­gitos" = "dígitos";
    "numÃ©ricos" = "numéricos";
    "electrÃ³nico" = "electrónico";
    "telÃ©fono" = "teléfono";
    "estÃ¡" = "está";
    "vacÃ­o" = "vacío";
    "tambiÃ©n" = "también";
    "especÃ­ficamente" = "específicamente";
    "TenÃ­a" = "Tenía";
    "ComprÃ³" = "Compró";
    "catÃ¡logo" = "catálogo";
    "estÃ¡n" = "están";
    "Ã³" = "ó";
    "Ã©" = "é";
    "Ã­" = "í";
    "Ã¡" = "á";
    "Ãº" = "ú";
    "Ã±" = "ñ";
    "Â¡" = "¡";
    "Â¿" = "¿";
    "ðŸššðŸ’¨" = "🚚💨";
    "â Œ" = "❌";
    "â˜…" = "★";
    "âœ…" = "✅"
}

foreach ($key in $fix.Keys) {
    if ($content.Contains($key)) {
        $content = $content.Replace($key, $fix[$key])
    }
}

# Fix specific Mojibake seen in user's prompt
$content = $content.Replace("Express. ðŸššðŸ’¨", "Express. 🚚💨")

# Save as UTF8 WITHOUT BOM
$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($path, $content, $utf8NoBOM)

Write-Host "UTF-8 Cleanup Complete"
