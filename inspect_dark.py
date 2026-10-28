with open("f:/cafepulse/styles-ClXFeZPY.css", "r", encoding="utf-8") as f:
    css = f.read()

dark_idx = css.find(".dark{")
print("=== DARK VARIABLES ===")
print(css[dark_idx:dark_idx+1500])

# Also check for mesh-bg or background gradients
mesh_idx = css.find("mesh")
print("\n=== MESH STYLES ===")
print(css[mesh_idx-50:mesh_idx+500])
