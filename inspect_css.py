import re

with open("f:/cafepulse/styles-ClXFeZPY.css", "r", encoding="utf-8") as f:
    css = f.read()

keywords = ["login-page", "login-header", "login-content", "login-studio", "login-form", "login-footer", "cafe-glass", "--scene-"]

for kw in keywords:
    matches = [m.start() for m in re.finditer(re.escape(kw), css)]
    print(f"Keyword '{kw}': {len(matches)} occurrences")
    for pos in matches[:2]:
        start = max(0, pos - 100)
        end = min(len(css), pos + 300)
        print("--- SNIPPET ---")
        print(css[start:end])
        print("---------------\n")
