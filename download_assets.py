import urllib.request

base = "https://cafe-pulse-insight-hub.lovable.app"
files = [
    "/assets/login-CQCZ_xi0.js",
    "/assets/CafeGlass3D-DJAqPt6s.js",
    "/assets/glass-DHxAhXxb.js",
    "/assets/styles-ClXFeZPY.css"
]

for f in files:
    try:
        url = base + f
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        content = urllib.request.urlopen(req).read().decode('utf-8')
        print(f"=== {f} ({len(content)} bytes) ===")
        print(content[:2000])
        print("...\n")
        
        # Save to disk for inspection
        filename = f.split('/')[-1]
        with open(f"f:/cafepulse/{filename}", "w", encoding="utf-8") as out:
            out.write(content)
    except Exception as e:
        print(f"Error {f}: {e}")
