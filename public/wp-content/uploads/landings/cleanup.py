import os

path = r"c:\Users\USUARIO\Local Sites\brandsgarden\app\public\wp-content\uploads\landings\perfumes\script.js"

with open(path, 'rb') as f:
    content = f.read()

# Map common mojibake sequences
# We decode as UTF-8 but then we see it was interpreted as something else or double-encoded
try:
    # Try to decode what we currently have
    text = content.decode('utf-8')
except UnicodeDecodeError:
    # If it's corrupted, try to read as latin-1 and then encode back properly
    text = content.decode('latin-1')

# Specific Fixes for the sequences seen in the file
replacements = {
    "â\x80\x9c": "“",
    "â\x80\x9d": "”",
    "â\x80\x94": "—",
    "â\x9c\x94": "✔",
    "â\x9c\x85": "✅",
    "â\x9c\x96": "✖",
    "â\x9c\x82": "✂",
    "â\x84\x92": "™",
    "â\x80\xa2": "•",
    "â\x80\xa6": "…",
    "â\x9c\x92": "✉",
    "Ã¡": "á",
    "Ã©": "é",
    "Ã\xad": "í",
    "Ã³": "ó",
    "Ãº": "ú",
    "Ã±": "ñ",
    "Ã\x81": "Á",
    "Ã\x89": "É",
    "Ã\x8d": "Í",
    "Ã\x93": "Ó",
    "Ã\x9a": "Ú",
    "Ã\x91": "Ñ",
    "Â¡": "¡",
    "Â¿": "¿",
    "â\x9c\x96": "✖",
    "â\x9c\x85": "✅",
    "â\x9c\x94": "✔",
    "â\x9d\x8c": "❌",
    "â\x80\x93": "–",
    "â\x80\x99": "’",
    "ð\x9f\x9a\x9að\x9f\x92\xa8": "🚚💨",
    "ð\x9f\x9a\x80": "🚀",
    "â\x9a\xa1": "⚡",
    "â\xad\x90": "⭐",
}

for src, dst in replacements.items():
    text = text.replace(src, dst)

# Fix specific words that might have been broken further
text = text.replace("vÃ¡lido", "válido")
text = text.replace("mÃ\xadninmo", "mínimo") # Typing error fix
text = text.replace("mÃ\xadnimo", "mínimo")
text = text.replace("numÃ©ricos", "numéricos")
text = text.replace("telÃ©fono", "teléfono")
text = text.replace("ubicaciÃ³n", "ubicación")
text = text.replace("bÃºsqueda", "búsqueda")
text = text.replace("mÃ¡s", "más")
text = text.replace("maÃ±ana", "mañana")
text = text.replace("Ã\x8d", "Í")
text = text.replace("Ã\xad", "í")

# Save as UTF-8
with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Encoding cleanup finished via Python.")
