import json
import urllib.request
import re
import os

def fetch_json(url):
    with urllib.request.urlopen(url) as response:
        return json.loads(response.read().decode('utf-8'))

def main():
    print("Fetching data from GitHub...")
    deps = fetch_json("https://raw.githubusercontent.com/ernestorivero/Ubigeo-Peru/master/json/ubigeo_peru_2016_departamentos.json")
    provs = fetch_json("https://raw.githubusercontent.com/ernestorivero/Ubigeo-Peru/master/json/ubigeo_peru_2016_provincias.json")
    dists = fetch_json("https://raw.githubusercontent.com/ernestorivero/Ubigeo-Peru/master/json/ubigeo_peru_2016_distritos.json")

    dep_map = {d['id']: d['name'] for d in deps}
    prov_map = {p['id']: {'name': p['name'], 'dep_id': p['department_id']} for p in provs}

    locations = []
    for d in dists:
        dist_name = d['name']
        prov_id = d['province_id']
        prov_info = prov_map.get(prov_id)
        if prov_info:
            prov_name = prov_info['name']
            dep_id = prov_info['dep_id']
            dep_name = dep_map.get(dep_id)
            if dep_name:
                # Normalization for common names requested by user
                if dist_name == "Lurigancho":
                    dist_name = "Lurigancho - Chosica" # Popular name
                
                # Check for Aucayacu (Capital of Jose Crespo y Castillo)
                if dist_name == "Jose Crespo y Castillo":
                    dist_name = "Aucayacu (Jose Crespo y Castillo)"
                
                locations.append(f"{dep_name} - {prov_name} - {dist_name}")

    # Special case for "Lima - Lima" priority/common usage
    locations.sort()

    print(f"Total locations found: {len(locations)}")

    script_path = r"c:\Users\USUARIO\Local Sites\brandsgarden\app\public\wp-content\uploads\landings\perfumes\script.js"
    
    with open(script_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Create the JS array string
    js_array_items = ",\n        ".join([f"'{loc}'" for loc in locations])
    replacement = f"const PERU_LOCATIONS = [\n        {js_array_items}\n    ];"

    # Regex to find and replace the PERU_LOCATIONS constant
    pattern = r"const PERU_LOCATIONS = \[\s*[\s\S]*?\s*\];"
    new_content = re.sub(pattern, replacement, content)

    with open(script_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print("Successfully updated PERU_LOCATIONS in script.js")

if __name__ == "__main__":
    main()
