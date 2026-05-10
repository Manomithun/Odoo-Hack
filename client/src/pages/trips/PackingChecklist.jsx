import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripService } from '../../services/trip.service';
import { ArrowLeft, Plus, Check, Trash2, Package, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const CATEGORIES = ['Documents', 'Clothing', 'Electronics', 'Health', 'Toiletries', 'Food & Snacks', 'General'];
const CAT_COLORS = { Documents: '#ffd93d', Clothing: '#ff6b6b', Electronics: '#4ecdc4', Health: '#34d399', Toiletries: '#a78bfa', 'Food & Snacks': '#f97316', General: 'rgba(226,232,240,0.5)' };
const CAT_ICONS = { Documents: '🪪', Clothing: '👕', Electronics: '💻', Health: '💊', Toiletries: '🧴', 'Food & Snacks': '🍎', General: '📦' };

const SMART_SUGGESTIONS = {
  Documents: ['Passport', 'Travel insurance', 'Hotel confirmations', 'Flight tickets', 'Visa copies', 'Emergency contacts'],
  Clothing: ['T-shirts', 'Jeans', 'Underwear', 'Socks', 'Jacket', 'Comfortable walking shoes', 'Formal outfit'],
  Electronics: ['Phone charger', 'Universal adapter', 'Power bank', 'Camera', 'Headphones', 'Laptop'],
  Health: ['Prescription medicine', 'Pain relievers', 'Band-aids', 'Sunscreen SPF 50', 'Hand sanitizer', 'Face masks'],
  Toiletries: ['Toothbrush', 'Toothpaste', 'Shampoo', 'Deodorant', 'Razor', 'Lip balm'],
  'Food & Snacks': ['Protein bars', 'Trail mix', 'Instant noodles', 'Water bottle', 'Tea bags'],
  General: ['Travel pillow', 'Eye mask', 'Earplugs', 'Small backpack', 'Umbrella', 'Travel lock'],
};

export default function PackingChecklist() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState('');
  const [newCat, setNewCat] = useState('General');
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      const res = await tripService.getById(id);
      setTrip(res.data.data);
      setItems(res.data.data.packingItems || []);
    } catch { toast.error('Trip not found'); navigate('/trips'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

  const addItem = async () => {
    if (!newItem.trim()) return;
    try {
      await tripService.addPackingItem(id, { itemName: newItem.trim(), category: newCat });
      setNewItem('');
      fetchData();
    } catch { toast.error('Failed to add item'); }
  };

  const addSuggestion = async (name, cat) => {
    if (items.some(i => i.itemName.toLowerCase() === name.toLowerCase())) return;
    try { await tripService.addPackingItem(id, { itemName: name, category: cat }); fetchData(); }
    catch {}
  };

  const togglePacked = async (item) => {
    try { await tripService.updatePackingItem(item.id, { isPacked: !item.isPacked }); fetchData(); }
    catch {}
  };

  const deleteItem = async (itemId) => {
    try { await tripService.deletePackingItem(itemId); fetchData(); }
    catch {}
  };

  const packed = items.filter(i => i.isPacked).length;
  const percent = items.length ? Math.round((packed / items.length) * 100) : 0;

  const allCats = ['All', ...CATEGORIES.filter(c => items.some(i => i.category === c))];
  const filtered = items.filter(i => {
    const catMatch = activeCategory === 'All' || i.category === activeCategory;
    const searchMatch = !search || i.itemName.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  const grouped = CATEGORIES.reduce((acc, cat) => {
    const catItems = filtered.filter(i => i.category === cat);
    if (catItems.length > 0) acc[cat] = catItems;
    return acc;
  }, {});
  if (filtered.some(i => !CATEGORIES.includes(i.category))) {
    grouped['General'] = [...(grouped['General'] || []), ...filtered.filter(i => !CATEGORIES.includes(i.category))];
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-white">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(`/trips/${id}`)} className="w-9 h-9 glass rounded-xl flex items-center justify-center">
          <ArrowLeft size={16} style={{ color: 'rgba(226,232,240,0.7)' }} />
        </button>
        <div className="flex-1">
          <h1 className="font-display font-bold text-2xl text-white">Packing Checklist</h1>
          <p className="text-sm" style={{ color: 'rgba(226,232,240,0.5)' }}>{trip?.title}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-bold text-white text-lg">{packed} / {items.length} packed</p>
            <p className="text-xs" style={{ color: 'rgba(226,232,240,0.5)' }}>{items.length - packed} items remaining</p>
          </div>
          <div className="w-16 h-16 relative flex items-center justify-center">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="url(#pg)" strokeWidth="3" strokeDasharray={`${percent}, 100`} strokeLinecap="round" />
              <defs><linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#ff6b6b" /><stop offset="100%" stopColor="#4ecdc4" /></linearGradient></defs>
            </svg>
            <span className="absolute font-bold text-white text-sm">{percent}%</span>
          </div>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <motion.div animate={{ width: `${percent}%` }} transition={{ duration: 0.5 }}
            className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4)' }} />
        </div>
      </div>

      {/* Add item */}
      <div className="glass rounded-2xl p-4 flex gap-2 flex-wrap">
        <input id="packing-new-item" value={newItem} onChange={e => setNewItem(e.target.value)}
          className="input-field flex-1 min-w-40" placeholder="Add item..." onKeyDown={e => e.key === 'Enter' && addItem()} />
        <select id="packing-new-cat" value={newCat} onChange={e => setNewCat(e.target.value)} className="input-field w-36">
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <button id="add-packing-btn" onClick={addItem} className="btn-primary px-5"><Plus size={16} /></button>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(226,232,240,0.4)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 text-sm" placeholder="Search items..." />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {allCats.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="px-3 py-2 rounded-xl text-xs font-medium flex-shrink-0 transition-all"
              style={{ background: activeCategory === cat ? (cat === 'All' ? 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' : `${CAT_COLORS[cat]}20`) : 'rgba(255,255,255,0.05)', color: activeCategory === cat ? (cat === 'All' ? 'white' : CAT_COLORS[cat]) : 'rgba(226,232,240,0.5)' }}>
              {cat !== 'All' ? CAT_ICONS[cat] + ' ' : ''}{cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped items */}
      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16">
          <Package size={48} className="mx-auto mb-3 opacity-20" />
          <p style={{ color: 'rgba(226,232,240,0.4)' }}>No items yet. Add items or use smart suggestions below.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([cat, catItems]) => (
            <div key={cat} className="glass rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <span className="text-lg">{CAT_ICONS[cat] || '📦'}</span>
                <span className="font-semibold text-sm" style={{ color: CAT_COLORS[cat] || '#e2e8f0' }}>{cat}</span>
                <span className="ml-auto text-xs" style={{ color: 'rgba(226,232,240,0.4)' }}>
                  {catItems.filter(i => i.isPacked).length}/{catItems.length}
                </span>
              </div>
              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                {catItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-3 transition-all"
                    style={{ background: item.isPacked ? 'rgba(78,205,196,0.03)' : 'transparent' }}>
                    <button id={`toggle-${item.id}`} onClick={() => togglePacked(item)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                      style={{ background: item.isPacked ? 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' : 'rgba(255,255,255,0.08)', border: item.isPacked ? 'none' : '2px solid rgba(255,255,255,0.15)' }}>
                      {item.isPacked && <Check size={12} className="text-white" />}
                    </button>
                    <span className="flex-1 text-sm" style={{ color: item.isPacked ? 'rgba(226,232,240,0.35)' : 'rgba(226,232,240,0.85)', textDecoration: item.isPacked ? 'line-through' : 'none' }}>
                      {item.itemName}
                    </span>
                    <button onClick={() => deleteItem(item.id)} className="p-1 opacity-30 hover:opacity-70 transition-opacity">
                      <Trash2 size={13} style={{ color: '#ff6b6b' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Smart suggestions */}
      <div className="glass rounded-2xl p-5">
        <p className="font-bold text-white mb-4 flex items-center gap-2">
          <span>✨</span> Smart Suggestions
        </p>
        <div className="space-y-3">
          {CATEGORIES.map(cat => {
            const missing = SMART_SUGGESTIONS[cat].filter(s => !items.some(i => i.itemName.toLowerCase() === s.toLowerCase()));
            if (missing.length === 0) return null;
            return (
              <div key={cat}>
                <p className="text-xs mb-2" style={{ color: CAT_COLORS[cat] }}>{CAT_ICONS[cat]} {cat}</p>
                <div className="flex flex-wrap gap-2">
                  {missing.slice(0, 4).map(s => (
                    <button key={s} id={`suggest-${s.slice(0, 10)}`} onClick={() => addSuggestion(s, cat)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(226,232,240,0.6)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = `${CAT_COLORS[cat]}12`; e.currentTarget.style.color = CAT_COLORS[cat]; e.currentTarget.style.borderColor = `${CAT_COLORS[cat]}30`; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(226,232,240,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                      <Plus size={10} /> {s}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
