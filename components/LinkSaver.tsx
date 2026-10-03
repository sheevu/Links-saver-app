// WIRED TO YOUR SHEET: https://docs.google.com/spreadsheets/d/1h9dlyn8bzdIr9sq_TGfrarMMZVvSPPZ49zhxAGYM-JE/edit
// Sheet ID: 1h9dlyn8bzdIr9sq_TGfrarMMZVvSPPZ49zhxAGYM-JE
// Mobile-fixed Notion vibrant edition - contrast glossy borders, 4 views, auto date
import React, { useEffect, useState, useRef, useMemo } from 'react';
import Footer from './Footer';

type Label = 'Inspo' | 'Work' | 'Learn' | 'Tool' | 'Read' | 'Watch';
type TagColor = 'violet' | 'blue' | 'emerald' | 'amber' | 'rose' | 'fuchsia' | 'orange' | 'cyan';
type ViewType = 'grid' | 'list' | 'gallery' | 'table';

interface LinkItem {
  id: string;
  title: string;
  url: string;
  label: Label;
  tag: string;
  tagColor: TagColor;
  favicon: string;
  createdAt: number;
  favorite: boolean;
  description?: string;
}

const LABELS: Label[] = ['Inspo', 'Work', 'Learn', 'Tool', 'Read', 'Watch'];
const TAG_COLORS: Record<TagColor, { bg: string; text: string; border: string; bar: string; light: string; dark: string }> = {
  violet: { bg: '#7C3AED', text: '#fff', border: '#5B21B6', bar: 'linear-gradient(90deg,#7C3AED,#A78BFA)', light: 'rgba(124,58,237,0.15)', dark: 'rgba(124,58,237,0.25)' },
  blue: { bg: '#2563EB', text: '#fff', border: '#1D4ED8', bar: 'linear-gradient(90deg,#2563EB,#60A5FA)', light: 'rgba(37,99,235,0.15)', dark: 'rgba(37,99,235,0.25)' },
  emerald: { bg: '#059669', text: '#fff', border: '#047857', bar: 'linear-gradient(90deg,#059669,#34D399)', light: 'rgba(5,150,105,0.15)', dark: 'rgba(5,150,105,0.25)' },
  amber: { bg: '#D97706', text: '#fff', border: '#B45309', bar: 'linear-gradient(90deg,#D97706,#FBBF24)', light: 'rgba(217,119,6,0.15)', dark: 'rgba(217,119,6,0.25)' },
  rose: { bg: '#E11D48', text: '#fff', border: '#BE123C', bar: 'linear-gradient(90deg,#E11D48,#FB7185)', light: 'rgba(225,29,72,0.15)', dark: 'rgba(225,29,72,0.25)' },
  fuchsia: { bg: '#C026D3', text: '#fff', border: '#A21CAF', bar: 'linear-gradient(90deg,#C026D3,#E879F9)', light: 'rgba(192,38,211,0.15)', dark: 'rgba(192,38,211,0.25)' },
  orange: { bg: '#EA580C', text: '#fff', border: '#C2410C', bar: 'linear-gradient(90deg,#EA580C,#FB923C)', light: 'rgba(234,88,12,0.15)', dark: 'rgba(234,88,12,0.25)' },
  cyan: { bg: '#0891B2', text: '#fff', border: '#0E7490', bar: 'linear-gradient(90deg,#0891B2,#22D3EE)', light: 'rgba(8,145,178,0.15)', dark: 'rgba(8,145,178,0.25)' },
};

const LABEL_COLORS: Record<Label, TagColor> = {
  Inspo: 'violet', Work: 'blue', Learn: 'emerald', Tool: 'amber', Read: 'rose', Watch: 'fuchsia'
};

const SEED_LINKS: LinkItem[] = [
  { id: 'sudarshan-ai', title: 'Sudarshan AI — Autonomous Enterprise AI Agents & Tools', url: 'https://sudarshan-ai.com/', label: 'Tool', tag: 'AI & Agents', tagColor: 'violet', favicon: 'S', createdAt: Date.now()-1000*60*5, favorite: true, description: 'Next-gen enterprise AI agents, intelligent cognitive automation, and productivity tools.' },
  { id: 'vyapai-blogs', title: 'Vyapai Blogs — In-Depth Tech, AI & Business Insights', url: 'https://blogs.vyapai.in/', label: 'Read', tag: 'Engineering', tagColor: 'blue', favicon: 'V', createdAt: Date.now()-1000*60*25, favorite: true, description: 'Deep-dives into modern software architecture, tech insights, and innovation guides.' },
  { id: '1', title: 'Linear App — Issue Tracking for High-Performance Teams', url: 'https://linear.app', label: 'Tool', tag: 'Productivity', tagColor: 'violet', favicon: 'L', createdAt: Date.now()-1000*60*60, favorite: true, description: 'The issue tracking tool you\'ll actually enjoy using.' },
  { id: '2', title: 'Refactoring UI: Complete Guide to Designing Beautiful Interfaces', url: 'https://refactoringui.com', label: 'Learn', tag: 'Design', tagColor: 'emerald', favicon: 'R', createdAt: Date.now()-1000*60*60*2, favorite: false, description: 'Learn how to design awesome UIs.' },
  { id: '3', title: 'Vercel Ship: The Best Frontend Cloud Platform', url: 'https://vercel.com/ship', label: 'Inspo', tag: 'DevTools', tagColor: 'blue', favicon: 'V', createdAt: Date.now()-1000*60*60*24, favorite: true },
  { id: '4', title: 'Raycast Store — Blazingly Fast Control', url: 'https://raycast.com/store', label: 'Tool', tag: 'Mac', tagColor: 'amber', favicon: 'R', createdAt: Date.now()-1000*60*60*5, favorite: false },
  { id: '5', title: 'Framer Motion — Production Ready Animation', url: 'https://framer.com/motion', label: 'Learn', tag: 'Animation', tagColor: 'rose', favicon: 'F', createdAt: Date.now()-1000*60*60*8, favorite: false },
  { id: '6', title: 'Maggie Appleton — Digital Gardening Essays', url: 'https://maggieappleton.com', label: 'Read', tag: 'Essays', tagColor: 'fuchsia', favicon: 'M', createdAt: Date.now()-1000*60*60*12, favorite: false },
];

function relativeTime(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff/60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m/60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h/24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
function fullDate(ts: number) {
  return new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
}

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<ViewType>('grid');
  const [links, setLinks] = useState<LinkItem[]>(SEED_LINKS);
  const [search, setSearch] = useState('');
  const [filterLabel, setFilterLabel] = useState<Label | 'All'>('All');
  const [filterFav, setFilterFav] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [showCmd, setShowCmd] = useState(false);
  const [editing, setEditing] = useState<LinkItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light'|'dark'>('light');
  const [formTick, setFormTick] = useState(Date.now());
  const searchRef = useRef<HTMLInputElement>(null);
  const [newLink, setNewLink] = useState<Partial<LinkItem>>({ label: 'Inspo', tag: '', tagColor: 'violet', title: '', url: '' });

  // Client hydration & localStorage loading
  useEffect(() => {
    setMounted(true);
    try {
      const savedView = localStorage.getItem('link-saver-view') as ViewType;
      if (savedView) setView(savedView);

      const s = localStorage.getItem('link-saver-links');
      if (s) {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed) && parsed.length > 0) setLinks(parsed);
      }

      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      }
    } catch {}
  }, []);

  useEffect(() => { if (mounted) localStorage.setItem('link-saver-view', view); }, [view, mounted]);
  useEffect(() => { if (mounted) localStorage.setItem('link-saver-links', JSON.stringify(links)); }, [links, mounted]);
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme, mounted]);
  useEffect(() => { if (!showForm) return; const id = setInterval(()=>setFormTick(Date.now()), 1000); return ()=>clearInterval(id); }, [showForm]);

  // keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'n' && !(e.target instanceof HTMLInputElement)) { setEditing(null); setNewLink({ label: 'Inspo', tag: '', tagColor: 'violet', title: '', url: '' }); setShowForm(true); }
      if (e.key === '/' && !(e.target instanceof HTMLInputElement)) { e.preventDefault(); searchRef.current?.focus(); }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setShowCmd(v=>!v); }
      if (e.key === '?' ) setShowCmd(v=>!v);
      if (e.key === 'Escape') { setShowForm(false); setShowCmd(false); setShowSheet(false); }
    };
    window.addEventListener('keydown', h); return ()=>window.removeEventListener('keydown', h);
  }, []);

  const filtered = useMemo(() => {
    return links.filter(l => {
      if (filterLabel !== 'All' && l.label !== filterLabel) return false;
      if (filterFav && !l.favorite) return false;
      if (search) {
        const q = search.toLowerCase();
        return l.title.toLowerCase().includes(q) || l.url.toLowerCase().includes(q) || l.tag.toLowerCase().includes(q);
      }
      return true;
    });
  }, [links, search, filterLabel, filterFav]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(()=>setToast(null), 2500); };

  const handleSave = () => {
    if (!newLink.title || !newLink.url) { showToast('Title & URL required'); return; }
    try { new URL(newLink.url!.startsWith('http') ? newLink.url! : 'https://'+newLink.url!); } catch { showToast('Invalid URL'); return; }
    const url = newLink.url!.startsWith('http') ? newLink.url! : 'https://'+newLink.url!;
    if (editing) {
      setLinks(ls => ls.map(x => x.id===editing.id ? { ...x, title: newLink.title!, url, label: newLink.label as Label, tag: newLink.tag||'General', tagColor: newLink.tagColor as TagColor } : x));
      showToast('Link updated ✨');
    } else {
      const item: LinkItem = {
        id: Date.now().toString(),
        title: newLink.title!,
        url,
        label: (newLink.label as Label) || 'Inspo',
        tag: newLink.tag || 'General',
        tagColor: (newLink.tagColor as TagColor) || 'violet',
        favicon: newLink.title!.charAt(0).toUpperCase(),
        createdAt: Date.now(),
        favorite: false,
      };
      setLinks(ls => [item, ...ls]);
      showToast('Saved! Confetti 🎉');
      // confetti
      const conf = document.createElement('div');
      conf.innerHTML = '🎉✨🎊';
      conf.style.cssText = 'position:fixed;top:50%;left:50%;font-size:40px;animation:pop 0.8s ease;pointer-events:none;z-index:9999';
      document.body.appendChild(conf); setTimeout(()=>conf.remove(),800);
    }
    setShowForm(false); setEditing(null);
  };

  const toggleSelect = (id: string) => {
    setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const glossyCard = theme==='light'
    ? 'bg-[rgba(255,255,255,0.98)] backdrop-blur-[12px] border-[1.5px] border-[#E4E4E7] shadow-[0_1px_3px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)]'
    : 'bg-[rgba(24,24,27,0.98)] backdrop-blur-[12px] border-[1.5px] border-[rgba(255,255,255,0.16)] shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]';

  return (
    <div className={`min-h-screen w-full font-[Inter] antialiased selection:bg-violet-500/30 ${theme==='dark'?'dark bg-[#09090B] text-zinc-100':'bg-[#FAFAFA] text-zinc-900'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&family=Geist+Mono:wght@400;500;600&display=swap');
        *{font-family:Inter,sans-serif}
        .display{font-family:'Plus Jakarta Sans',sans-serif}
        .mono{font-family:'Geist Mono',monospace}
        @keyframes pop{0%{transform:translate(-50%,-50%) scale(0)}50%{transform:translate(-50%,-80%) scale(1.3)}100%{transform:translate(-50%,-120%) scale(0);opacity:0}}
        @keyframes sheen{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
        .glossy-before{position:relative;overflow:hidden}
        .glossy-before::before{content:'';position:absolute;top:0;left:0;right:0;height:45%;background:linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0));pointer-events:none;z-index:1;border-radius:inherit}
        ::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-thumb{background:#D4D4D8;border-radius:10px}
        .dark ::-webkit-scrollbar-thumb{background:#3F3F46}
        .no-scrollbar::-webkit-scrollbar{display:none}
        .no-scrollbar{scrollbar-width:none}
      `}</style>

      {/* Aurora */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[30%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[80px] opacity-[0.35] md:opacity-[0.6] bg-[radial-gradient(circle_at_center,#7C3AED_0%,#2563EB_40%,transparent_70%)]" />
        <div className="absolute top-[10%] right-[-15%] w-[60%] h-[60%] rounded-full blur-[90px] opacity-[0.3] md:opacity-[0.5] bg-[radial-gradient(circle_at_center,#E11D48_0%,#F59E0B_50%,transparent_70%)]" />
        <div className="absolute bottom-[-20%] left-[20%] w-[80%] h-[50%] rounded-full blur-[100px] opacity-[0.25] md:opacity-[0.45] bg-[radial-gradient(circle_at_center,#059669_0%,#0891B2_60%,transparent_80%)]" />
      </div>

      {/* HEADER */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl ${theme==='light'?'bg-white/90 border-b-[1.5px] border-[#E4E4E7]':'bg-zinc-900/90 border-b-[1.5px] border-white/10'} shadow-[0_1px_3px_rgba(0,0,0,0.06)]`} style={{top:'var(--safe-area-inset-top,0px)'}}>
        <div className="md:hidden">
          {/* Row1 */}
          <div className="flex items-center justify-between px-4 py-3 gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[10px] bg-[#7C3AED] border-[1.5px] border-[#5B21B6] shadow-[0_1px_3px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.3)] grid place-items-center text-white font-black display text-[16px] glossy-before">L</div>
              <span className="display font-extrabold text-[18px] tracking-[-0.03em]">LinkSaver</span>
              <span className="mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-600 text-white border-[1.5px] border-violet-800">WIRED</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={()=>setTheme(theme==='light'?'dark':'light')} className={`w-9 h-9 grid place-items-center rounded-[10px] border-[1.5px] ${glossyCard}`}>{theme==='light'?'🌙':'☀️'}</button>
              <button onClick={()=>setShowSheet(true)} className={`w-9 h-9 grid place-items-center rounded-[10px] border-[1.5px] ${glossyCard} font-bold`}>⚡</button>
            </div>
          </div>
          {/* view switcher row */}
          <div className="px-4 pb-2">
            <div className={`flex p-1 rounded-[12px] border-[1.5px] ${theme==='light'?'bg-zinc-100 border-[#E4E4E7]':'bg-zinc-800 border-white/10'}`}>
              {(['grid','list','gallery','table'] as ViewType[]).map(v => (
                <button key={v} onClick={()=>setView(v)} className={`flex-1 h-8 rounded-[8px] text-[12px] font-bold uppercase tracking-[0.06em] transition-all border-[1.5px] ${view===v ? 'bg-[#7C3AED] text-white border-[#5B21B6] shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.2)]' : 'border-transparent text-zinc-500'}`}>{v}</button>
              ))}
            </div>
          </div>
          {/* search + chips */}
          <div className="px-4 pb-3 space-y-3">
            <div className={`flex items-center gap-2 h-12 rounded-[14px] px-4 ${glossyCard}`}>
              <span className="text-zinc-400">⌕</span>
              <input ref={searchRef} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search links, tags, URLs..." className="flex-1 bg-transparent outline-none text-[15px] font-medium placeholder:text-zinc-400" />
              {search && <button onClick={()=>setSearch('')} className="w-7 h-7 grid place-items-center rounded-full bg-zinc-100 text-zinc-500">✕</button>}
            </div>
            <div className="relative">
              <div className="flex gap-2 overflow-x-auto no-scrollbar snap-x pr-6" style={{scrollPaddingInline:'16px'}}>
                <button onClick={()=>{setFilterLabel('All'); setFilterFav(false);}} className={`snap-start shrink-0 h-11 px-4 rounded-full border-[1.5px] text-[13px] font-bold glossy-before ${filterLabel==='All' && !filterFav ? 'bg-zinc-900 text-white border-zinc-700 dark:bg-white dark:text-zinc-900' : glossyCard}`}>All</button>
                <button onClick={()=>setFilterFav(!filterFav)} className={`snap-start shrink-0 h-11 px-4 rounded-full border-[1.5px] text-[13px] font-bold glossy-before ${filterFav ? 'bg-amber-500 text-white border-amber-700' : glossyCard}`}>★ Fav</button>
                {LABELS.map(l => (
                  <button key={l} onClick={()=>setFilterLabel(l)} className={`snap-start shrink-0 h-11 px-4 rounded-full border-[1.5px] text-[13px] font-bold glossy-before ${filterLabel===l ? 'text-white' : ''}`} style={filterLabel===l ? { background: TAG_COLORS[LABEL_COLORS[l]].bg, borderColor: TAG_COLORS[LABEL_COLORS[l]].border } : {}} >{filterLabel!==l ? <span className={glossyCard+' rounded-full px-3 py-1.5 -m-1.5 block'}>{l}</span> : l}</button>
                ))}
              </div>
              <div className={`pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l ${theme==='light'?'from-[#FAFAFA]':'from-[#09090B]'} to-transparent`} />
            </div>
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden md:flex items-center gap-4 px-6 py-3.5 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#7C3AED] border-[1.5px] border-[#5B21B6] shadow-[0_2px_6px_rgba(124,58,237,0.3),inset_0_1px_0_rgba(255,255,255,0.3)] grid place-items-center text-white font-black display text-[18px] glossy-before">L</div>
            <span className="display font-extrabold text-[20px] tracking-[-0.03em]">LinkSaver</span>
            <span className="mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-600 text-white border-[1.5px] border-violet-800">WIRED v2</span>
          </div>
          <div className={`flex p-1 rounded-[12px] border-[1.5px] ml-4 ${theme==='light'?'bg-zinc-100 border-[#E4E4E7]':'bg-zinc-800 border-white/10'}`}>
            {(['grid','list','gallery','table'] as ViewType[]).map(v => (
              <button key={v} onClick={()=>setView(v)} className={`h-8 px-4 rounded-[8px] text-[11px] font-bold uppercase tracking-[0.06em] transition-all border-[1.5px] ${view===v ? 'bg-[#7C3AED] text-white border-[#5B21B6] shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.2)]' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}>{v}</button>
            ))}
          </div>
          <div className={`flex items-center gap-2 h-10 flex-1 max-w-[420px] rounded-[12px] px-4 ml-2 ${glossyCard}`}>
            <span className="text-zinc-400">⌕</span>
            <input ref={searchRef} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search ( / )" className="flex-1 bg-transparent outline-none text-[14px] font-medium" />
            <span className="mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 dark:bg-zinc-800">/</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <a href="https://docs.google.com/spreadsheets/d/1h9dlyn8bzdIr9sq_TGfrarMMZVvSPPZ49zhxAGYM-JE/edit" target="_blank" className={`h-10 px-3 rounded-[10px] border-[1.5px] ${glossyCard} text-[12px] font-bold flex items-center gap-1.5`}><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />Sheet</a>
            <button onClick={()=>setShowSheet(true)} className={`h-10 px-3 rounded-[10px] border-[1.5px] ${glossyCard} text-[12px] font-bold`}>Sync</button>
            <button onClick={()=>setTheme(theme==='light'?'dark':'light')} className={`w-10 h-10 grid place-items-center rounded-[12px] border-[1.5px] ${glossyCard}`}>{theme==='light'?'🌙':'☀️'}</button>
            <button onClick={()=>{setEditing(null); setNewLink({ label: 'Inspo', tag: '', tagColor: 'violet', title: '', url: '' }); setShowForm(true);}} className="h-10 px-5 rounded-[12px] bg-[#7C3AED] text-white font-bold text-[13px] border-[1.5px] border-[#5B21B6] shadow-[0_2px_8px_rgba(124,58,237,0.3),inset_0_1px_0_rgba(255,255,255,0.25)] glossy-before">+ New Link (N)</button>
          </div>
        </div>
      </header>

      {/* Desktop filters */}
      <div className="hidden md:flex items-center gap-2 px-6 py-3 max-w-[1600px] mx-auto">
        <div className="flex gap-2">
          <button onClick={()=>{setFilterLabel('All'); setFilterFav(false);}} className={`h-9 px-4 rounded-full border-[1.5px] text-[12px] font-bold ${filterLabel==='All'&&!filterFav?'bg-zinc-900 text-white border-zinc-800 dark:bg-white dark:text-black':' '+glossyCard}`}>All • {links.length}</button>
          <button onClick={()=>setFilterFav(!filterFav)} className={`h-9 px-4 rounded-full border-[1.5px] text-[12px] font-bold ${filterFav?'bg-amber-500 text-white border-amber-700':glossyCard}`}>★ Favorites</button>
          {LABELS.map(l => (
            <button key={l} onClick={()=>setFilterLabel(filterLabel===l?'All':l)} className={`h-9 px-4 rounded-full border-[1.5px] text-[12px] font-bold transition-all ${filterLabel===l?'text-white':''}`} style={filterLabel===l?{background: TAG_COLORS[LABEL_COLORS[l]].bg, borderColor: TAG_COLORS[LABEL_COLORS[l]].border}:{}}>{filterLabel!==l? <span className={`${glossyCard} rounded-full px-3 py-1 -m-1 block`}>{l}</span>:l}</button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="mono text-[11px] font-bold uppercase tracking-[0.06em] text-zinc-500">{filtered.length} links</span>
          {selected.size>0 && <button onClick={()=>setSelected(new Set())} className={`h-8 px-3 rounded-full text-[11px] font-bold border-[1.5px] ${glossyCard}`}>Clear {selected.size}</button>}
        </div>
      </div>

      {/* MAIN */}
      <main className="max-w-[1600px] mx-auto px-4 md:px-6 pb-[120px] md:pb-10">
        {filtered.length===0 ? (
          <div className={`mt-12 md:mt-20 mx-auto max-w-[480px] rounded-[20px] p-10 text-center border-[1.5px] ${glossyCard} glossy-before`}>
            <div className="w-16 h-16 mx-auto rounded-[16px] bg-violet-600 border-[1.5px] border-violet-800 grid place-items-center text-white text-2xl mb-4">∅</div>
            <h3 className="display font-extrabold text-[20px] tracking-[-0.02em]">No links yet</h3>
            <p className="text-[14px] text-zinc-500 mt-2 leading-relaxed">Create your first link. Press <span className="mono font-bold bg-zinc-100 px-1.5 rounded border">N</span> or tap +</p>
            <button onClick={()=>{setEditing(null); setShowForm(true);}} className="mt-6 h-11 px-6 rounded-[12px] bg-[#7C3AED] text-white font-bold border-[1.5px] border-[#5B21B6] glossy-before">+ New Link</button>
          </div>
        ) : (
          <>
            {view==='grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mt-4">
                {filtered.map(item => {
                  const tc = TAG_COLORS[item.tagColor];
                  return (
                    <div key={item.id} className={`group relative rounded-[18px] p-4 md:p-5 ${glossyCard} glossy-before transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-[1px]`}>
                      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-[18px]" style={{ background: tc.bar }} />
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-[12px] grid place-items-center text-white font-bold text-[15px] border-[1.5px] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] glossy-before shrink-0" style={{ background: tc.bg, borderColor: tc.border }}>{item.favicon}</div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-[18px] leading-[1.25] tracking-[-0.01em] line-clamp-2">{item.title}</h3>
                            <a href={item.url} target="_blank" className="mono text-[13px] font-medium text-zinc-500 hover:text-violet-600 truncate block mt-1 max-w-[200px]">{item.url.replace(/^https?:\/\//,'')}</a>
                          </div>
                        </div>
                        <button onClick={()=>setLinks(ls=>ls.map(x=>x.id===item.id?{...x,favorite:!x.favorite}:x))} className={`w-8 h-8 shrink-0 grid place-items-center rounded-full border-[1.5px] ${item.favorite?'bg-amber-400 border-amber-600 text-white':' '+glossyCard+' text-zinc-300'} text-[14px]`}>★</button>
                      </div>
                      <div className="flex items-center gap-2 mt-4 flex-wrap">
                        <span className="inline-flex items-center h-7 px-3 rounded-full text-[11px] font-bold uppercase tracking-[0.06em] border-[1.5px] text-white glossy-before" style={{ background: TAG_COLORS[LABEL_COLORS[item.label]].bg, borderColor: TAG_COLORS[LABEL_COLORS[item.label]].border }}>{item.label}</span>
                        <span className="inline-flex items-center h-7 px-3 rounded-full text-[12px] font-bold border-[1.5px] glossy-before" style={{ background: theme==='light'?tc.light:tc.dark, color: tc.bg, borderColor: tc.bg+'55' }}>#{item.tag}</span>
                        <span className="ml-auto mono text-[11px] text-zinc-500 font-medium" title={fullDate(item.createdAt)}>{relativeTime(item.createdAt)}</span>
                      </div>
                      <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={()=>{setEditing(item); setNewLink({ title:item.title, url:item.url, label:item.label, tag:item.tag, tagColor:item.tagColor }); setShowForm(true);}} className={`h-8 px-3 rounded-[8px] text-[11px] font-bold border-[1.5px] ${glossyCard}`}>Edit</button>
                        <button onClick={()=>toggleSelect(item.id)} className={`h-8 px-3 rounded-[8px] text-[11px] font-bold border-[1.5px] ${selected.has(item.id)?'bg-violet-600 text-white border-violet-800':glossyCard}`}>{selected.has(item.id)?'Selected':'Select'}</button>
                        <a href={item.url} target="_blank" className="ml-auto h-8 px-3 rounded-[8px] text-[11px] font-bold bg-zinc-900 text-white border-[1.5px] border-zinc-700 dark:bg-white dark:text-black">Open ↗</a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {view==='list' && (
              <div className={`mt-4 rounded-[16px] overflow-hidden border-[1.5px] ${glossyCard} divide-y divide-zinc-100 dark:divide-white/5`}>
                {filtered.map(item => {
                  const tc = TAG_COLORS[item.tagColor];
                  return (
                    <div key={item.id} className="flex items-center gap-3 px-4 h-[68px] hover:bg-zinc-50 dark:hover:bg-white/[0.04] transition group">
                      <input type="checkbox" checked={selected.has(item.id)} onChange={()=>toggleSelect(item.id)} className="w-5 h-5 rounded-[6px] accent-violet-600" />
                      <div className="w-9 h-9 rounded-[10px] grid place-items-center text-white font-bold text-[13px] border-[1.5px] shrink-0 glossy-before" style={{ background: tc.bg, borderColor: tc.border }}>{item.favicon}</div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-[15px] leading-tight truncate">{item.title}</div>
                        <div className="mono text-[12px] text-zinc-500 truncate">{item.url.replace(/^https?:\/\//,'')}</div>
                      </div>
                      <div className="hidden md:flex items-center gap-2">
                        <span className="h-6 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.06em] text-white border-[1.5px]" style={{ background: TAG_COLORS[LABEL_COLORS[item.label]].bg, borderColor: TAG_COLORS[LABEL_COLORS[item.label]].border }}>{item.label}</span>
                        <span className="h-6 px-2.5 rounded-full text-[11px] font-bold border-[1.5px]" style={{ background: tc.light, color: tc.bg, borderColor: tc.bg+'44' }}>{item.tag}</span>
                        <span className="mono text-[11px] text-zinc-500 w-[80px] text-right">{relativeTime(item.createdAt)}</span>
                        <button onClick={()=>setLinks(ls=>ls.map(x=>x.id===item.id?{...x,favorite:!x.favorite}:x))} className={`w-8 h-8 grid place-items-center rounded-full ${item.favorite?'text-amber-500':'text-zinc-300'}`}>★</button>
                      </div>
                      <div className="md:hidden ml-auto text-[11px] mono text-zinc-500">{relativeTime(item.createdAt)}</div>
                    </div>
                  );
                })}
              </div>
            )}
            {view==='gallery' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {filtered.map(item => {
                  const tc = TAG_COLORS[item.tagColor];
                  return (
                    <div key={item.id} className={`rounded-[18px] overflow-hidden border-[1.5px] ${glossyCard} glossy-before`}>
                      <div className="h-[140px] grid place-items-center relative" style={{ background: `radial-gradient(120% 120% at 30% 20%, ${tc.bg}22, transparent 60%), linear-gradient(135deg, ${tc.bg}18, transparent)` }}>
                        <div className="w-14 h-14 rounded-[16px] grid place-items-center text-white font-black text-[22px] border-[1.5px] shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.3)] glossy-before" style={{ background: tc.bg, borderColor: tc.border }}>{item.favicon}</div>
                        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: tc.bar }} />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-[16px] leading-[1.25] line-clamp-2">{item.title}</h3>
                        <div className="flex gap-2 mt-3">
                          <span className="h-6 px-2 rounded-full text-[10px] font-bold uppercase tracking-[0.06em] text-white" style={{ background: TAG_COLORS[LABEL_COLORS[item.label]].bg }}>{item.label}</span>
                          <span className="mono text-[11px] text-zinc-500">{relativeTime(item.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {view==='table' && (
              <div className={`mt-4 rounded-[16px] border-[1.5px] ${glossyCard} overflow-auto`}>
                <div className="min-w-[760px]">
                  <div className={`sticky top-0 z-10 flex items-center gap-3 px-4 h-[52px] text-[11px] font-bold uppercase tracking-[0.06em] border-b-[1.5px] ${theme==='light'?'bg-zinc-50 border-zinc-200':'bg-zinc-800 border-white/10'} glossy-before`}>
                    <span className="w-10">✓</span><span className="w-[280px]">Title</span><span className="w-[220px]">URL</span><span className="w-[90px]">Label</span><span className="w-[110px]">Tag</span><span className="w-[110px]">Date</span><span className="w-10">Fav</span>
                  </div>
                  {filtered.map((item,i)=>(
                    <div key={item.id} className={`flex items-center gap-3 px-4 h-[52px] border-b border-zinc-100 dark:border-white/5 text-[13px] ${i%2===0?'':'bg-zinc-50/60 dark:bg-white/[0.02]'}`}>
                      <input type="checkbox" checked={selected.has(item.id)} onChange={()=>toggleSelect(item.id)} className="w-4 h-4" />
                      <span className="w-[280px] font-semibold truncate flex items-center gap-2"><span className="w-6 h-6 rounded-[6px] grid place-items-center text-white text-[11px] font-bold shrink-0" style={{ background: TAG_COLORS[item.tagColor].bg }}>{item.favicon}</span>{item.title}</span>
                      <span className="w-[220px] mono text-[12px] text-zinc-500 truncate">{item.url}</span>
                      <span className="w-[90px]"><span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase text-white" style={{ background: TAG_COLORS[LABEL_COLORS[item.label]].bg }}>{item.label}</span></span>
                      <span className="w-[110px] truncate">{item.tag}</span>
                      <span className="w-[110px] mono text-[11px] text-zinc-500">{relativeTime(item.createdAt)}</span>
                      <button onClick={()=>setLinks(ls=>ls.map(x=>x.id===item.id?{...x,favorite:!x.favorite}:x))} className={`w-10 grid place-items-center ${item.favorite?'text-amber-500':'text-zinc-300'}`}>★</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* FOOTER WITH SEO OPTIMISED CTA */}
      <Footer theme={theme} />

      {/* FAB */}
      <button onClick={()=>{setEditing(null); setNewLink({ label:'Inspo', tag:'', tagColor:'violet', title:'', url:'' }); setShowForm(true);}} className="md:hidden fixed bottom-6 right-4 w-14 h-14 rounded-full bg-[#7C3AED] text-white text-[26px] font-bold grid place-items-center border-[1.5px] border-[#5B21B6] shadow-[0_8px_24px_rgba(124,58,237,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] glossy-before z-30" style={{ bottom:'calc(24px + env(safe-area-inset-bottom,0px))' }}>+</button>

      {/* Bulk bar */}
      {selected.size>0 && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 h-14 rounded-full border-[1.5px] shadow-[0_8px_32px_rgba(0,0,0,0.16)] glossy-before backdrop-blur-xl bg-white/95 dark:bg-zinc-900/95 border-zinc-200 dark:border-white/10" style={{ bottom:'calc(16px + env(safe-area-inset-bottom,0px))' }}>
          <span className="mono text-[12px] font-bold">{selected.size} selected</span>
          <button onClick={()=>{setLinks(ls=>ls.filter(x=>!selected.has(x.id))); setSelected(new Set()); showToast('Deleted');}} className="h-9 px-4 rounded-full bg-rose-600 text-white text-[12px] font-bold border-[1.5px] border-rose-800">Delete</button>
          <button onClick={()=>setSelected(new Set())} className={`h-9 px-4 rounded-full text-[12px] font-bold border-[1.5px] ${glossyCard}`}>Clear</button>
        </div>
      )}

      {/* FORM SHEET */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={()=>setShowForm(false)} />
          <div className={`relative w-full md:max-w-[560px] max-h-[94vh] md:max-h-[85vh] rounded-t-[28px] md:rounded-[20px] border-[1.5px] ${glossyCard} glossy-before flex flex-col overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.2)] animate-[slideUp_0.3s_ease]`} style={{ paddingBottom:'env(safe-area-inset-bottom,0px)' }}>
            <style>{`@keyframes slideUp{from{transform:translateY(24px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
            <div className="md:hidden w-10 h-1.5 rounded-full bg-zinc-300 mx-auto mt-3" />
            <div className="px-6 py-4 border-b-[1.5px] border-zinc-100 dark:border-white/10 flex items-center justify-between">
              <div>
                <h2 className="display font-extrabold text-[20px] tracking-[-0.03em]">{editing?'Edit Link':'New Link'}</h2>
                <div className="mono text-[11px] text-zinc-500 mt-0.5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>Auto</span>
                  <span>{new Date(formTick).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})} · {new Date(formTick).toLocaleTimeString('en-US',{hour12:true})}</span>
                </div>
              </div>
              <button onClick={()=>setShowForm(false)} className={`w-9 h-9 grid place-items-center rounded-[10px] border-[1.5px] ${glossyCard}`}>✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5" style={{ paddingBottom:'120px' }}>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.06em] text-zinc-500">Title *</label>
                <input value={newLink.title||''} onChange={e=>setNewLink({...newLink, title:e.target.value})} placeholder="Linear App — Issue Tracking..." className={`mt-2 w-full h-12 rounded-[12px] px-4 text-[15px] font-semibold border-[1.5px] outline-none focus:ring-2 focus:ring-violet-500/30 ${glossyCard}`} />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.06em] text-zinc-500">URL *</label>
                <input value={newLink.url||''} onChange={e=>setNewLink({...newLink, url:e.target.value})} placeholder="https://linear.app" className={`mt-2 w-full h-12 rounded-[12px] px-4 mono text-[14px] font-medium border-[1.5px] outline-none focus:ring-2 focus:ring-violet-500/30 ${glossyCard}`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.06em] text-zinc-500">Label</label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {LABELS.map(l => (
                      <button key={l} onClick={()=>setNewLink({...newLink, label:l, tagColor: LABEL_COLORS[l]})} className={`h-10 rounded-[10px] text-[11px] font-bold uppercase tracking-[0.05em] border-[1.5px] glossy-before ${newLink.label===l?'text-white':' '+glossyCard}`} style={newLink.label===l?{ background: TAG_COLORS[LABEL_COLORS[l]].bg, borderColor: TAG_COLORS[LABEL_COLORS[l]].border }:{}}>{l}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.06em] text-zinc-500">Tag</label>
                  <input value={newLink.tag||''} onChange={e=>setNewLink({...newLink, tag:e.target.value})} placeholder="Design" className={`mt-2 w-full h-10 rounded-[10px] px-3 text-[13px] font-semibold border-[1.5px] outline-none ${glossyCard}`} />
                  <div className="mt-2 flex gap-1.5 flex-wrap">
                    {(Object.keys(TAG_COLORS) as TagColor[]).map(c => (
                      <button key={c} onClick={()=>setNewLink({...newLink, tagColor:c})} className={`w-7 h-7 rounded-full border-[1.5px] ${newLink.tagColor===c?'ring-2 ring-offset-2 ring-zinc-900 dark:ring-white':''}`} style={{ background: TAG_COLORS[c].bg, borderColor: TAG_COLORS[c].border }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className={`sticky bottom-0 p-4 border-t-[1.5px] backdrop-blur-xl bg-white/90 dark:bg-zinc-900/90 ${theme==='light'?'border-zinc-200':'border-white/10'}`}>
              <div className="flex gap-3">
                <button onClick={()=>setShowForm(false)} className={`flex-1 h-12 rounded-[12px] font-bold text-[14px] border-[1.5px] ${glossyCard}`}>Cancel</button>
                <button onClick={handleSave} className="flex-1 h-12 rounded-[12px] bg-[#7C3AED] text-white font-bold text-[14px] border-[1.5px] border-[#5B21B6] shadow-[0_4px_12px_rgba(124,58,237,0.3),inset_0_1px_0_rgba(255,255,255,0.25)] glossy-before">{editing?'Update':'Save Link →'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sheets modal */}
      {showSheet && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={()=>setShowSheet(false)} />
          <div className={`relative w-full md:max-w-[560px] rounded-t-[24px] md:rounded-[20px] border-[1.5px] ${glossyCard} p-6 glossy-before`}>
            <h3 className="display font-extrabold text-[18px]">Google Sheets Sync</h3>
            <div className={`mt-3 p-3 rounded-[12px] border-[1.5px] ${glossyCard} mono text-[12px] break-all`}>
              ID: <b>1h9dlyn8bzdIr9sq_TGfrarMMZVvSPPZ49zhxAGYM-JE</b><br/>
              <a href="https://docs.google.com/spreadsheets/d/1h9dlyn8bzdIr9sq_TGfrarMMZVvSPPZ49zhxAGYM-JE/edit" target="_blank" className="text-violet-600 underline">Open Sheet ↗</a>
            </div>
            <div className="mt-4">
              <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-zinc-500 mb-2">Apps Script Code</div>
              <pre className={`p-3 rounded-[12px] border-[1.5px] ${glossyCard} mono text-[11px] overflow-auto max-h-[200px]`}>{`function doPost(e){
  const sheet = SpreadsheetApp.openById('1h9dlyn8bzdIr9sq_TGfrarMMZVvSPPZ49zhxAGYM-JE').getSheets()[0];
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([data.title, data.url, data.label, data.tag, new Date()]);
  return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
}
function doGet(){
  const sheet = SpreadsheetApp.openById('1h9dlyn8bzdIr9sq_TGfrarMMZVvSPPZ49zhxAGYM-JE').getSheets()[0];
  const rows = sheet.getDataRange().getValues();
  return ContentService.createTextOutput(JSON.stringify(rows)).setMimeType(ContentService.MimeType.JSON);
}`}</pre>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={()=>{showToast('Pushed to Sheet (demo)'); setShowSheet(false);}} className="flex-1 h-11 rounded-[12px] bg-emerald-600 text-white font-bold border-[1.5px] border-emerald-800 text-[13px]">Push All ↗</button>
              <button onClick={()=>{showToast('Pulled from Sheet (demo)'); setShowSheet(false);}} className={`flex-1 h-11 rounded-[12px] font-bold border-[1.5px] ${glossyCard} text-[13px]`}>Pull ↓</button>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={()=>{const blob=new Blob([JSON.stringify(links,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='links.json'; a.click();}} className={`flex-1 h-10 rounded-[10px] text-[12px] font-bold border-[1.5px] ${glossyCard}`}>Export JSON</button>
              <button onClick={()=>setShowSheet(false)} className={`flex-1 h-10 rounded-[10px] text-[12px] font-bold border-[1.5px] ${glossyCard}`}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Command palette */}
      {showCmd && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[20vh]">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={()=>setShowCmd(false)} />
          <div className={`relative w-[90%] max-w-[520px] rounded-[16px] border-[1.5px] ${glossyCard} shadow-[0_16px_48px_rgba(0,0,0,0.2)] overflow-hidden glossy-before`}>
            <div className="flex items-center gap-3 px-4 h-12 border-b border-zinc-100 dark:border-white/10">
              <span>⌕</span><input autoFocus placeholder="Type command..." className="flex-1 bg-transparent outline-none text-[14px]" />
            </div>
            <div className="p-2 space-y-1 max-h-[300px] overflow-auto">
              {[
                {k:'N', d:'New link', a:()=>{setShowCmd(false); setShowForm(true);}},
                {k:'/', d:'Search', a:()=>{setShowCmd(false); searchRef.current?.focus();}},
                {k:'G', d:'Grid view', a:()=>{setView('grid'); setShowCmd(false);}},
                {k:'L', d:'List view', a:()=>{setView('list'); setShowCmd(false);}},
                {k:'?', d:'Toggle this', a:()=>{}},
              ].map(it=>(
                <button key={it.k} onClick={it.a} className="w-full text-left px-3 py-2.5 rounded-[10px] hover:bg-zinc-100 dark:hover:bg-white/5 flex items-center justify-between">
                  <span className="text-[13px] font-medium">{it.d}</span><span className="mono text-[11px] px-1.5 py-0.5 rounded bg-zinc-100 border dark:bg-zinc-800">{it.k}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] px-5 h-11 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[13px] font-bold border-[1.5px] border-zinc-700 dark:border-zinc-200 shadow-[0_8px_24px_rgba(0,0,0,0.2)] flex items-center gap-2 glossy-before" style={{ bottom:'calc(24px + env(safe-area-inset-bottom,0px))' }}>
          <span>{toast}</span>
        </div>
      )}

      <div className="h-4" />
    </div>
  );
}
