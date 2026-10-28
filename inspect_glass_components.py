with open("f:/cafepulse/login-CQCZ_xi0.js", "r", encoding="utf-8") as f:
    js = f.read()

# Let's inspect import names and find input component definition
# in glass-DHxAhXxb.js: import { r as c, t as l } from "./glass-DHxAhXxb.js"
with open("f:/cafepulse/glass-DHxAhXxb.js", "r", encoding="utf-8") as f:
    glass_js = f.read()

# find export { ... }
export_idx = glass_js.rfind("export{")
print("GLASS EXPORTS:", glass_js[export_idx:])

# Let's see what c and l are
print("\n--- Search for c (Input) ---")
# find where Input or label is defined
for m in ["label:", "label,", "Input", "error:", "rounded-2xl"]:
    p = glass_js.find(m)
    if p != -1:
        print(f"Match {m}:", glass_js[p-50:p+250])
        print("===")
