import React, { useState, useEffect, useMemo } from 'react';
import {
  Coffee,
  Plus,
  Search,
  Filter,
  Clock,
  Flame,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  RefreshCw,
  Sparkles,
  CupSoda,
  Cake,
  Leaf,
  Layers,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/common/GlassCard';
import GlassButton from '../components/common/GlassButton';
import GlassBadge from '../components/common/GlassBadge';
import GlassInput from '../components/common/GlassInput';
import GlassModal from '../components/common/GlassModal';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import menuService from '../services/menuService';

// Category Icon Mapper
const getCategoryIcon = (iconName) => {
  switch (iconName) {
    case 'leaf':
      return <Leaf className="w-4 h-4" />;
    case 'cup-soda':
      return <CupSoda className="w-4 h-4" />;
    case 'cake':
      return <Cake className="w-4 h-4" />;
    case 'sparkles':
      return <Sparkles className="w-4 h-4" />;
    default:
      return <Coffee className="w-4 h-4" />;
  }
};

export default function MenuPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const isAdmin = user?.role === 'admin';

  // Data states
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // all, available, sold_out

  // Modal states
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [itemFormData, setItemFormData] = useState({
    name: '',
    category_id: '',
    base_price: '',
    description: '',
    prep_time_minutes: 3,
    calories: '',
    is_available: true,
  });

  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    icon: 'coffee',
  });

  // Fetch Categories & Items
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [catsData, itemsData] = await Promise.all([
        menuService.getCategories(),
        menuService.getMenuItems(),
      ]);
      setCategories(catsData);
      setItems(itemsData);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        (err.code === 'ERR_NETWORK'
          ? 'Cannot connect to CafePulse backend API at http://127.0.0.1:8000.'
          : 'Failed to load menu catalog.');
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered Items Memo
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category match
      if (selectedCategory !== 'all' && item.category_id !== selectedCategory) {
        return false;
      }
      // Availability match
      if (availabilityFilter === 'available' && !item.is_available) return false;
      if (availabilityFilter === 'sold_out' && item.is_available) return false;
      // Search query match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesCat = item.category_name?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }
      return true;
    });
  }, [items, selectedCategory, availabilityFilter, searchQuery]);

  // Handle Availability Toggle (1-click)
  const handleToggleAvailability = async (item) => {
    // Optimistic UI Update
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, is_available: !i.is_available } : i
      )
    );

    try {
      const res = await menuService.toggleItemAvailability(item.id);
      addToast({
        type: 'success',
        title: item.name,
        message: res.message,
      });
    } catch (err) {
      // Revert optimistic update
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, is_available: item.is_available } : i
        )
      );
      addToast({
        type: 'error',
        title: 'Status Update Failed',
        message: 'Could not update item availability on server.',
      });
    }
  };

  // Open Create/Edit Item Modal
  const openItemModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setItemFormData({
        name: item.name,
        category_id: item.category_id,
        base_price: item.base_price.toString(),
        description: item.description || '',
        prep_time_minutes: item.prep_time_minutes || 3,
        calories: item.calories ? item.calories.toString() : '',
        is_available: item.is_available,
      });
    } else {
      setEditingItem(null);
      setItemFormData({
        name: '',
        category_id: categories[0]?.id || '',
        base_price: '',
        description: '',
        prep_time_minutes: 3,
        calories: '',
        is_available: true,
      });
    }
    setIsItemModalOpen(true);
  };

  // Submit Item Form
  const handleItemSubmit = async (e) => {
    e.preventDefault();
    if (!itemFormData.name.trim() || !itemFormData.category_id || !itemFormData.base_price) {
      addToast({
        type: 'warning',
        title: 'Validation Error',
        message: 'Please provide name, category, and base price.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: itemFormData.name.trim(),
        category_id: itemFormData.category_id,
        base_price: parseFloat(itemFormData.base_price),
        description: itemFormData.description.trim() || null,
        prep_time_minutes: parseInt(itemFormData.prep_time_minutes) || 3,
        calories: itemFormData.calories ? parseInt(itemFormData.calories) : null,
        is_available: itemFormData.is_available,
      };

      if (editingItem) {
        const updated = await menuService.updateMenuItem(editingItem.id, payload);
        setItems((prev) => prev.map((i) => (i.id === editingItem.id ? updated : i)));
        addToast({
          type: 'success',
          title: 'Item Updated',
          message: `Successfully updated '${updated.name}'.`,
        });
      } else {
        const created = await menuService.createMenuItem(payload);
        setItems((prev) => [created, ...prev]);
        // Update category counts
        setCategories((prev) =>
          prev.map((c) =>
            c.id === created.category_id ? { ...c, item_count: c.item_count + 1 } : c
          )
        );
        addToast({
          type: 'success',
          title: 'Item Created',
          message: `Successfully created '${created.name}'.`,
        });
      }
      setIsItemModalOpen(false);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Action Failed',
        message: err.response?.data?.detail || 'Failed to save menu item.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Item
  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Are you sure you want to delete '${item.name}'?`)) return;

    try {
      await menuService.deleteMenuItem(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setCategories((prev) =>
        prev.map((c) =>
          c.id === item.category_id ? { ...c, item_count: Math.max(0, c.item_count - 1) } : c
        )
      );
      addToast({
        type: 'success',
        title: 'Item Removed',
        message: `Deleted '${item.name}' from catalog.`,
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.response?.data?.detail || 'Failed to delete menu item.',
      });
    }
  };

  // Submit Category Form
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryFormData.name.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await menuService.createCategory(categoryFormData);
      setCategories((prev) => [...prev, created]);
      addToast({
        type: 'success',
        title: 'Category Created',
        message: `Created category '${created.name}'.`,
      });
      setIsCategoryModalOpen(false);
      setCategoryFormData({ name: '', description: '', icon: 'coffee' });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Creation Failed',
        message: err.response?.data?.detail || 'Failed to create category.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          title="Menu Service Unreachable"
          message={error}
          onRetry={fetchData}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none">
      {/* 1. TOP HEADER & ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta-500">
            CATALOG MANAGEMENT
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-espresso-900 dark:text-cream-50 tracking-tight">
            Menu & Recipes
          </h1>
          <p className="text-sm text-espresso-900/60 dark:text-cream-200/60">
            Craft beverages, adjust prices, and manage real-time availability.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={fetchData}
            disabled={isLoading}
            className="flex items-center gap-1.5"
            title="Refresh Catalog"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </GlassButton>

          {isAdmin && (
            <>
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={() => setIsCategoryModalOpen(true)}
                className="flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>+ Category</span>
              </GlassButton>

              <GlassButton
                variant="primary"
                size="sm"
                onClick={() => openItemModal()}
                className="flex items-center gap-1.5 shadow-md shadow-terracotta-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </GlassButton>
            </>
          )}
        </div>
      </div>

      {/* 2. CATEGORY PILLS BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {/* 'All' Category Option */}
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all duration-200 shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-espresso-900 text-cream-50 dark:bg-caramel-500 dark:text-espresso-950 shadow-md'
              : 'glass-surface text-espresso-900/70 dark:text-cream-200/70 hover:text-espresso-900 dark:hover:text-cream-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Items</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/15">
            {items.length}
          </span>
        </button>

        {/* Dynamic Categories */}
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all duration-200 shrink-0 ${
                isActive
                  ? 'bg-espresso-900 text-cream-50 dark:bg-caramel-500 dark:text-espresso-950 shadow-md'
                  : 'glass-surface text-espresso-900/70 dark:text-cream-200/70 hover:text-espresso-900 dark:hover:text-cream-50'
              }`}
            >
              {getCategoryIcon(cat.icon)}
              <span>{cat.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/15">
                {cat.item_count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. SEARCH & AVAILABILITY FILTER BAR */}
      <GlassCard className="p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-espresso-900/40 dark:text-cream-200/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items, ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-xl text-xs font-medium bg-white/40 dark:bg-black/30 text-espresso-900 dark:text-cream-50 placeholder:text-espresso-900/40 dark:placeholder:text-cream-200/40 border border-white/20 focus:outline-none focus:ring-1 focus:ring-caramel-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-espresso-900/50 hover:text-espresso-900"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
          <span className="text-xs text-espresso-900/50 dark:text-cream-200/50 hidden md:inline">
            Status:
          </span>
          {[
            { id: 'all', label: 'All Status' },
            { id: 'available', label: 'In Stock' },
            { id: 'sold_out', label: 'Sold Out' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setAvailabilityFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                availabilityFilter === tab.id
                  ? 'bg-espresso-900/10 dark:bg-white/10 text-espresso-900 dark:text-cream-50 font-semibold'
                  : 'text-espresso-900/60 dark:text-cream-200/60 hover:text-espresso-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* 4. MENU ITEMS GRID */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <GlassCard key={idx} className="p-5 space-y-3 animate-pulse">
              <div className="h-4 w-24 bg-white/20 rounded" />
              <div className="h-6 w-44 bg-white/30 rounded" />
              <div className="h-10 w-full bg-white/10 rounded" />
              <div className="h-8 w-full bg-white/20 rounded mt-4" />
            </GlassCard>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title="No Menu Items Found"
          description={
            searchQuery
              ? `No items match "${searchQuery}". Try a different keyword.`
              : 'This category does not have any items yet.'
          }
          actionLabel={isAdmin ? 'Add New Item' : undefined}
          onAction={isAdmin ? () => openItemModal() : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <GlassCard className="p-5 flex flex-col justify-between h-full space-y-4 hover:border-caramel-500/40 transition-all duration-200">
                  {/* Top Bar: Category & Price */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[11px] font-semibold text-terracotta-500 dark:text-caramel-400 uppercase tracking-wider">
                        {item.category_name}
                      </span>
                      <div className="text-right">
                        <span className="font-serif text-lg font-bold text-espresso-900 dark:text-cream-50">
                          ${item.base_price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-espresso-900 dark:text-cream-50 leading-snug">
                      {item.name}
                    </h3>

                    {item.description && (
                      <p className="text-xs text-espresso-900/65 dark:text-cream-200/65 line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Middle Info Chips (Prep Time, Calories, Sizes) */}
                  <div className="space-y-2.5 pt-2 border-t border-espresso-900/10 dark:border-white/10">
                    <div className="flex items-center gap-3 text-xs text-espresso-900/60 dark:text-cream-200/60">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-terracotta-500" />
                        <span>{item.prep_time_minutes} min</span>
                      </div>
                      {item.calories && (
                        <div className="flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-caramel-500" />
                          <span>{item.calories} kcal</span>
                        </div>
                      )}
                    </div>

                    {/* Sizes chips */}
                    {item.sizes && item.sizes.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1">
                        {item.sizes.map((s) => (
                          <span
                            key={s.id}
                            className="text-[10.5px] px-2 py-0.5 rounded-md bg-espresso-900/5 dark:bg-white/10 text-espresso-900/80 dark:text-cream-100 font-medium"
                          >
                            {s.name}
                            {s.price_adjustment > 0 && ` (+$${s.price_adjustment.toFixed(2)})`}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Footer: 1-Click Availability & Edit */}
                  <div className="flex items-center justify-between pt-3 border-t border-espresso-900/10 dark:border-white/10">
                    {/* 1-Click Availability Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleAvailability(item)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 ${
                        item.is_available
                          ? 'bg-sage-500/15 text-sage-600 dark:text-sage-400 border border-sage-500/30 hover:bg-sage-500/25'
                          : 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 hover:bg-red-500/25'
                      }`}
                      title="Click to toggle availability"
                    >
                      {item.is_available ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>In Stock</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Sold Out</span>
                        </>
                      )}
                    </button>

                    {/* Admin Actions: Edit & Delete */}
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openItemModal(item)}
                          className="p-1.5 rounded-lg text-espresso-900/60 dark:text-cream-200/60 hover:text-espresso-900 dark:hover:text-cream-50 hover:bg-espresso-900/10 transition-colors"
                          title="Edit Item"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item)}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ================================================================= */}
      {/* 5. CREATE / EDIT ITEM MODAL                                       */}
      {/* ================================================================= */}
      <GlassModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        title={editingItem ? 'Edit Menu Item' : 'New Menu Offering'}
      >
        <form onSubmit={handleItemSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-espresso-900/80 dark:text-cream-200/80">
              Item Name *
            </label>
            <GlassInput
              value={itemFormData.name}
              onChange={(e) => setItemFormData({ ...itemFormData, name: e.target.value })}
              placeholder="e.g. Vanilla Bean Flat White"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-espresso-900/80 dark:text-cream-200/80">
                Category *
              </label>
              <select
                value={itemFormData.category_id}
                onChange={(e) => setItemFormData({ ...itemFormData, category_id: e.target.value })}
                className="w-full h-10 px-3 rounded-xl text-xs font-medium glass-input text-espresso-900 dark:text-cream-50 bg-white/40 dark:bg-black/30 border border-white/20 focus:outline-none"
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#1C120B] text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-espresso-900/80 dark:text-cream-200/80">
                Base Price ($) *
              </label>
              <GlassInput
                type="number"
                step="0.01"
                min="0"
                value={itemFormData.base_price}
                onChange={(e) => setItemFormData({ ...itemFormData, base_price: e.target.value })}
                placeholder="4.50"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-espresso-900/80 dark:text-cream-200/80">
              Description
            </label>
            <textarea
              rows={2}
              value={itemFormData.description}
              onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
              placeholder="Tasting notes, bean origin, milk texture..."
              className="w-full p-2.5 rounded-xl text-xs font-medium glass-input text-espresso-900 dark:text-cream-50 bg-white/40 dark:bg-black/30 border border-white/20 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-espresso-900/80 dark:text-cream-200/80">
                Prep Time (min)
              </label>
              <GlassInput
                type="number"
                min="1"
                value={itemFormData.prep_time_minutes}
                onChange={(e) =>
                  setItemFormData({ ...itemFormData, prep_time_minutes: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-espresso-900/80 dark:text-cream-200/80">
                Calories (kcal)
              </label>
              <GlassInput
                type="number"
                min="0"
                value={itemFormData.calories}
                onChange={(e) => setItemFormData({ ...itemFormData, calories: e.target.value })}
                placeholder="120"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-espresso-900/10 dark:border-white/10">
            <GlassButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsItemModalOpen(false)}
            >
              Cancel
            </GlassButton>
            <GlassButton
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Item'}
            </GlassButton>
          </div>
        </form>
      </GlassModal>

      {/* ================================================================= */}
      {/* 6. CREATE CATEGORY MODAL                                          */}
      {/* ================================================================= */}
      <GlassModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Add Menu Category"
      >
        <form onSubmit={handleCategorySubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-espresso-900/80 dark:text-cream-200/80">
              Category Name *
            </label>
            <GlassInput
              value={categoryFormData.name}
              onChange={(e) =>
                setCategoryFormData({ ...categoryFormData, name: e.target.value })
              }
              placeholder="e.g. Specialty Cold Brews"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-espresso-900/80 dark:text-cream-200/80">
              Icon
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'coffee', label: 'Coffee' },
                { id: 'cup-soda', label: 'Cold Drink' },
                { id: 'leaf', label: 'Tea' },
                { id: 'cake', label: 'Bakery' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setCategoryFormData({ ...categoryFormData, icon: opt.id })}
                  className={`p-2 rounded-xl text-xs font-medium flex flex-col items-center gap-1 border transition-all ${
                    categoryFormData.icon === opt.id
                      ? 'border-caramel-500 bg-caramel-500/15 text-caramel-400 font-bold'
                      : 'border-white/10 glass-surface text-espresso-900/70 dark:text-cream-200/70'
                  }`}
                >
                  {getCategoryIcon(opt.id)}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-espresso-900/80 dark:text-cream-200/80">
              Description
            </label>
            <textarea
              rows={2}
              value={categoryFormData.description}
              onChange={(e) =>
                setCategoryFormData({ ...categoryFormData, description: e.target.value })
              }
              placeholder="Brief overview of items in this section..."
              className="w-full p-2.5 rounded-xl text-xs font-medium glass-input text-espresso-900 dark:text-cream-50 bg-white/40 dark:bg-black/30 border border-white/20 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-espresso-900/10 dark:border-white/10">
            <GlassButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsCategoryModalOpen(false)}
            >
              Cancel
            </GlassButton>
            <GlassButton
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Category'}
            </GlassButton>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}
