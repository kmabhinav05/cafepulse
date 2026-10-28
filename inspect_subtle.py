with open("f:/cafepulse/styles-ClXFeZPY.css", "r", encoding="utf-8") as f:
    css = f.read()

for cls in [".glass-subtle", ".glass-strong", ".spring", "drift"]:
    p = css.find(cls)
    if p != -1:
        print(f"--- {cls} ---")
        print(css[p:p+250])
