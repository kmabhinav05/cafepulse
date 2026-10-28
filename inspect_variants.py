with open("f:/cafepulse/glass-DHxAhXxb.js", "r", encoding="utf-8") as f:
    glass_js = f.read()

p = glass_js.find("He=")
print(glass_js[p:p+600])

# Also check Ge (Segmented control)
p2 = glass_js.find("function Ge(")
print("\n--- SegmentedControl Ge ---")
print(glass_js[p2:p2+700])
