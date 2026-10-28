import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  RefreshCw,
  PieChart as PieIcon,
  Flame,
  Award,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import GlassCard from '../components/common/GlassCard';
import GlassButton from '../components/common/GlassButton';
import ErrorState from '../components/common/ErrorState';
import analyticsService from '../services/analyticsService';

const CHANNEL_COLORS = ['#DE7938', '#8FA68A', '#D9A66B'];

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState(null);
  const [salesTrend, setSalesTrend] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const [m, trend, popular] = await Promise.all([
        analyticsService.getDashboardMetrics(),
        analyticsService.getSalesTrend(),
        analyticsService.getPopularItems(),
      ]);
      setMetrics(m);
      setSalesTrend(trend);
      setPopularItems(popular);
      setError(null);
    } catch (err) {
      setError('Cannot load business analytics from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (error) {
    return (
      <div className="p-6">
        <ErrorState title="Analytics Offline" message={error} onRetry={loadAnalytics} />
      </div>
    );
  }

  const channelData = metrics?.order_types
    ? [
        { name: 'Online Pickup', value: metrics.order_types.online_pickup || 0 },
        { name: 'Dine In', value: metrics.order_types.dine_in || 0 },
        { name: 'Takeaway', value: metrics.order_types.takeaway || 0 },
      ]
    : [];

  return (
    <div className="space-y-6 select-none">
      {/* 1. TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta-500">
            BUSINESS INTELLIGENCE & PERFORMANCE
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-espresso-900 dark:text-cream-50 tracking-tight">
            Revenue & Sales Analytics
          </h1>
          <p className="text-sm text-espresso-900/60 dark:text-cream-200/60">
            Live telemetry tracking beverage volume, peak cafe rush hours, and customer ordering channels.
          </p>
        </div>

        <GlassButton variant="ghost" size="sm" onClick={loadAnalytics} className="flex items-center gap-1.5">
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </GlassButton>
      </div>

      {/* 2. TOP METRICS STRIP */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GlassCard className="p-5 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-espresso-900/60 dark:text-cream-200/60">
              Total Recorded Revenue
            </span>
            <div className="font-serif text-3xl font-extrabold text-espresso-900 dark:text-cream-50">
              ${metrics.total_revenue.toFixed(2)}
            </div>
            <span className="text-xs text-sage-600 dark:text-sage-400 font-medium">
              Across {metrics.total_orders} total orders
            </span>
          </GlassCard>

          <GlassCard className="p-5 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-espresso-900/60 dark:text-cream-200/60">
              Average Ticket Size
            </span>
            <div className="font-serif text-3xl font-extrabold text-espresso-900 dark:text-cream-50">
              ${metrics.average_ticket.toFixed(2)}
            </div>
            <span className="text-xs text-espresso-900/60 dark:text-cream-200/60">
              Blended Online & POS counter
            </span>
          </GlassCard>

          <GlassCard className="p-5 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-espresso-900/60 dark:text-cream-200/60">
              Active Online Pickup Ratio
            </span>
            <div className="font-serif text-3xl font-extrabold text-espresso-900 dark:text-cream-50">
              {metrics.total_orders > 0
                ? `${Math.round(((metrics.order_types?.online_pickup || 0) / metrics.total_orders) * 100)}%`
                : '0%'}
            </div>
            <span className="text-xs text-terracotta-500 font-medium">
              {metrics.order_types?.online_pickup || 0} orders via Customer Storefront
            </span>
          </GlassCard>
        </div>
      )}

      {/* 3. CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Hourly Volume Bar Chart (Col 8) */}
        <div className="lg:col-span-8">
          <GlassCard className="p-5 space-y-4 h-[380px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-espresso-900 dark:text-cream-50">
                  Hourly Sales & Rush Distribution
                </h3>
                <p className="text-xs text-espresso-900/60 dark:text-cream-200/60">
                  Gross revenue (₹) by time of day.
                </p>
              </div>
            </div>

            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#A89B91' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#A89B91' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(28, 18, 11, 0.95)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#FAF3EB',
                      fontSize: '12px',
                    }}
                    formatter={(val) => [`₹${val}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#DE7938" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Order Channel Donut Chart (Col 4) */}
        <div className="lg:col-span-4">
          <GlassCard className="p-5 space-y-4 h-[380px] flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-espresso-900 dark:text-cream-50">
                Order Channels
              </h3>
              <p className="text-xs text-espresso-900/60 dark:text-cream-200/60">
                Online Pickup vs Dine In vs Takeaway.
              </p>
            </div>

            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelData}
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-₹{index}`} fill={CHANNEL_COLORS[index % CHANNEL_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(28, 18, 11, 0.95)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#FAF3EB',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* 4. POPULAR BEVERAGES & PRODUCTS RANKING */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-espresso-900 dark:text-cream-50 flex items-center gap-2">
              <Award className="w-5 h-5 text-caramel-500" />
              <span>Top Performing Offerings</span>
            </h3>
            <p className="text-xs text-espresso-900/60 dark:text-cream-200/60">
              Highest ordered drinks and pastries across all channels.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {popularItems.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-espresso-900/5 dark:bg-white/5 border border-white/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-caramel-500/20 text-caramel-400 font-bold text-xs flex items-center justify-center">
                  #{idx + 1}
                </span>
                <div>
                  <h4 className="font-serif font-bold text-sm text-espresso-900 dark:text-cream-50">
                    {item.name}
                  </h4>
                  <span className="text-[11px] text-espresso-900/60 dark:text-cream-200/60">
                    {item.total_sold} order{item.total_sold > 1 ? 's' : ''} sold
                  </span>
                </div>
              </div>

              <span className="font-bold text-sm text-terracotta-500 dark:text-caramel-400">
                ${item.revenue.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
