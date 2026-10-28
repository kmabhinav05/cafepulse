import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Coffee,
  ShoppingBag,
  Clock,
  Flame,
  Plus,
  Minus,
  Check,
  ArrowRight,
  Sparkles,
  CupSoda,
  Leaf,
  Cake,
  Layers,
  Search,
  CheckCircle2,
  PackageCheck,
  RefreshCw,
  X,
  CreditCard,
  User,
  Phone,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CafePulseLogo from '../components/layout/CafePulseLogo';
import ThemeToggle from '../components/ui/ThemeToggle';
import GlassCard from '../components/common/GlassCard';
import GlassButton from '../components/common/GlassButton';
import GlassModal from '../components/common/GlassModal';
import GlassInput from '../components/common/GlassInput';
import ErrorState from '../components/common/ErrorState';
import { useToast } from '../context/ToastContext';
import menuService from '../services/menuService';
import orderService from '../services/orderService';

export default function CustomerOrderPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [searchParams] = useSearchParams();

  // Data states
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart state
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Customization Modal State
  const [activeItem, setActiveItem] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedModifiers, setSelectedModifiers] = useState([]);
  const [itemNotes, setItemNotes] = useState('');

  // Checkout states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupTime, setPickupTime] = useState('ASAP (10-15 min)');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Placed Order state for live tracking
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Load Menu Data
  const loadMenu = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [cats, menuItems] = await Promise.all([
        menuService.getCategories(),
        menuService.getMenuItems({ available_only: true }),
      ]);
      setCategories(cats);
      setItems(menuItems);
    } catch (err) {
      setError('Cannot connect to CafePulse kitchen. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  // Poll confirmed order status if active
  useEffect(() => {
    if (!confirmedOrder || confirmedOrder.status === 'completed') return;
    const interval = setInterval(async () => {
      try {
        const updated = await orderService.trackOrder(confirmedOrder.order_number);
        setConfirmedOrder(updated);
      } catch (e) {
        // Silent poll fail
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [confirmedOrder]);

  // Open Customization Modal
  const handleOpenCustomize = async (item) => {
    try {
      const detailed = await menuService.getMenuItem(item.id);
      setActiveItem(detailed);
      setSelectedSize(detailed.sizes && detailed.sizes.length > 0 ? detailed.sizes[0] : null);
      setSelectedModifiers([]);
      setItemNotes('');
    } catch (e) {
      // Fallback to basic item
      setActiveItem(item);
      setSelectedSize(null);
      setSelectedModifiers([]);
      setItemNotes('');
    }
  };

  // Toggle modifier option
  const toggleModifier = (modOption) => {
    const exists = selectedModifiers.find((m) => m.name === modOption.name);
    if (exists) {
      setSelectedModifiers((prev) => prev.filter((m) => m.name !== modOption.name));
    } else {
      setSelectedModifiers((prev) => [...prev, modOption]);
    }
  };

  // Add Item to Cart
  const handleAddToCart = () => {
    if (!activeItem) return;

    const unitBase = activeItem.base_price + (selectedSize ? selectedSize.price_adjustment : 0);
    const cartEntry = {
      menu_item_id: activeItem.id,
      item_name: activeItem.name,
      size_name: selectedSize ? selectedSize.name : null,
      unit_price: unitBase,
      quantity: 1,
      notes: itemNotes.trim() || null,
      modifiers: selectedModifiers.map((m) => ({
        modifier_name: m.name,
        price_adjustment: m.price_adjustment,
      })),
    };

    setCart((prev) => [...prev, cartEntry]);
    setActiveItem(null);
    setIsCartOpen(true);
    addToast({
      type: 'success',
      title: 'Added to Order',
      message: `${activeItem.name} added to your cart.`,
    });
  };

  // Cart Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, entry) => {
      const modTotal = entry.modifiers.reduce((mAcc, m) => mAcc + m.price_adjustment, 0);
      return acc + (entry.unit_price + modTotal) * entry.quantity;
    }, 0);
  }, [cart]);

  const taxAmount = useMemo(() => cartSubtotal * 0.05, [cartSubtotal]);
  const cartTotal = useMemo(() => cartSubtotal + taxAmount, [cartSubtotal, taxAmount]);

  // Submit Order to Kitchen
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      addToast({
        type: 'warning',
        title: 'Name Required',
        message: 'Please provide your name so we can call your order.',
      });
      return;
    }

    setIsPlacingOrder(true);
    try {
      const payload = {
        order_type: 'online_pickup',
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim() || null,
        pickup_time: pickupTime,
        payment_method: paymentMethod,
        items: cart,
      };

      const placed = await orderService.createOrder(payload);
      setConfirmedOrder(placed);
      setCart([]);
      setIsCartOpen(false);
      addToast({
        type: 'success',
        title: 'Order Received!',
        message: `Order #${placed.order_number} sent directly to the barista kitchen.`,
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Checkout Failed',
        message: err.response?.data?.detail || 'Could not place order. Please try again.',
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCategory !== 'all' && item.category_id !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.category_name?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-[#FAF4ED] dark:bg-[#140D08] text-espresso-900 dark:text-[#FAF3EB] transition-colors duration-500">
      {/* Soft atmospheric background illumination */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-[12%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#F8C4A9]/50 via-[#F7BA9C]/30 to-transparent blur-[120px] dark:from-[#4E2412]/70 dark:via-[#351608]/50" />
        <div className="absolute top-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-[#D8E7D5]/50 to-transparent blur-[130px] dark:from-[#1D2C1A]/40 dark:via-[#131F11]/25" />
      </div>

      {/* 1. TOP HEADER */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-12 pt-6 pb-4 flex items-center justify-between border-b border-espresso-900/10 dark:border-white/10">
        <CafePulseLogo />

        <div className="flex items-center gap-3">
          {/* Staff Login Link */}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-xs font-semibold text-espresso-900/70 dark:text-cream-200/70 hover:text-espresso-900 dark:hover:text-cream-50 transition-colors"
          >
            Staff Portal →
          </button>

          <ThemeToggle />

          {/* Cart Button with Badge */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative px-3.5 py-2 rounded-full flex items-center gap-2 bg-[#DCA466] text-[#241409] font-bold text-xs shadow-md shadow-[#DCA466]/25 hover:bg-[#E5AF73] active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Bag</span>
            {cart.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#241409] text-white text-[11px] flex items-center justify-center font-black">
                {cart.reduce((a, c) => a + c.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* 2. STOREFRONT HERO & PICKUP STATUS BANNER */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 pt-6">
        <div className="p-6 rounded-3xl bg-gradient-to-r from-espresso-900 to-[#2A180E] text-cream-50 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-[11px] font-bold tracking-wider text-caramel-400 uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>KOCHI & WAYANAD ARTISAN CAFE • KERALA</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight">
              Order Fresh Kerala Kaapi & Chayakada Bites
            </h1>
            <p className="text-sm text-cream-200/70 max-w-xl">
              Authentic Wayanad filter coffee, fragrant Malabar Sulaimani, hot Pazham Pori, and Kochi Kulukki Sarbath prepared fresh.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shrink-0">
            <Clock className="w-6 h-6 text-caramel-400" />
            <div>
              <span className="block text-[11px] uppercase tracking-wider text-cream-200/60 font-semibold">
                Estimated Prep Time
              </span>
              <span className="text-base font-bold text-cream-50">10 – 15 Minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CONFIRMED ORDER LIVE TRACKER (IF PLACED) */}
      <AnimatePresence>
        {confirmedOrder && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 pt-6"
          >
            <div className="p-6 rounded-3xl bg-[#1C120B] text-cream-50 border-2 border-caramel-500 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs text-caramel-400 font-bold uppercase tracking-wider">
                    LIVE ORDER PASS
                  </span>
                  <h3 className="font-serif text-2xl font-bold flex items-center gap-3">
                    Order #{confirmedOrder.order_number}
                    <span className="text-sm font-sans font-medium text-cream-200/70">
                      for {confirmedOrder.customer_name}
                    </span>
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-cream-200/60 block">Pickup Ready At</span>
                  <span className="font-bold text-caramel-400">{confirmedOrder.pickup_time}</span>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs font-semibold">
                {[
                  { id: 'pending', label: '1. Received' },
                  { id: 'preparing', label: '2. Brewing' },
                  { id: 'ready', label: '3. Ready at Counter' },
                  { id: 'completed', label: '4. Enjoyed' },
                ].map((step, idx) => {
                  const stepIndex = ['pending', 'preparing', 'ready', 'completed'].indexOf(confirmedOrder.status);
                  const isCurrent = step.id === confirmedOrder.status;
                  const isDone = stepIndex >= idx;
                  return (
                    <div
                      key={step.id}
                      className={`p-3 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'border-caramel-400 bg-caramel-500/20 text-caramel-300 font-bold shadow-lg animate-pulse'
                          : isDone
                          ? 'border-white/20 bg-white/10 text-cream-50'
                          : 'border-white/5 bg-black/20 text-cream-200/40'
                      }`}
                    >
                      {step.label}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-cream-200/70 pt-2">
                <span>Items: {confirmedOrder.items?.map((i) => `${i.quantity}x ${i.item_name}`).join(', ')}</span>
                <button
                  onClick={() => setConfirmedOrder(null)}
                  className="text-caramel-400 hover:underline"
                >
                  Dismiss Pass ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. CATEGORY SELECTOR & SEARCH */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 sm:px-12 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full sm:w-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === 'all'
                  ? 'bg-espresso-900 text-cream-50 dark:bg-caramel-500 dark:text-espresso-950 shadow-md'
                  : 'glass-surface hover:text-espresso-900'
              }`}
            >
              All Items ({items.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all ${
                  selectedCategory === c.id
                    ? 'bg-espresso-900 text-cream-50 dark:bg-caramel-500 dark:text-espresso-950 shadow-md'
                    : 'glass-surface hover:text-espresso-900'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-espresso-900/40 dark:text-cream-200/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search beverages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-xl text-xs font-medium glass-input text-espresso-900 dark:text-cream-50 border border-white/20 focus:outline-none"
            />
          </div>
        </div>

        {/* 5. MENU ITEMS GRID */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="h-44 rounded-3xl glass-card animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => (
              <GlassCard
                key={item.id}
                className="p-5 flex flex-col justify-between hover:border-caramel-500/40 transition-all duration-200"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] font-bold text-terracotta-500 dark:text-caramel-400 uppercase tracking-wider">
                      {item.category_name}
                    </span>
                    <span className="font-serif text-lg font-bold text-espresso-900 dark:text-cream-50">
                      ₹{item.base_price.toFixed(2)}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-espresso-900 dark:text-cream-50 leading-snug">
                    {item.name}
                  </h3>

                  {item.description && (
                    <p className="text-xs text-espresso-900/65 dark:text-cream-200/65 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-espresso-900/10 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-espresso-900/60 dark:text-cream-200/60">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-terracotta-500" />
                      {item.prep_time_minutes}m
                    </span>
                    {item.calories && (
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-caramel-500" />
                        {item.calories} cal
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenCustomize(item)}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#DCA466] hover:bg-[#E5AF73] text-[#241409] flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Select</span>
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </main>

      {/* 6. CUSTOMIZATION MODAL */}
      <GlassModal
        isOpen={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
        title={activeItem ? activeItem.name : 'Customize Beverage'}
      >
        {activeItem && (
          <div className="space-y-5">
            <p className="text-xs text-espresso-900/70 dark:text-cream-200/70">
              {activeItem.description}
            </p>

            {/* Size Selection */}
            {activeItem.sizes && activeItem.sizes.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-espresso-900/80 dark:text-cream-200/80 block">
                  Select Size
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {activeItem.sizes.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`p-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between border transition-all ${
                        selectedSize?.id === s.id
                          ? 'border-caramel-500 bg-caramel-500/20 text-caramel-400 font-bold'
                          : 'border-white/10 glass-surface text-espresso-900 dark:text-cream-50'
                      }`}
                    >
                      <span>{s.name}</span>
                      <span>
                        {s.price_adjustment > 0 ? `+₹${s.price_adjustment.toFixed(2)}` : 'Standard'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Modifier Groups (e.g. Milk Choice, Syrups) */}
            {activeItem.modifier_groups && activeItem.modifier_groups.map((group) => (
              <div key={group.id} className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-espresso-900/80 dark:text-cream-200/80 block">
                  {group.name}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {group.options.map((opt) => {
                    const isSelected = selectedModifiers.some((m) => m.name === opt.name);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleModifier(opt)}
                        className={`p-2 rounded-xl text-xs flex items-center justify-between border transition-all ${
                          isSelected
                            ? 'border-caramel-500 bg-caramel-500/20 text-caramel-400 font-bold'
                            : 'border-white/10 glass-surface text-espresso-900 dark:text-cream-50'
                        }`}
                      >
                        <span>{opt.name}</span>
                        {opt.price_adjustment > 0 && (
                          <span className="text-[10px] text-espresso-900/60 dark:text-cream-200/60">
                            +₹{opt.price_adjustment.toFixed(2)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Barista Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-espresso-900/80 dark:text-cream-200/80 block">
                Special Instructions
              </label>
              <GlassInput
                placeholder="e.g. Extra hot, light foam, no plastic lid"
                value={itemNotes}
                onChange={(e) => setItemNotes(e.target.value)}
              />
            </div>

            {/* Add to Bag Footer Button */}
            <div className="pt-3 border-t border-espresso-900/10 dark:border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-espresso-900/60 dark:text-cream-200/60 block">Total</span>
                <span className="font-serif text-xl font-bold text-espresso-900 dark:text-cream-50">
                  $
                  {(
                    activeItem.base_price +
                    (selectedSize ? selectedSize.price_adjustment : 0) +
                    selectedModifiers.reduce((acc, m) => acc + m.price_adjustment, 0)
                  ).toFixed(2)}
                </span>
              </div>
              <GlassButton variant="primary" size="md" onClick={handleAddToCart}>
                Add to Order Bag →
              </GlassButton>
            </div>
          </div>
        )}
      </GlassModal>

      {/* 7. SLIDE-OUT CART & CHECKOUT DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#18100A] text-cream-50 p-6 flex flex-col justify-between shadow-2xl border-l border-white/10"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-caramel-400" />
                    <h2 className="font-serif text-xl font-bold">Your Cafe Order</h2>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 rounded-full text-cream-200/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Items in Cart */}
                <div className="py-4 space-y-3 max-h-[40vh] overflow-y-auto pr-1">
                  {cart.length === 0 ? (
                    <div className="text-center py-8 text-cream-200/50 space-y-2">
                      <ShoppingBag className="w-10 h-10 mx-auto opacity-30" />
                      <p className="text-sm">Your bag is currently empty.</p>
                    </div>
                  ) : (
                    cart.map((entry, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <h4 className="font-semibold text-sm text-cream-50">{entry.item_name}</h4>
                          {entry.size_name && (
                            <span className="text-[11px] text-caramel-400 block">{entry.size_name}</span>
                          )}
                          {entry.modifiers && entry.modifiers.length > 0 && (
                            <span className="text-[10.5px] text-cream-200/60 block">
                              + {entry.modifiers.map((m) => m.modifier_name).join(', ')}
                            </span>
                          )}
                          {entry.notes && (
                            <span className="text-[10px] italic text-cream-200/50 block">"{entry.notes}"</span>
                          )}
                        </div>

                        <div className="text-right space-y-1 shrink-0">
                          <span className="font-bold text-sm text-cream-50 block">
                            ₹{(entry.unit_price * entry.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => setCart((prev) => prev.filter((_, i) => i !== idx))}
                            className="text-[10px] text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Checkout Form */}
              {cart.length > 0 && (
                <form onSubmit={handlePlaceOrder} className="space-y-4 pt-4 border-t border-white/10">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-caramel-400 block">
                      Pickup Info
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Your Name *"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl text-xs bg-white/10 text-white placeholder:text-white/40 border border-white/20 focus:outline-none focus:border-caramel-400"
                      />
                      <input
                        type="tel"
                        placeholder="Phone (SMS alert)"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl text-xs bg-white/10 text-white placeholder:text-white/40 border border-white/20 focus:outline-none focus:border-caramel-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-cream-200/70 border-t border-white/10 pt-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{cartSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (5%)</span>
                      <span>₹{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base text-cream-50 pt-1">
                      <span>Total</span>
                      <span className="text-caramel-400">₹{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPlacingOrder}
                    className="w-full h-12 rounded-2xl bg-[#DCA466] hover:bg-[#E5AF73] text-[#241409] font-bold text-sm shadow-xl flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isPlacingOrder ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Send to Barista • ₹{cartTotal.toFixed(2)}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="relative z-10 w-full text-center py-6 border-t border-espresso-900/10 dark:border-white/10 text-xs text-espresso-900/60 dark:text-cream-200/60">
        © 2026 CafePulse Platform • Handcrafted for Specialty Coffee Shops
      </footer>
    </div>
  );
}
