export const INITIAL_CATEGORIES = [
  { id: 'cat-coffee', name: 'Artisan Coffee', icon: 'coffee', description: 'Freshly roasted single-origin espresso and brews', is_active: true },
  { id: 'cat-tea', name: 'Herbal & Leaf Teas', icon: 'leaf', description: 'Hand-blended loose leaf and calming herbal infusions', is_active: true },
  { id: 'cat-cold', name: 'Cold Brews & Sodas', icon: 'cup-soda', description: 'Slow-steeped cold beverages and sparkling tonics', is_active: true },
  { id: 'cat-bakery', name: 'Fresh Bakery', icon: 'cake', description: 'Flaky pastries and organic sourdough baked daily', is_active: true },
];

export const INITIAL_MENU_ITEMS = [
  {
    id: 'item-1',
    category_id: 'cat-coffee',
    category_name: 'Artisan Coffee',
    name: 'Signature Caramel Latte',
    description: 'Double-shot Arabica espresso, steamed oat milk, and house-made salted caramel drizzle.',
    base_price: 5.50,
    prep_time_minutes: 3,
    calories: 220,
    is_available: true,
    sizes: [
      { name: 'Small (8oz)', price_adjustment: 0.0 },
      { name: 'Medium (12oz)', price_adjustment: 0.75 },
      { name: 'Large (16oz)', price_adjustment: 1.50 }
    ],
    modifiers: [
      { name: 'Extra Espresso Shot', price_adjustment: 1.00 },
      { name: 'Almond Milk', price_adjustment: 0.60 },
      { name: 'Oat Milk', price_adjustment: 0.60 },
      { name: 'Vanilla Syrup', price_adjustment: 0.50 }
    ]
  },
  {
    id: 'item-2',
    category_id: 'cat-coffee',
    category_name: 'Artisan Coffee',
    name: 'Spanish Cortado',
    description: 'Equal parts velvety micro-foamed milk and concentrated rich espresso shot.',
    base_price: 4.25,
    prep_time_minutes: 2,
    calories: 90,
    is_available: true,
    sizes: [{ name: 'Standard (4oz)', price_adjustment: 0.0 }],
    modifiers: [{ name: 'Extra Shot', price_adjustment: 1.00 }]
  },
  {
    id: 'item-3',
    category_id: 'cat-coffee',
    category_name: 'Artisan Coffee',
    name: 'Single Origin Cold Brew',
    description: 'Ethiopian Yirgacheffe steeped for 18 hours with natural notes of bergamot and blueberry.',
    base_price: 4.75,
    prep_time_minutes: 1,
    calories: 10,
    is_available: true,
    sizes: [
      { name: 'Regular (12oz)', price_adjustment: 0.0 },
      { name: 'Large (16oz)', price_adjustment: 0.85 }
    ],
    modifiers: [{ name: 'Sweet Cream Float', price_adjustment: 0.75 }]
  },
  {
    id: 'item-4',
    category_id: 'cat-tea',
    category_name: 'Herbal & Leaf Teas',
    name: 'Golden Amber Citrus Tea',
    description: 'Steeped amber Ceylon black tea layered with fresh lemon wheel and sweet garden mint.',
    base_price: 4.50,
    prep_time_minutes: 3,
    calories: 45,
    is_available: true,
    sizes: [
      { name: 'Medium (12oz)', price_adjustment: 0.0 },
      { name: 'Large (16oz)', price_adjustment: 0.75 }
    ],
    modifiers: [
      { name: 'Extra Honey', price_adjustment: 0.50 },
      { name: 'Fresh Mint Leaves', price_adjustment: 0.40 }
    ]
  },
  {
    id: 'item-5',
    category_id: 'cat-tea',
    category_name: 'Herbal & Leaf Teas',
    name: 'Ceremonial Matcha Latte',
    description: 'Stone-ground Uji green matcha whisked smooth with silky warm oat milk.',
    base_price: 5.75,
    prep_time_minutes: 4,
    calories: 140,
    is_available: true,
    sizes: [
      { name: '12oz Hot', price_adjustment: 0.0 },
      { name: '16oz Iced', price_adjustment: 0.75 }
    ],
    modifiers: [{ name: 'Coconut Milk', price_adjustment: 0.60 }]
  },
  {
    id: 'item-6',
    category_id: 'cat-bakery',
    category_name: 'Fresh Bakery',
    name: 'Almond Frangipane Croissant',
    description: 'Twice-baked French butter croissant filled with velvety almond cream and toasted flakes.',
    base_price: 4.85,
    prep_time_minutes: 1,
    calories: 380,
    is_available: true,
    sizes: [{ name: 'Standard', price_adjustment: 0.0 }],
    modifiers: [{ name: 'Warmed Up', price_adjustment: 0.0 }]
  }
];

export const INITIAL_INVENTORY = [
  { id: 'inv-1', name: 'Ethiopian Coffee Beans', sku: 'COF-ETH-01', category: 'coffee_beans', current_stock: 14.5, unit: 'kg', reorder_threshold: 5.0, cost_per_unit: 18.50, supplier: 'Addis Roast Imports' },
  { id: 'inv-2', name: 'Organic Whole Milk', sku: 'DRY-MLK-01', category: 'dairy', current_stock: 24.0, unit: 'liters', reorder_threshold: 10.0, cost_per_unit: 2.20, supplier: 'Valley Organic Dairy' },
  { id: 'inv-3', name: 'Barista Oat Milk', sku: 'ALT-OAT-01', category: 'dairy_alternatives', current_stock: 32.0, unit: 'liters', reorder_threshold: 12.0, cost_per_unit: 3.40, supplier: 'OatField Co.' },
  { id: 'inv-4', name: 'Ceylon Amber Black Tea', sku: 'TEA-CEY-01', category: 'tea', current_stock: 6.2, unit: 'kg', reorder_threshold: 2.0, cost_per_unit: 24.00, supplier: 'Highland Estates' },
  { id: 'inv-5', name: 'Madagascar Caramel Syrup', sku: 'SYR-CAR-01', category: 'syrups', current_stock: 3.5, unit: 'liters', reorder_threshold: 2.0, cost_per_unit: 14.00, supplier: 'Monin Artisans' },
  { id: 'inv-6', name: 'Fresh Garden Mint', sku: 'PRO-MNT-01', category: 'produce', current_stock: 1.8, unit: 'kg', reorder_threshold: 1.0, cost_per_unit: 9.00, supplier: 'Local Farm Collective' },
];

export const INITIAL_ORDERS = [
  {
    id: 'ord-1041',
    order_number: 'CP-1041',
    order_type: 'dine_in',
    customer_name: 'James Walker',
    status: 'completed',
    items: [
      { item_name: 'Signature Caramel Latte', size_name: 'Medium (12oz)', quantity: 1, unit_price: 6.25, modifiers: [] }
    ],
    subtotal: 6.25,
    tax: 0.52,
    total: 6.77,
    created_at: new Date(Date.now() - 45 * 60000).toISOString(),
    payment_status: 'paid'
  },
  {
    id: 'ord-1042',
    order_number: 'CP-1042',
    order_type: 'online_pickup',
    customer_name: 'Elena Rostova',
    status: 'preparing',
    pickup_time: '10-15 min',
    items: [
      { item_name: 'Golden Amber Citrus Tea', size_name: 'Large (16oz)', quantity: 1, unit_price: 5.25, modifiers: [{ modifier_name: 'Extra Honey', price_adjustment: 0.50 }] },
      { item_name: 'Almond Frangipane Croissant', size_name: 'Standard', quantity: 1, unit_price: 4.85, modifiers: [] }
    ],
    subtotal: 10.60,
    tax: 0.87,
    total: 11.47,
    created_at: new Date(Date.now() - 8 * 60000).toISOString(),
    payment_status: 'paid'
  },
  {
    id: 'ord-1043',
    order_number: 'CP-1043',
    order_type: 'takeaway',
    customer_name: 'Marcus Chen',
    status: 'pending',
    items: [
      { item_name: 'Spanish Cortado', size_name: 'Standard (4oz)', quantity: 2, unit_price: 4.25, modifiers: [] }
    ],
    subtotal: 8.50,
    tax: 0.70,
    total: 9.20,
    created_at: new Date(Date.now() - 2 * 60000).toISOString(),
    payment_status: 'paid'
  }
];
