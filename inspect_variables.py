with open("f:/cafepulse/styles-ClXFeZPY.css", "r", encoding="utf-8") as f:
    css = f.read()

# find :root and .dark variables
root_idx = css.find(":root{")
print("=== ROOT & VARIABLES ===")
print(css[root_idx:root_idx+1500])

print("\n=== LOGIN STYLES ===")
login_idx = css.find(".login-page{")
print(css[login_idx:login_idx+2000])
