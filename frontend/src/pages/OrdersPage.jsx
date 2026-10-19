import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  Coffee,
  Check,
  ChevronRight,
  Flame,
  User,
  Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/common/GlassCard';
import GlassButton from '../components/common/GlassButton';
import GlassBadge from '../components/common/GlassBadge';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { useToast } from '../context/ToastContext';
import orderService from '../services/orderService';

export default function OrdersPage() {
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderTypeFilter, setOrderTypeFilter] = useState('all'); // all, online_pickup, dine_in, takeaway

  // Load Orders
  const loadOrders = async () => {
    try {
      const data = await orderService.getOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Cannot connect to live order stream.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  // Advance Order Status
  const handleAdvanceStatus = async (order, nextStatus) => {
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: nextStatus } : o))
    );

    try {
      await orderService.updateOrderStatus(order.id, nextStatus);
      addToast({
        type: 'success',
        title: `Order #${order.order_number}`,
        message: `Advanced to ${nextStatus.toUpperCase()}.`,
      });
    } catch (err) {
      loadOrders(); // revert
      addToast({
        type: 'error',
        title: 'Status Update Failed',
        message: 'Could not update order status on server.',
      });
    }
  };

  // Filter orders by type
  const filteredOrders = orders.filter((o) => {
    if (orderTypeFilter !== 'all' && o.order_type !== orderTypeFilter) return false;
    return true;
  });

  // Kanban buckets
  const pendingOrders = filteredOrders.filter((o) => o.status === 'pending');
  const preparingOrders = filteredOrders.filter((o) => o.status === 'preparing');
  const readyOrders = filteredOrders.filter((o) => o.status === 'ready');
  const completedOrders = filteredOrders.filter((o) => o.status === 'completed');

  if (error && orders.length === 0) {
    return (
      <div className="p-6">
        <ErrorState title="Kitchen Stream Unreachable" message={error} onRetry={loadOrders} />
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none">
      {/* 1. TOP HEADER & KITCHEN METRICS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta-500">
            BARISTA KITCHEN DISPLAY SYSTEM (KDS)
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-espresso-900 dark:text-cream-50 tracking-tight">
            Live Kitchen Queue
          </h1>
          <p className="text-sm text-espresso-900/60 dark:text-cream-200/60">
            Real-time synchronization between Online Customer orders and in-store POS.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl glass-surface text-xs font-medium">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'online_pickup', label: 'Online Pickup' },
              { id: 'dine_in', label: 'Dine In' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setOrderTypeFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  orderTypeFilter === tab.id
                    ? 'bg-espresso-900 text-cream-50 dark:bg-caramel-500 dark:text-espresso-950 font-bold'
                    : 'text-espresso-900/60 dark:text-cream-200/60 hover:text-espresso-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <GlassButton variant="ghost" size="sm" onClick={loadOrders} className="flex items-center gap-1.5">
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </GlassButton>
        </div>
      </div>

      {/* 2. KANBAN 4-COLUMN WORKFLOW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Column 1: Pending (New Orders) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-espresso-900/80 dark:text-cream-200/80">
                Incoming
              </h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 font-bold">
              {pendingOrders.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[500px]">
            {pendingOrders.map((order) => (
              <OrderKanbanCard
                key={order.id}
                order={order}
                actionLabel="Start Brewing →"
                actionColor="bg-amber-500 text-espresso-950"
                onAction={() => handleAdvanceStatus(order, 'preparing')}
              />
            ))}
            {pendingOrders.length === 0 && (
              <div className="p-8 text-center text-xs text-espresso-900/40 dark:text-cream-200/40 border border-dashed border-white/10 rounded-2xl">
                No new orders
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Preparing (Brewing) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-terracotta-500" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-espresso-900/80 dark:text-cream-200/80">
                Brewing
              </h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-terracotta-500/15 text-terracotta-500 font-bold">
              {preparingOrders.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[500px]">
            {preparingOrders.map((order) => (
              <OrderKanbanCard
                key={order.id}
                order={order}
                actionLabel="Mark Ready ✓"
                actionColor="bg-terracotta-500 text-white"
                onAction={() => handleAdvanceStatus(order, 'ready')}
              />
            ))}
            {preparingOrders.length === 0 && (
              <div className="p-8 text-center text-xs text-espresso-900/40 dark:text-cream-200/40 border border-dashed border-white/10 rounded-2xl">
                Kitchen clear
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Ready (Counter Pickup) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sage-500" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-espresso-900/80 dark:text-cream-200/80">
                Ready for Pickup
              </h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-sage-500/15 text-sage-500 font-bold">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[500px]">
            {readyOrders.map((order) => (
              <OrderKanbanCard
                key={order.id}
                order={order}
                actionLabel="Handed Off ✕"
                actionColor="bg-sage-600 text-white"
                onAction={() => handleAdvanceStatus(order, 'completed')}
              />
            ))}
            {readyOrders.length === 0 && (
              <div className="p-8 text-center text-xs text-espresso-900/40 dark:text-cream-200/40 border border-dashed border-white/10 rounded-2xl">
                No orders waiting
              </div>
            )}
          </div>
        </div>

        {/* Column 4: Completed History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-espresso-900/40 dark:bg-white/40" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-espresso-900/80 dark:text-cream-200/80">
                Completed
              </h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 font-bold">
              {completedOrders.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[500px]">
            {completedOrders.slice(0, 5).map((order) => (
              <GlassCard key={order.id} className="p-4 space-y-2 opacity-70 hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-espresso-900 dark:text-cream-50">#{order.order_number}</span>
                  <span className="text-espresso-900/50 dark:text-cream-200/50">{order.customer_name}</span>
                </div>
                <div className="text-[11px] text-espresso-900/70 dark:text-cream-200/70">
                  {order.items?.map((i) => `${i.quantity}x ${i.item_name}`).join(', ')}
                </div>
                <div className="flex justify-between items-center text-[10px] text-espresso-900/50 dark:text-cream-200/50 pt-1 border-t border-white/10">
                  <span>${order.total.toFixed(2)}</span>
                  <span className="text-sage-500 font-semibold">Completed</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Kanban Card Component
function OrderKanbanCard({ order, actionLabel, actionColor, onAction }) {
  const isOnline = order.order_type === 'online_pickup';

  return (
    <GlassCard className="p-4 space-y-3 border-l-4 border-l-caramel-500 shadow-md">
      {/* Header: Order Number, Tag, Time */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-serif font-extrabold text-base text-espresso-900 dark:text-cream-50">
              #{order.order_number}
            </span>
            {isOnline ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-terracotta-500/20 text-terracotta-500 font-bold">
                ONLINE PICKUP
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-espresso-900/10 dark:bg-white/10 font-bold">
                DINE IN
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-espresso-900/80 dark:text-cream-200/80 block mt-0.5">
            {order.customer_name}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10.5px] font-bold text-caramel-400 block">{order.pickup_time}</span>
          <span className="text-[10px] text-espresso-900/50 dark:text-cream-200/50">
            ${order.total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-1.5 py-2 border-y border-espresso-900/10 dark:border-white/10">
        {order.items?.map((item, idx) => (
          <div key={idx} className="text-xs">
            <div className="flex items-baseline justify-between font-medium text-espresso-900 dark:text-cream-50">
              <span>
                <strong className="text-terracotta-500">{item.quantity}x</strong> {item.item_name}
              </span>
              {item.size_name && (
                <span className="text-[10.5px] text-espresso-900/60 dark:text-cream-200/60">
                  {item.size_name}
                </span>
              )}
            </div>
            {item.modifiers && item.modifiers.length > 0 && (
              <span className="text-[10px] text-espresso-900/60 dark:text-cream-200/60 block pl-4">
                ↳ {item.modifiers.map((m) => m.modifier_name).join(', ')}
              </span>
            )}
            {item.notes && (
              <span className="text-[10px] italic text-amber-500 block pl-4">
                Note: {item.notes}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Customer Notes */}
      {order.notes && (
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 text-[10.5px] font-medium">
          Special Note: {order.notes}
        </div>
      )}

      {/* 1-Click Action Button */}
      <button
        type="button"
        onClick={onAction}
        className={`w-full py-2 rounded-xl font-bold text-xs shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer ${actionColor}`}
      >
        <span>{actionLabel}</span>
      </button>
    </GlassCard>
  );
}
