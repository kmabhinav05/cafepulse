export const INITIAL_CATEGORIES = [
  { id: 'cat-kerala-coffee', name: 'Kaapi & Speciality Brews', icon: 'coffee', description: 'Freshly brewed Wayanad coffee, traditional meter kaapi, and espresso creations', is_active: true },
  { id: 'cat-kerala-chai', name: 'Chai & Sulaimani', icon: 'leaf', description: 'Fragrant Malabar Sulaimani, Munnar spices chai, and refreshing herbal tea', is_active: true },
  { id: 'cat-kerala-bites', name: 'Kerala Chayakada Bites', icon: 'cake', description: 'Authentic Pazham Pori, Sukhiyan, Parippu Vada, and spicy Malabar cutlets', is_active: true },
  { id: 'cat-kerala-cold', name: 'Coolers & Shakes', icon: 'cup-soda', description: 'Tender coconut coolers, Kulukki Sarbath, and spiced buttermilk', is_active: true },
];

export const INITIAL_MENU_ITEMS = [
  {
    id: 'item-1',
    category_id: 'cat-kerala-coffee',
    category_name: 'Kaapi & Speciality Brews',
    name: 'Wayanad Filter Kaapi',
    description: 'Freshly decocted Robusta-Arabica blend from Wayanad hills frothed to perfection in brass dabarah.',
    base_price: 60,
    prep_time_minutes: 3,
    calories: 110,
    is_available: true,
    sizes: [
      { name: 'Standard Dabarah', price_adjustment: 0 },
      { name: 'Double Cup', price_adjustment: 35 }
    ],
    modifiers: [
      { name: 'Extra Strong Decoction', price_adjustment: 15 },
      { name: 'Pure Cow Milk', price_adjustment: 10 },
      { name: 'Jaggery (Vellam) Sweetened', price_adjustment: 10 }
    ]
  },
  {
    id: 'item-2',
    category_id: 'cat-kerala-coffee',
    category_name: 'Kaapi & Speciality Brews',
    name: 'Iced Coconut Caramel Latte',
    description: 'Double-shot local espresso shaken with fresh Kerala coconut milk and palm jaggery caramel.',
    base_price: 180,
    prep_time_minutes: 4,
    calories: 185,
    is_available: true,
    sizes: [
      { name: 'Regular (300ml)', price_adjustment: 0 },
      { name: 'Large (450ml)', price_adjustment: 40 }
    ],
    modifiers: [
      { name: 'Extra Espresso Shot', price_adjustment: 40 },
      { name: 'Oat Milk Sub', price_adjustment: 30 }
    ]
  },
  {
    id: 'item-3',
    category_id: 'cat-kerala-chai',
    category_name: 'Chai & Sulaimani',
    name: 'Malabar Spiced Sulaimani',
    description: 'Heritage Malabar black tea infused with crushed cardamom, fresh mint, ginger, and a dash of lemon.',
    base_price: 50,
    prep_time_minutes: 2,
    calories: 35,
    is_available: true,
    sizes: [
      { name: 'Traditional Cup', price_adjustment: 0 },
      { name: 'Clay Pot Mug', price_adjustment: 20 }
    ],
    modifiers: [
      { name: 'Extra Mint Leaves', price_adjustment: 5 },
      { name: 'Pure Honey', price_adjustment: 15 }
    ]
  },
  {
    id: 'item-4',
    category_id: 'cat-kerala-chai',
    category_name: 'Chai & Sulaimani',
    name: 'Munnar Cardamom Milk Tea',
    description: 'Rich hand-picked Munnar tea dust brewed slowly with fresh whole milk and aromatic Idukki cardamom.',
    base_price: 55,
    prep_time_minutes: 3,
    calories: 120,
    is_available: true,
    sizes: [
      { name: 'Standard Glass', price_adjustment: 0 },
      { name: 'Cutting Chai', price_adjustment: -20 }
    ],
    modifiers: [
      { name: 'Ginger Crush (Inchi)', price_adjustment: 10 },
      { name: 'Less Sugar', price_adjustment: 0 }
    ]
  },
  {
    id: 'item-5',
    category_id: 'cat-kerala-bites',
    category_name: 'Kerala Chayakada Bites',
    name: 'Golden Pazham Pori (Banana Fritters)',
    description: 'Crisp, golden-fried ripe Nendran banana fritters with caramelized honey notes and black sesame.',
    base_price: 70,
    prep_time_minutes: 4,
    calories: 220,
    is_available: true,
    sizes: [
      { name: 'Portion of 2', price_adjustment: 0 },
      { name: 'Portion of 4', price_adjustment: 60 }
    ],
    modifiers: [
      { name: 'Beef Roast Dip (Kerala Style)', price_adjustment: 110 },
      { name: 'Vanilla Ice Cream Scoop', price_adjustment: 45 }
    ]
  },
  {
    id: 'item-6',
    category_id: 'cat-kerala-bites',
    category_name: 'Kerala Chayakada Bites',
    name: 'Crispy Parippu Vada (2 pcs)',
    description: 'Crunchy chana dal fritters spiced with shallots (cheriya ulli), green chillies, curry leaves, and ginger.',
    base_price: 60,
    prep_time_minutes: 2,
    calories: 180,
    is_available: true,
    sizes: [{ name: 'Pair (2 pcs)', price_adjustment: 0 }],
    modifiers: [{ name: 'Spicy Coconut Chutney', price_adjustment: 15 }]
  },
  {
    id: 'item-7',
    category_id: 'cat-kerala-cold',
    category_name: 'Coolers & Shakes',
    name: 'Kochi Kulukki Sarbath',
    description: 'Shaken fresh lime cooler with crushed green chillies, sweet basil seeds (sabja), and pineapple hints.',
    base_price: 90,
    prep_time_minutes: 2,
    calories: 80,
    is_available: true,
    sizes: [
      { name: 'Sweet & Spicy', price_adjustment: 0 },
      { name: 'Extra Minty', price_adjustment: 10 }
    ],
    modifiers: [{ name: 'Honey Glaze', price_adjustment: 20 }]
  },
  {
    id: 'item-8',
    category_id: 'cat-kerala-cold',
    category_name: 'Coolers & Shakes',
    name: 'Tender Coconut Elaneer Shake',
    description: 'Velvety shake made from fresh Pollachi tender coconut malai, coconut water, and vanilla cream.',
    base_price: 140,
    prep_time_minutes: 3,
    calories: 210,
    is_available: true,
    sizes: [{ name: 'Chilled Glass (350ml)', price_adjustment: 0 }],
    modifiers: [{ name: 'Roasted Cashew Topping', price_adjustment: 25 }]
  }
];

export const INITIAL_INVENTORY = [
  { id: 'inv-1', name: 'Wayanad Robusta & Arabica Beans', sku: 'COF-WAY-01', category: 'coffee_beans', current_stock: 28.5, unit: 'kg', reorder_threshold: 8.0, cost_per_unit: 480.00, supplier: 'Western Ghats Planters Co-op' },
  { id: 'inv-2', name: 'Munnar CTC Tea Dust', sku: 'TEA-MUN-01', category: 'tea', current_stock: 18.0, unit: 'kg', reorder_threshold: 5.0, cost_per_unit: 360.00, supplier: 'Kannan Devan Hills Estates' },
  { id: 'inv-3', name: 'Milma Fresh Whole Milk', sku: 'DRY-MLM-01', category: 'dairy', current_stock: 45.0, unit: 'liters', reorder_threshold: 15.0, cost_per_unit: 56.00, supplier: 'Milma Kerala Milk Marketing Fed' },
  { id: 'inv-4', name: 'Ripe Kerala Nendran Bananas', sku: 'PRD-NEN-01', category: 'produce', current_stock: 22.0, unit: 'kg', reorder_threshold: 6.0, cost_per_unit: 55.00, supplier: 'Thrissur Mandi Farmers' },
  { id: 'inv-5', name: 'Idukki Green Cardamom (Elaichi)', sku: 'SPC-ELA-01', category: 'spices', current_stock: 4.5, unit: 'kg', reorder_threshold: 1.5, cost_per_unit: 2200.00, supplier: 'Cardamom Planters Association, Kumily' },
  { id: 'inv-6', name: 'Organic Marayoor Palm Jaggery (Vellam)', sku: 'SYR-MAR-01', category: 'sweeteners', current_stock: 12.0, unit: 'kg', reorder_threshold: 4.0, cost_per_unit: 120.00, supplier: 'Marayoor Sugarcane Guild' },
];

export const INITIAL_ORDERS = [
  {
    id: 'ord-1041',
    order_number: 'KL-1041',
    order_type: 'dine_in',
    customer_name: 'Rahul Nair',
    status: 'completed',
    items: [
      { item_name: 'Wayanad Filter Kaapi', size_name: 'Standard Dabarah', quantity: 2, unit_price: 60, modifiers: [] },
      { item_name: 'Golden Pazham Pori (Banana Fritters)', size_name: 'Portion of 2', quantity: 1, unit_price: 70, modifiers: [] }
    ],
    subtotal: 190,
    tax: 9.50,
    total: 199.50,
    created_at: new Date(Date.now() - 35 * 60000).toISOString(),
    payment_status: 'paid'
  },
  {
    id: 'ord-1042',
    order_number: 'KL-1042',
    order_type: 'online_pickup',
    customer_name: 'Anjali Menon (Kochi)',
    status: 'preparing',
    pickup_time: '10-15 min',
    items: [
      { item_name: 'Malabar Spiced Sulaimani', size_name: 'Traditional Cup', quantity: 1, unit_price: 50, modifiers: [{ modifier_name: 'Extra Mint Leaves', price_adjustment: 5 }] },
      { item_name: 'Crispy Parippu Vada (2 pcs)', size_name: 'Pair (2 pcs)', quantity: 2, unit_price: 60, modifiers: [] }
    ],
    subtotal: 175,
    tax: 8.75,
    total: 183.75,
    created_at: new Date(Date.now() - 10 * 60000).toISOString(),
    payment_status: 'paid'
  },
  {
    id: 'ord-1043',
    order_number: 'KL-1043',
    order_type: 'takeaway',
    customer_name: 'Vishnu Kumar (Calicut)',
    status: 'pending',
    items: [
      { item_name: 'Kochi Kulukki Sarbath', size_name: 'Sweet & Spicy', quantity: 2, unit_price: 90, modifiers: [] },
      { item_name: 'Tender Coconut Elaneer Shake', size_name: 'Chilled Glass (350ml)', quantity: 1, unit_price: 140, modifiers: [] }
    ],
    subtotal: 320,
    tax: 16.00,
    total: 336.00,
    created_at: new Date(Date.now() - 3 * 60000).toISOString(),
    payment_status: 'paid'
  }
];
