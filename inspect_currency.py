import re

# Let's inspect all files that have hardcoded '$' and replace with '₹' or formatINR
# Target files:
# 1. src/pages/CustomerOrderPage.jsx
# 2. src/pages/PosPage.jsx
# 3. src/pages/MenuPage.jsx
# 4. src/pages/OrdersPage.jsx
# 5. src/pages/DashboardPage.jsx
# 6. src/pages/AnalyticsPage.jsx
# 7. src/pages/InventoryPage.jsx

print("Scanner ready")
