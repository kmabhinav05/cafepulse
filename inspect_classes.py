with open("f:/cafepulse/styles-ClXFeZPY.css", "r", encoding="utf-8") as f:
    css = f.read()

# Let's search for glass button, segmented control, input styles
import re

for selector in [".glass", ".segmented", ".btn", "button", "input", ".scene-label"]:
    m = [i.start() for i in re.finditer(re.escape(selector), css)]
    print(f"{selector}: {len(m)} occurrences")
    if m:
        p = m[0]
        print(css[p:p+200])
        print("---")
