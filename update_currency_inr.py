import re

files_to_replace = [
    "f:/cafepulse/frontend/src/pages/CustomerOrderPage.jsx",
    "f:/cafepulse/frontend/src/pages/PosPage.jsx",
    "f:/cafepulse/frontend/src/pages/MenuPage.jsx",
    "f:/cafepulse/frontend/src/pages/OrdersPage.jsx",
    "f:/cafepulse/frontend/src/pages/DashboardPage.jsx",
    "f:/cafepulse/frontend/src/pages/AnalyticsPage.jsx",
    "f:/cafepulse/frontend/src/pages/InventoryPage.jsx"
]

for filepath in files_to_replace:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace currency display patterns:
    # 1. `${price}` or `${item.base_price...}` -> `₹{...}`
    # Notice: we should not replace javascript template literal interpolations like `${variable}`
    # but replace display prefixes like `${...}` when it means dollar sign before price:
    # Look for: >$ or > ${ or `${item or '($' or '+$' or '-$'
    
    # Replace >$ with >₹
    content = content.replace(">${", ">₹{")
    content = content.replace("> $", "> ₹")
    content = content.replace(">$", ">₹")
    content = content.replace("+$", "+₹")
    content = content.replace("-$", "-₹")
    content = content.replace("($", "(₹")
    content = content.replace("Charge $", "Charge ₹")
    content = content.replace("Pay $", "Pay ₹")
    content = content.replace("Total: $", "Total: ₹")
    content = content.replace("Revenue ($)", "Revenue (₹)")
    content = content.replace("Sales ($)", "Sales (₹)")
    content = content.replace("Cost ($)", "Cost (₹)")
    content = content.replace("Price ($)", "Price (₹)")
    content = content.replace("Price ($ USD)", "Price (₹ INR)")
    content = content.replace("Base Price ($)", "Base Price (₹)")
    content = content.replace("Cost per Unit ($)", "Cost per Unit (₹)")
    content = content.replace("`$${", "`₹${")
    content = content.replace("`$ {", "`₹ {")
    content = content.replace("${item.base_price", "₹{item.base_price")
    content = content.replace("${item.unit_price", "₹{item.unit_price")
    content = content.replace("${i.unit_price", "₹{i.unit_price")
    content = content.replace("${i.total_price", "₹{i.total_price")
    content = content.replace("${subtotal", "₹{subtotal")
    content = content.replace("${cartSubtotal", "₹{cartSubtotal")
    content = content.replace("${cartTotal", "₹{cartTotal")
    content = content.replace("${taxAmount", "₹{taxAmount")
    content = content.replace("${tax.toFixed", "₹{tax.toFixed")
    content = content.replace("${total.toFixed", "₹{total.toFixed")
    content = content.replace("${total_revenue", "₹{total_revenue")
    content = content.replace("${today_revenue", "₹{today_revenue")
    content = content.replace("${average_ticket", "₹{average_ticket")
    content = content.replace("${m.price_adjustment", "+₹{m.price_adjustment")
    content = content.replace("+${opt.price_adjustment", "+₹{opt.price_adjustment")
    content = content.replace("${mod.price_adjustment", "+₹{mod.price_adjustment")
    content = content.replace("${completedOrder.total", "₹{completedOrder.total")
    content = content.replace("${order.total", "₹{order.total")

    # GST update for India
    content = content.replace("Tax (8.25%)", "GST (5%)")
    content = content.replace("0.0825", "0.05")

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Updated currency to INR (Rs) in {filepath}")
