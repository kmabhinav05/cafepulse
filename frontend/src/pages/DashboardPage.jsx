import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Coffee,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Layers,
  Flame,
  Package,
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import GlassPanel from '../components/common/GlassPanel';
import GlassBadge from '../components/common/GlassBadge';
import GlassButton from '../components/common/GlassButton';
import TrafficLights from '../components/common/TrafficLights';
import ErrorState from '../components/common/ErrorState';
import { useAuth } from '../context/AuthContext';
import analyticsService from '../services/analyticsService';
import orderService from '../services/orderService';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState({
    today_revenue: 0.0,
    total_revenue: 0.0,
    total_orders: 0,
    active_kitchen_orders: 0,
    average_ticket: 0.0,
    low_stock_count: 0,
    order_types: { online_pickup: 0, dine_in: 0, takeaway: 0 },
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const [m, orders] = await Promise.all([
        analyticsService.getDashboardMetrics(),
        orderService.getOrders({ limit: 6 }),
      ]);
      setMetrics(m);
      setRecentOrders(orders);
      setError(null);
    } catch (err) {
      setError('Cannot load dashboard metrics from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (error) {
    return (
      <div className="p-6">
        <ErrorState title="Dashboard Offline" message={error} onRetry={loadDashboard} />
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none">
      {/* 1. WELCOME GLASS BANNER WITH SYSTEM STATUS & QUICK ACTIONS */}
      <GlassPanel className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/60 dark:border-white/15 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrafficLights />
            <span className="text-xs font-mono text-espresso-900/50 dark:text-cream-200/50 uppercase ml-2">
              CafePulse Kerala • Kochi & Wayanad Storefront Active
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-espresso-900 dark:text-cream-50">
            Namaskaram, {user?.full_name}! ☕🌴
          </h2>
          <p className="text-sm text-espresso-900/70 dark:text-cream-200/70 max-w-xl">
            Operating as{' '}
            <span className="font-semibold text-terracotta-500">
              {isAdmin ? 'Store Manager (Admin)' : 'Head Barista (Staff)'}
            </span>
            . Live orders for Wayanad Filter Kaapi, Sulaimani & Chayakada snacks are routing into the kitchen.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <GlassButton
            variant="primary"
            onClick={() => navigate('/pos')}
            className="gap-2 shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Open POS Register</span>
          </GlassButton>

          <GlassButton
            variant="secondary"
            onClick={() => window.open('/order', '_blank')}
            className="gap-2 text-caramel-500 hover:text-caramel-400"
            title="Open Customer Online Storefront in new tab"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Customer Storefront</span>
          </GlassButton>
        </div>
      </GlassPanel>

      {/* 2. REAL-TIME KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sales */}
        <GlassCard className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-espresso-900/60 dark:text-cream-200/60 uppercase tracking-wider">
              Today's Gross Sales
            </span>
            <div className="w-8 h-8 rounded-xl bg-terracotta-500/15 text-terracotta-500 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-espresso-900 dark:text-cream-50">
              ${metrics.today_revenue.toFixed(2)}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-sage-600 dark:text-sage-400 mt-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Real-time POS & Online</span>
            </div>
          </div>
        </GlassCard>

        {/* Total Orders Placed */}
        <GlassCard className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-espresso-900/60 dark:text-cream-200/60 uppercase tracking-wider">
              Total Order Volume
            </span>
            <div className="w-8 h-8 rounded-xl bg-caramel-500/15 text-caramel-500 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-espresso-900 dark:text-cream-50">
              {metrics.total_orders}
            </span>
            <div className="text-xs text-espresso-900/60 dark:text-cream-200/60 mt-1">
              Avg ticket: ${metrics.average_ticket.toFixed(2)}
            </div>
          </div>
        </GlassCard>

        {/* Active Kitchen Orders */}
        <GlassCard className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-espresso-900/60 dark:text-cream-200/60 uppercase tracking-wider">
              Active Kitchen Queue
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
              <Coffee className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-espresso-900 dark:text-cream-50">
              {metrics.active_kitchen_orders}
            </span>
            <button
              onClick={() => navigate('/orders')}
              className="text-xs text-caramel-400 font-bold hover:underline mt-1 block"
            >
              View Barista Queue →
            </button>
          </div>
        </GlassCard>

        {/* Low Stock Alerts */}
        <GlassCard className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-espresso-900/60 dark:text-cream-200/60 uppercase tracking-wider">
              Inventory Alerts
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-500/15 text-red-500 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-espresso-900 dark:text-cream-50">
              {metrics.low_stock_count}
            </span>
            <button
              onClick={() => navigate('/inventory')}
              className="text-xs text-red-400 font-bold hover:underline mt-1 block"
            >
              {metrics.low_stock_count > 0 ? 'Restock Required →' : 'All Stock Healthy'}
            </button>
          </div>
        </GlassCard>
      </div>

      {/* 3. RECENT ORDERS & ONLINE DISPATCH FEED */}
      <GlassCard className="p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-espresso-900 dark:text-cream-50">
              Recent Live Orders
            </h3>
            <p className="text-xs text-espresso-900/60 dark:text-cream-200/60">
              Online customer pickup passes and counter POS tickets.
            </p>
          </div>
          <button
            onClick={() => navigate('/orders')}
            className="text-xs font-bold text-caramel-400 hover:underline"
          >
            Open Full KDS Queue →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-espresso-900/5 dark:bg-white/5 uppercase font-bold text-espresso-900/60 dark:text-cream-200/60">
              <tr>
                <th className="py-2.5 px-3">Order #</th>
                <th className="py-2.5 px-3">Channel</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Items</th>
                <th className="py-2.5 px-3">Total</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-espresso-900/10 dark:divide-white/10">
              {recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-espresso-900/5 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 font-bold font-mono text-espresso-900 dark:text-cream-50">
                    #{o.order_number}
                  </td>
                  <td className="py-3 px-3">
                    {o.order_type === 'online_pickup' ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-terracotta-500/20 text-terracotta-500 font-bold">
                        Online Pickup
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 font-bold">
                        Dine In
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-medium">{o.customer_name}</td>
                  <td className="py-3 px-3 text-espresso-900/70 dark:text-cream-200/70">
                    {o.items?.map((i) => `${i.quantity}x ${i.item_name}`).join(', ')}
                  </td>
                  <td className="py-3 px-3 font-bold">₹{o.total.toFixed(2)}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        o.status === 'ready'
                          ? 'bg-sage-500/20 text-sage-500'
                          : o.status === 'preparing'
                          ? 'bg-amber-500/20 text-amber-500'
                          : o.status === 'completed'
                          ? 'bg-black/10 dark:bg-white/10 text-espresso-900/60 dark:text-cream-200/60'
                          : 'bg-terracotta-500/20 text-terracotta-500'
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
