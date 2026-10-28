import urllib.request

base = "https://cafe-pulse-insight-hub.lovable.app"
files = [
    "/assets/CafeGlassScene-B_okT6ku.js",
    "/assets/coffee-glass-CVu4dqiN.jpg",
    "/assets/tea-glass-CNAKaprt.jpg"
]

for f in files:
    try:
        url = base + f
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req)
        content = res.read()
        filename = f.split('/')[-1]
        mode = "wb" if f.endswith(".jpg") else "w"
        if mode == "wb":
            with open(f"f:/cafepulse/{filename}", "wb") as out:
                out.write(content)
        else:
            with open(f"f:/cafepulse/{filename}", "w", encoding="utf-8") as out:
                out.write(content.decode("utf-8"))
        print(f"Downloaded {filename} ({len(content)} bytes)")
    except Exception as e:
        print(f"Error {f}: {e}")
