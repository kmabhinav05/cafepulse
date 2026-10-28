with open("f:/cafepulse/glass-DHxAhXxb.js", "r", encoding="utf-8") as f:
    glass_js = f.read()

# Let's inspect GlassButton (Ue), SegmentedControl (Ge), GlassCard, etc.
# Find Ue
for name in ["GlassButton", "GlassCard", "GlassPanel"]:
    p = glass_js.find(name)
    if p != -1:
        print(f"--- {name} ---")
        print(glass_js[max(0, p-300):p+300])
