import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  AlertTriangle,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  TrendingDown,
  Layers,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import GlassButton from '../components/common/GlassButton';
import GlassBadge from '../components/common/GlassBadge';
import GlassModal from '../components/common/GlassModal';
import GlassInput from '../components/common/GlassInput';
import ErrorState from '../components/common/ErrorState';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import inventoryService from '../services/inventoryService';

export default function InventoryPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const isAdmin = user?.role === 'admin';

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  // Restock Modal
  const [restockItem, setRestockItem] = useState(null);
  const [restockAmount, setRestockAmount] = useState('');
  const [isRestocking, setIsRestocking] = useState(false);

  // Add Item Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemData, setNewItemData] = useState({
    name: '',
    sku: '',
    category: 'coffee_beans',
    current_stock: '',
    unit: 'kg',
    reorder_threshold: '5.0',
    cost_per_unit: '',
    supplier: '',
  });

  const loadInventory = async () => {
    setIsLoading(true);
    try {
      const data = await inventoryService.getInventory();
      setItems(data);
      setError(null);
    } catch (err) {
      setError('Cannot connect to inventory tracking service.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  // Handle Quick Restock
  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    if (!restockItem || !restockAmount || isNaN(parseFloat(restockAmount))) return;

    setIsRestocking(true);
    try {
      const delta = parseFloat(restockAmount);
      const updated = await inventoryService.adjustStock(
        restockItem.id,
        delta,
        'Staff Delivery Restock'
      );
      setItems((prev) => prev.map((i) => (i.id === restockItem.id ? updated : i)));
      addToast({
        type: 'success',
        title: 'Inventory Restocked',
        message: `Added +₹{delta} ${restockItem.unit} to ${restockItem.name}.`,
      });
      setRestockItem(null);
      setRestockAmount('');
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Restock Failed',
        message: err.response?.data?.detail || 'Could not update stock level.',
      });
    } finally {
      setIsRestocking(false);
    }
  };

  // Handle Add Item Submit
  const handleAddItemSubmit = async (e) => {
    e.preventDefault();
    if (!newItemData.name || !newItemData.sku) return;

    try {
      const payload = {
        name: newItemData.name.trim(),
        sku: newItemData.sku.trim(),
        category: newItemData.category,
        current_stock: parseFloat(newItemData.current_stock) || 0.0,
        unit: newItemData.unit,
        reorder_threshold: parseFloat(newItemData.reorder_threshold) || 5.0,
        cost_per_unit: parseFloat(newItemData.cost_per_unit) || 0.0,
        supplier: newItemData.supplier.trim() || null,
      };

      const created = await inventoryService.createItem(payload);
      setItems((prev) => [...prev, created]);
      addToast({
        type: 'success',
        title: 'Item Created',
        message: `Now tracking stock for ${created.name}.`,
      });
      setIsAddModalOpen(false);
      setNewItemData({
        name: '',
        sku: '',
        category: 'coffee_beans',
        current_stock: '',
        unit: 'kg',
        reorder_threshold: '5.0',
        cost_per_unit: '',
        supplier: '',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Creation Failed',
        message: err.response?.data?.detail || 'Failed to create inventory item.',
      });
    }
  };

  // Filtered Inventory
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (lowStockOnly && !item.is_low_stock) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
      }
      return true;
    });
  }, [items, selectedCategory, lowStockOnly, searchQuery]);

  const lowStockCount = items.filter((i) => i.is_low_stock).length;

  if (error && items.length === 0) {
    return (
      <div className="p-6">
        <ErrorState title="Inventory Tracking Offline" message={error} onRetry={loadInventory} />
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none">
      {/* 1. TOP HEADER & INVENTORY STATUS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta-500">
            RAW MATERIALS & SUPPLY CHAIN
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-espresso-900 dark:text-cream-50 tracking-tight">
            Inventory & Stock
          </h1>
          <p className="text-sm text-espresso-900/60 dark:text-cream-200/60">
            Automated stock deduction linked to espresso extraction and online customer ordering.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <GlassButton variant="ghost" size="sm" onClick={loadInventory} className="flex items-center gap-1.5">
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </GlassButton>

          {isAdmin && (
            <GlassButton
              variant="primary"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Track New Item</span>
            </GlassButton>
          )}
        </div>
      </div>

      {/* 2. AUTOMATION LINK INFO BANNER */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-terracotta-500/10 to-caramel-500/10 border border-terracotta-500/20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-terracotta-500/20 text-terracotta-500 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <p className="text-xs text-espresso-900/80 dark:text-cream-100 font-medium leading-relaxed">
            <strong>Cross-Module Link Active:</strong> Online and POS orders automatically deduct espresso beans (18g/shot), Oatly milk (240ml/latte), and biodegradable cups upon checkout!
          </p>
        </div>

        {lowStockCount > 0 && (
          <button
            onClick={() => setLowStockOnly(!lowStockOnly)}
            className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center gap-1.5 shrink-0 hover:bg-amber-500/30 transition-all cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{lowStockCount} Low Stock Alert{lowStockCount > 1 ? 's' : ''}</span>
          </button>
        )}
      </div>

      {/* 3. CATEGORY PILLS & SEARCH */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Stock' },
            { id: 'coffee_beans', label: 'Coffee Beans' },
            { id: 'dairy', label: 'Dairy & Milks' },
            { id: 'syrups', label: 'Syrups' },
            { id: 'packaging', label: 'Packaging' },
            { id: 'tea', label: 'Teas' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === c.id
                  ? 'bg-espresso-900 text-cream-50 dark:bg-caramel-500 dark:text-espresso-950 shadow-sm'
                  : 'glass-surface'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-espresso-900/40 dark:text-cream-200/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search SKU or item name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-xl text-xs glass-input text-espresso-900 dark:text-cream-50 border border-white/20 focus:outline-none"
          />
        </div>
      </div>

      {/* 4. INVENTORY TABLE / GRID */}
      <GlassCard className="p-0 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-espresso-900/5 dark:bg-white/5 border-b border-espresso-900/10 dark:border-white/10 uppercase font-bold tracking-wider text-espresso-900/60 dark:text-cream-200/60">
              <tr>
                <th className="py-3.5 px-4">Item & SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4">Reorder At</th>
                <th className="py-3.5 px-4">Cost / Unit</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-espresso-900/10 dark:divide-white/10">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-espresso-900/5 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-espresso-900 dark:text-cream-50">
                    <div>{item.name}</div>
                    <div className="text-[10px] text-espresso-900/50 dark:text-cream-200/50 uppercase font-mono">
                      {item.sku}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 capitalize text-espresso-900/70 dark:text-cream-200/70">
                    {item.category.replace('_', ' ')}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-sm">
                    {item.current_stock.toFixed(1)} {item.unit}
                  </td>
                  <td className="py-3.5 px-4 text-espresso-900/60 dark:text-cream-200/60">
                    {item.reorder_threshold.toFixed(1)} {item.unit}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-espresso-900/80 dark:text-cream-100">
                    ${item.cost_per_unit.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    {item.is_low_stock ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3 h-3" /> Low Stock
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sage-500/20 text-sage-600 dark:text-sage-400 border border-sage-500/30 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> Healthy
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setRestockItem(item)}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-[#DCA466] hover:bg-[#E5AF73] text-[#241409] transition-all cursor-pointer"
                    >
                      + Restock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* RESTOCK MODAL */}
      <GlassModal
        isOpen={Boolean(restockItem)}
        onClose={() => setRestockItem(null)}
        title={restockItem ? `Restock ${restockItem.name}` : 'Restock Item'}
      >
        {restockItem && (
          <form onSubmit={handleRestockSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 text-xs space-y-1">
              <div className="flex justify-between">
                <span>Current On Hand:</span>
                <span className="font-bold">
                  {restockItem.current_stock.toFixed(1)} {restockItem.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Reorder Threshold:</span>
                <span>{restockItem.reorder_threshold.toFixed(1)} {restockItem.unit}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-espresso-900/80 dark:text-cream-200/80">
                Quantity to Add ({restockItem.unit}) *
              </label>
              <GlassInput
                type="number"
                step="0.5"
                min="0.1"
                placeholder="e.g. 5.0"
                required
                value={restockAmount}
                onChange={(e) => setRestockAmount(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <GlassButton type="button" variant="ghost" size="sm" onClick={() => setRestockItem(null)}>
                Cancel
              </GlassButton>
              <GlassButton type="submit" variant="primary" size="sm" disabled={isRestocking}>
                {isRestocking ? 'Updating...' : 'Confirm Restock'}
              </GlassButton>
            </div>
          </form>
        )}
      </GlassModal>

      {/* ADD ITEM MODAL */}
      <GlassModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Track New Inventory Raw Material"
      >
        <form onSubmit={handleAddItemSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Item Name *</label>
              <GlassInput
                value={newItemData.name}
                onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                placeholder="e.g. Colombian Supremo Beans"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">SKU Code *</label>
              <GlassInput
                value={newItemData.sku}
                onChange={(e) => setNewItemData({ ...newItemData, sku: e.target.value })}
                placeholder="COF-COL-01"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Category</label>
              <select
                value={newItemData.category}
                onChange={(e) => setNewItemData({ ...newItemData, category: e.target.value })}
                className="w-full h-10 px-3 rounded-xl text-xs glass-input text-espresso-900 dark:text-cream-50 bg-white/40 dark:bg-black/30 border border-white/20"
              >
                <option value="coffee_beans" className="bg-[#1C120B] text-white">Coffee Beans</option>
                <option value="dairy" className="bg-[#1C120B] text-white">Dairy & Milks</option>
                <option value="syrups" className="bg-[#1C120B] text-white">Syrups</option>
                <option value="packaging" className="bg-[#1C120B] text-white">Packaging</option>
                <option value="tea" className="bg-[#1C120B] text-white">Teas</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Unit of Measure</label>
              <select
                value={newItemData.unit}
                onChange={(e) => setNewItemData({ ...newItemData, unit: e.target.value })}
                className="w-full h-10 px-3 rounded-xl text-xs glass-input text-espresso-900 dark:text-cream-50 bg-white/40 dark:bg-black/30 border border-white/20"
              >
                <option value="kg" className="bg-[#1C120B] text-white">kg</option>
                <option value="liters" className="bg-[#1C120B] text-white">liters</option>
                <option value="bottles" className="bg-[#1C120B] text-white">bottles</option>
                <option value="units" className="bg-[#1C120B] text-white">units</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Initial Stock Level</label>
              <GlassInput
                type="number"
                step="0.5"
                placeholder="10.0"
                value={newItemData.current_stock}
                onChange={(e) => setNewItemData({ ...newItemData, current_stock: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Reorder Threshold</label>
              <GlassInput
                type="number"
                step="0.5"
                placeholder="5.0"
                value={newItemData.reorder_threshold}
                onChange={(e) =>
                  setNewItemData({ ...newItemData, reorder_threshold: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <GlassButton type="button" variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </GlassButton>
            <GlassButton type="submit" variant="primary" size="sm">
              Create Item
            </GlassButton>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}
