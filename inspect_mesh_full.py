with open("f:/cafepulse/styles-ClXFeZPY.css", "r", encoding="utf-8") as f:
    css = f.read()

mesh_start = css.find(".mesh-bg{")
print(css[mesh_start:mesh_start+2500])
