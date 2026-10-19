import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  Clock,
  Printer,
  X,
  Layers,
  ArrowRight,
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import GlassButton from '../components/common/GlassButton';
import GlassModal from '../components/common/GlassModal';
import GlassInput from '../components/common/GlassInput';
import ErrorState from '../components/common/ErrorState';
import { useToast } from '../context/ToastContext';
import menuService from '../services/menuService';
import orderService from '../services/orderService';

export default function PosPage() {
  const { addToast } = useToast();

  // Menu data
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart & Order
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState('dine_in'); // dine_in, takeaway
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [discountAmount, setDiscountAmount] = useState(0.0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Completed order receipt modal
  const [completedOrder, setCompletedOrder] = useState(null);

  // Load Menu Catalog
  const loadMenu = async () => {
    setIsLoading(true);
    try {
      const [cats, menuItems] = await Promise.all([
        menuService.getCategories(),
        menuService.getMenuItems({ available_only: true }),
      ]);
      setCategories(cats);
      setItems(menuItems);
      setError(null);
    } catch (err) {
      setError('Cannot load POS menu catalog from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  // Quick Add Item to Cart
  const handleAddToCart = (item) => {
    const existingIndex = cart.findIndex((c) => c.menu_item_id === item.id);
    if (existingIndex > -1) {
      setCart((prev) =>
        prev.map((c, i) => (i === existingIndex ? { ...c, quantity: c.quantity + 1 } : c))
      );
    } else {
      setCart((prev) => [
        ...prev,
        {
          menu_item_id: item.id,
          item_name: item.name,
          size_name: item.sizes && item.sizes.length > 0 ? item.sizes[0].name : null,
          unit_price: item.base_price,
          quantity: 1,
          modifiers: [],
        },
      ]);
    }
    addToast({
      type: 'success',
      title: item.name,
      message: 'Added to cart.',
    });
  };

  // Modify Quantity
  const handleUpdateQty = (index, delta) => {
    setCart((prev) => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  // Totals Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);
  }, [cart]);

  const tax = useMemo(() => Math.max(0, (subtotal - discountAmount) * 0.0825), [subtotal, discountAmount]);
  const total = useMemo(() => Math.max(0, subtotal - discountAmount + tax), [subtotal, discountAmount, tax]);

  // Submit POS Order
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      const payload = {
        order_type: orderType,
        customer_name: customerName.trim() || 'Walk-in Customer',
        pickup_time: orderType === 'dine_in' ? 'Table Service' : 'Takeaway Counter',
        payment_method: paymentMethod,
        discount: discountAmount,
        items: cart,
      };

      const placed = await orderService.createOrder(payload);
      setCompletedOrder(placed);
      setCart([]);
      setDiscountAmount(0.0);
      setCustomerName('Walk-in Customer');
      addToast({
        type: 'success',
        title: `Order #${placed.order_number}`,
        message: 'Order routed to kitchen queue and receipt created.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Checkout Error',
        message: err.response?.data?.detail || 'Failed to complete transaction.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCategory !== 'all' && item.category_id !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.category_name?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [items, selectedCategory, searchQuery]);

  if (error) {
    return (
      <div className="p-6">
        <ErrorState title="POS Catalog Offline" message={error} onRetry={loadMenu} />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col select-none">
      {/* 2-Column Register Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0">
        {/* LEFT COLUMN: Menu Catalog Grid (Col 7) */}
        <div className="lg:col-span-7 flex flex-col space-y-4 min-h-0">
          {/* Category Pills & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full sm:w-auto">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-espresso-900 text-cream-50 dark:bg-caramel-500 dark:text-espresso-950 font-bold shadow-sm'
                    : 'glass-surface'
                }`}
              >
                All Items
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                    selectedCategory === c.id
                      ? 'bg-espresso-900 text-cream-50 dark:bg-caramel-500 dark:text-espresso-950 font-bold shadow-sm'
                      : 'glass-surface'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-espresso-900/40 dark:text-cream-200/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 rounded-xl text-xs glass-input text-espresso-900 dark:text-cream-50 border border-white/20 focus:outline-none"
              />
            </div>
          </div>

          {/* Product Items Grid */}
          <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleAddToCart(item)}
                className="p-3.5 rounded-2xl glass-card flex flex-col justify-between text-left hover:border-caramel-500/60 active:scale-97 transition-all cursor-pointer group shadow-sm h-32"
              >
                <div>
                  <span className="text-[10px] font-bold text-terracotta-500 dark:text-caramel-400 uppercase tracking-wider block">
                    {item.category_name}
                  </span>
                  <h4 className="font-serif text-sm font-bold text-espresso-900 dark:text-cream-50 line-clamp-2 leading-snug group-hover:text-caramel-400 transition-colors">
                    {item.name}
                  </h4>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="font-bold text-sm text-espresso-900 dark:text-cream-50">
                    ${item.base_price.toFixed(2)}
                  </span>
                  <span className="w-6 h-6 rounded-full bg-caramel-500/20 text-caramel-400 flex items-center justify-center group-hover:bg-caramel-500 group-hover:text-espresso-950 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Register Cart & Totals (Col 5) */}
        <div className="lg:col-span-5 flex flex-col h-full min-h-0">
          <GlassCard className="p-5 flex flex-col justify-between h-full border-2 border-espresso-900/10 dark:border-white/10 shadow-2xl">
            {/* Top Bar: Order Type & Customer Name */}
            <div className="space-y-3 pb-3 border-b border-espresso-900/10 dark:border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-terracotta-500">
                  CURRENT TICKET
                </span>
                <button
                  type="button"
                  onClick={() => setCart([])}
                  className="text-xs text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                >
                  Clear Cart
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType('dine_in')}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                    orderType === 'dine_in'
                      ? 'bg-espresso-900 text-cream-50 dark:bg-caramel-500 dark:text-espresso-950 shadow-sm'
                      : 'bg-black/5 dark:bg-white/5 text-espresso-900/70 dark:text-cream-200/70'
                  }`}
                >
                  Dine In
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('takeaway')}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                    orderType === 'takeaway'
                      ? 'bg-espresso-900 text-cream-50 dark:bg-caramel-500 dark:text-espresso-950 shadow-sm'
                      : 'bg-black/5 dark:bg-white/5 text-espresso-900/70 dark:text-cream-200/70'
                  }`}
                >
                  Takeaway
                </button>
              </div>

              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer or Table #"
                className="w-full h-8 px-3 rounded-xl text-xs glass-input text-espresso-900 dark:text-cream-50 border border-white/20 focus:outline-none"
              />
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1 min-h-[160px]">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-espresso-900/40 dark:text-cream-200/40 space-y-2">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                  <span className="text-xs">No items rung up yet.</span>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-espresso-900/5 dark:bg-white/5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-espresso-900 dark:text-cream-50 truncate block">
                        {item.item_name}
                      </span>
                      <span className="text-[11px] text-espresso-900/60 dark:text-cream-200/60">
                        ${item.unit_price.toFixed(2)} each
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(idx, -1)}
                        className="w-6 h-6 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center hover:bg-black/20"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center font-bold text-xs">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(idx, 1)}
                        className="w-6 h-6 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center hover:bg-black/20"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-bold text-sm text-espresso-900 dark:text-cream-50 w-14 text-right">
                      ${(item.unit_price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Financial Summary & Checkout Actions */}
            <div className="pt-3 border-t border-espresso-900/10 dark:border-white/10 space-y-3">
              <div className="space-y-1 text-xs text-espresso-900/70 dark:text-cream-200/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax (8.25%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-espresso-900 dark:text-cream-50 pt-1 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-terracotta-500 dark:text-caramel-400">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'card', label: 'Card', icon: CreditCard },
                  { id: 'cash', label: 'Cash', icon: Banknote },
                  { id: 'apple_pay', label: 'Wallet', icon: Smartphone },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === m.id
                          ? 'border-caramel-500 bg-caramel-500/20 text-caramel-400 border font-bold'
                          : 'border-white/10 glass-surface'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                disabled={cart.length === 0 || isSubmitting}
                onClick={handleCheckout}
                className="w-full h-12 rounded-2xl bg-[#DCA466] hover:bg-[#E5AF73] text-[#241409] font-bold text-sm shadow-xl flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-40 cursor-pointer"
              >
                <span>Charge ${total.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* RECEIPT MODAL */}
      <GlassModal
        isOpen={Boolean(completedOrder)}
        onClose={() => setCompletedOrder(null)}
        title="Transaction Completed"
      >
        {completedOrder && (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-sage-500/20 text-sage-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-espresso-900 dark:text-cream-50">
              Order #{completedOrder.order_number}
            </h3>
            <p className="text-xs text-espresso-900/60 dark:text-cream-200/60">
              Paid via {completedOrder.payment_method.toUpperCase()} • Sent to Barista Kitchen
            </p>

            <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 text-xs text-left space-y-1.5">
              {completedOrder.items?.map((i, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>
                    {i.quantity}x {i.item_name}
                  </span>
                  <span className="font-bold">${i.total_price.toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-white/10 flex justify-between font-bold">
                <span>Total Paid</span>
                <span>${completedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-center gap-2 pt-2">
              <GlassButton variant="primary" size="md" onClick={() => setCompletedOrder(null)}>
                Start New Ticket
              </GlassButton>
            </div>
          </div>
        )}
      </GlassModal>
    </div>
  );
}
