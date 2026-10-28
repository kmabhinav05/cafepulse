with open("f:/cafepulse/styles-ClXFeZPY.css", "r", encoding="utf-8") as f:
    css = f.read()

import re
matches = [m.start() for m in re.finditer(r'\.mesh-bg', css)]
for pos in matches:
    print(css[pos:pos+300])

btn_matches = [m.start() for m in re.finditer(r'\.btn-glass', css)]
for pos in btn_matches[:2]:
    print(css[pos:pos+300])

input_matches = [m.start() for m in re.finditer(r'input', css)]
print(f"input matches: {len(input_matches)}")
