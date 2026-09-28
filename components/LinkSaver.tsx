// WIRED TO YOUR SHEET: https://docs.google.com/spreadsheets/d/1h9dlyn8bzdIr9sq_TGfrarMMZVvSPPZ49zhxAGYM-JE/edit
// Sheet ID: 1h9dlyn8bzdIr9sq_TGfrarMMZVvSPPZ49zhxAGYM-JE
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  Search, Plus, Command, Heart, Star, LayoutGrid, LayoutPanelLeft,
  Globe, Gamepad2, Wrench, Play, Palette, Sparkles, Newspaper, 
  FileText, Briefcase, Tag, BookOpen, Layers, X, Trash2, 
  ExternalLink, Copy, Download, Upload, Filter, Zap, Check, 
  AlertCircle, Settings, Moon, Sun, Monitor, Link as LinkIcon,
  Bookmark, MoreHorizontal, Edit3, CheckCircle2, Cloud, CloudOff,
  ArrowUpRight, Wand2, Magnet
} from 'lucide-react';
import { DEFAULT_SHEET_ID } from '@/lib/sheets';

// Types
type TagType = 'blog' | 'webpage' | 'game' | 'tool' | 'video' | 'design' | 'inspiration' | 'news' | 'docs' | 'article' | 'portfolio' | 'other';
interface LinkItem {
  id: string;
  title: string;
  url: string;
  label: string;
  tag: TagType;
  customTag?: string;
  collection: string;
  favorite: boolean;
  createdAt: number;
  updatedAt: number;
  favicon?: string;
}
type ViewMode = 'grid' | 'wall';
type Theme = 'light' | 'dark' | 'system';
interface GSheetConfig {
  webAppUrl: string;
  sheetId: string;
  connected: boolean;
}
interface Toast { id: string; message: string; type: 'success' | 'error' | 'info'; }

const TAG_META: Record<TagType, { label: string; color: string; bg: string; dot: string; icon: any }> = {
  blog: { label: 'Blog', color: 'text-violet-600', bg: 'bg-violet-500/10 border-violet-500/20', dot: 'bg-violet-500', icon: BookOpen },
  webpage: { label: 'Webpage', color: 'text-slate-600', bg: 'bg-slate-500/10 border-slate-500/20', dot: 'bg-slate-500', icon: Globe },
  game: { label: 'Game', color: 'text-emerald-600', bg: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-500', icon: Gamepad2 },
  tool: { label: 'Tool', color: 'text-blue-600', bg: 'bg-blue-500/10 border-blue-500/20', dot: 'bg-blue-500', icon: Wrench },
  video: { label: 'Video', color: 'text-red-600', bg: 'bg-red-500/10 border-red-500/20', dot: 'bg-red-500', icon: Play },
  design: { label: 'Design', color: 'text-pink-600', bg: 'bg-pink-500/10 border-pink-500/20', dot: 'bg-pink-500', icon: Palette },
  inspiration: { label: 'Inspiration', color: 'text-amber-600', bg: 'bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-500', icon: Sparkles },
  news: { label: 'News', color: 'text-orange-600', bg: 'bg-orange-500/10 border-orange-500/20', dot: 'bg-orange-500', icon: Newspaper },
  docs: { label: 'Docs', color: 'text-cyan-600', bg: 'bg-cyan-500/10 border-cyan-500/20', dot: 'bg-cyan-500', icon: FileText },
  article: { label: 'Article', color: 'text-indigo-600', bg: 'bg-indigo-500/10 border-indigo-500/20', dot: 'bg-indigo-500', icon: FileText },
  portfolio: { label: 'Portfolio', color: 'text-fuchsia-600', bg: 'bg-fuchsia-500/10 border-fuchsia-500/20', dot: 'bg-fuchsia-500', icon: Briefcase },
  other: { label: 'Other', color: 'text-zinc-600', bg: 'bg-zinc-500/10 border-zinc-500/20', dot: 'bg-zinc-500', icon: Tag },
};

const SEED_LINKS: LinkItem[] = [
  { id: '1', title: 'Linear — Issue Tracking for High Performance Teams', url: 'https://linear.app', label: 'Product obsession', tag: 'tool', collection: 'Work', favorite: true, createdAt: Date.now()-1000*60*12, updatedAt: Date.now()-1000*60*12, favicon: '' },
  { id: '2', title: 'Figma – How we built our design system at scale', url: 'https://www.figma.com/blog/design-system', label: 'Case study', tag: 'design', collection: 'Design', favorite: true, createdAt: Date.now()-1000*60*60*3, updatedAt: Date.now()-1000*60*60*3, favicon: '' },
  { id: '3', title: 'The Art of Code - Dylan Beattie', url: 'https://www.youtube.com/watch?v=6avJHaC3C2U', label: 'Must watch', tag: 'video', collection: 'Learning', favorite: false, createdAt: Date.now()-1000*60*60*24, updatedAt: Date.now()-1000*60*60*24, favicon: '' },
  { id: '4', title: 'Vercel Ship - Frontend Cloud keynote', url: 'https://vercel.com/blog', label: 'Inspo', tag: 'blog', collection: 'Inspiration', favorite: false, createdAt: Date.now()-1000*60*2, updatedAt: Date.now()-1000*60*2, favicon: '' },
  { id: '5', title: 'GitHub - shadcn/ui components', url: 'https://github.com/shadcn-ui/ui', label: 'UI Library', tag: 'tool', collection: 'Code', favorite: true, createdAt: Date.now()-1000*60*60*5, updatedAt: Date.now()-1000*60*60*5, favicon: '' },
  { id: '6', title: 'Reflections on 10 years of building products', url: 'https://medium.com/@danabramov', label: 'Long read', tag: 'article', collection: 'Reading', favorite: false, createdAt: Date.now()-1000*60*60*48, updatedAt: Date.now()-1000*60*60*48, favicon: '' },
];

function relativeTime(ts: number){
  const diff = Date.now() - ts;
  const s = Math.floor(diff/1000);
  if(s < 5) return 'Just now';
  if(s < 60) return `${s}s ago`;
  const m = Math.floor(s/60);
  if(m < 60) return `${m}m ago`;
  const h = Math.floor(m/60);
  if(h < 24) return `${h}h ago`;
  const d = Math.floor(h/24);
  if(d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}

function aiSuggest(url: string): TagType[] {
  const u = url.toLowerCase();
  const out = new Set<TagType>();
  if(u.includes('github.com')||u.includes('gitlab')||u.includes('npmjs')||u.includes('vercel.com')||u.includes('supabase')||u.includes('tool')||u.includes('raycast')||u.includes('linear')) out.add('tool');
  if(u.includes('figma.com')||u.includes('dribbble')||u.includes('behance')||u.includes('framer')||u.includes('awwwards')||u.includes('mobbin')) out.add('design');
  if(u.includes('youtube.com')||u.includes('youtu.be')||u.includes('vimeo.com')||u.includes('loom.com')||u.includes('twitch')) out.add('video');
  if(u.includes('medium.com')||u.includes('substack.com')||u.includes('hashnode')||u.includes('dev.to')||u.includes('/blog')) out.add('blog');
  if(u.includes('nytimes')||u.includes('techcrunch')||u.includes('theverge')||u.includes('wired')) out.add('news');
  if(u.includes('notion')||u.includes('docs.')||u.includes('documentation')) out.add('docs');
  if(u.includes('portfolio')||u.includes('read.cv')||u.includes('.design')) out.add('portfolio');
  if(u.includes('itch.io')||u.includes('game')||u.includes('steam')) out.add('game');
  if(out.size===0) out.add('webpage');
  return Array.from(out).slice(0,3) as TagType[];
}

export default function App(){
  // Core data
  const [links, setLinks] = useState<LinkItem[]>(()=>{
    try{
      const raw = localStorage.getItem('link-saver-final-links');
      if(raw){ const parsed = JSON.parse(raw); if(Array.isArray(parsed)&&parsed.length>0) return parsed; }
    }catch{}
    return SEED_LINKS;
  });
  const [customTags, setCustomTags] = useState<string[]>(()=>{
    try{ const r=localStorage.getItem('link-saver-custom-tags'); return r?JSON.parse(r):[] }catch{return []}
  });
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<TagType|'all'>('all');
  const [activeCollection, setActiveCollection] = useState<string>('all');
  const [favOnly, setFavOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [theme, setTheme] = useState<Theme>(()=>{
    try{ return (localStorage.getItem('link-saver-theme') as Theme) || 'system'; }catch{ return 'system'; }
  });
  const [actualTheme, setActualTheme] = useState<'light'|'dark'>('light');
  
  // Form
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<LinkItem|null>(null);
  const [form, setForm] = useState({ title:'', url:'', label:'', tag:'other' as TagType, collection:'General', favorite:false, customTagInput:'' });
  const [formError, setFormError] = useState<string>('');
  const [shake, setShake] = useState(false);
  const [nowTick, setNowTick] = useState(Date.now());
  const [aiSuggestions, setAiSuggestions] = useState<TagType[]>([]);
  
  // GSheets
  const [gsheet, setGsheet] = useState<GSheetConfig>(()=>{
    const defaultSheet = process.env.NEXT_PUBLIC_SHEET_ID || DEFAULT_SHEET_ID;
    const defaultUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || '';
    try{
      const r = localStorage.getItem('link-saver-gsheet');
      if (r) {
        const parsed = JSON.parse(r);
        return {
          webAppUrl: parsed.webAppUrl || defaultUrl,
          sheetId: parsed.sheetId || defaultSheet,
          connected: parsed.connected || !!(parsed.webAppUrl || defaultUrl)
        };
      }
    }catch{}
    return { webAppUrl: defaultUrl, sheetId: defaultSheet, connected: !!defaultUrl };
  });
  const [gsheetOpen, setGsheetOpen] = useState(false);
  const [gsheetStatus, setGsheetStatus] = useState<'idle'|'syncing'|'success'|'error'>('idle');
  
  // UI
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [confetti, setConfetti] = useState<{x:number,y:number,color:string,rot:number}[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const magneticRef = useRef<HTMLButtonElement>(null);
  const [magPos, setMagPos] = useState({x:0,y:0});

  // Theme resolve
  useEffect(()=>{
    const m = window.matchMedia('(prefers-color-scheme: dark)');
    const resolve = ()=> setActualTheme(theme==='system' ? (m.matches?'dark':'light') : theme as any);
    resolve();
    m.addEventListener('change', resolve);
    return ()=> m.removeEventListener('change', resolve);
  },[theme]);

  useEffect(()=>{ try{ localStorage.setItem('link-saver-theme', theme);}catch{} },[theme]);
  useEffect(()=>{ try{ localStorage.setItem('link-saver-final-links', JSON.stringify(links)); }catch{} },[links]);
  useEffect(()=>{ try{ localStorage.setItem('link-saver-custom-tags', JSON.stringify(customTags)); }catch{} },[customTags]);
  useEffect(()=>{ try{ localStorage.setItem('link-saver-gsheet', JSON.stringify(gsheet)); }catch{} },[gsheet]);

  // ticking clock
  useEffect(()=>{
    const id = setInterval(()=> setNowTick(Date.now()), 1000);
    return ()=> clearInterval(id);
  },[]);

  // AI suggest on url change
  useEffect(()=>{
    if(form.url.length>4){
      const sugg = aiSuggest(form.url);
      setAiSuggestions(sugg);
    }else setAiSuggestions([]);
  },[form.url]);

  // magnetic
  useEffect(()=>{
    const handler = (e: MouseEvent)=>{
      if(!magneticRef.current || !formOpen) return;
      const rect = magneticRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width/2;
      const cy = rect.top + rect.height/2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx*dx+dy*dy);
      if(dist < 200){
        setMagPos({ x: dx*0.18, y: dy*0.18 });
      }else setMagPos({x:0,y:0});
    };
    window.addEventListener('mousemove', handler);
    return ()=> window.removeEventListener('mousemove', handler);
  },[formOpen]);

  // keyboard shortcuts
  useEffect(()=>{
    const onKey = (e: KeyboardEvent)=>{
      if((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); setCmdOpen(o=>!o); return; }
      if(e.key==='?' && !cmdOpen && !formOpen){ setShowHelp(o=>!o); return; }
      if(e.key==='Escape'){ setCmdOpen(false); setFormOpen(false); setGsheetOpen(false); setShowHelp(false); return; }
      if(e.key.toLowerCase()==='n' && !formOpen && !cmdOpen && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)){ e.preventDefault(); openNew(); return; }
      if(e.key==='/' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)){ e.preventDefault(); searchRef.current?.focus(); return; }
    };
    window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  },[formOpen, cmdOpen]);

  const collections = useMemo(()=>{
    const set = new Set(links.map(l=>l.collection).filter(Boolean));
    return Array.from(set);
  },[links]);

  const filtered = useMemo(()=>{
    return links.filter(l=>{
      if(favOnly && !l.favorite) return false;
      if(activeTag!=='all' && l.tag!==activeTag) return false;
      if(activeCollection!=='all' && l.collection!==activeCollection) return false;
      if(search){
        const q = search.toLowerCase();
        return l.title.toLowerCase().includes(q) || l.url.toLowerCase().includes(q) || l.label.toLowerCase().includes(q) || l.collection.toLowerCase().includes(q) || l.tag.toLowerCase().includes(q);
      }
      return true;
    }).sort((a,b)=> b.updatedAt - a.updatedAt);
  },[links, search, activeTag, activeCollection, favOnly]);

  const addToast = useCallback((message:string, type:Toast['type']='success')=>{
    const id = Math.random().toString(36).slice(2);
    setToasts(t=>[...t,{id,message,type}]);
    setTimeout(()=> setToasts(t=> t.filter(x=>x.id!==id)), 3000);
  },[]);

  const triggerConfetti = ()=>{
    const colors = ['#8b5cf6','#ec4899','#06b6d4','#f59e0b','#10b981'];
    const pieces = Array.from({length:24},(_,i)=>({ x: 40 + Math.random()*20, y: -10, color: colors[i%colors.length], rot: Math.random()*360 }));
    setConfetti(pieces);
    setTimeout(()=> setConfetti([]), 1200);
  };

  const openNew = ()=>{
    setEditing(null);
    setForm({ title:'', url:'', label:'', tag:'other', collection:'General', favorite:false, customTagInput:'' });
    setFormError(''); setFormOpen(true);
  };
  const openEdit = (link:LinkItem)=>{
    setEditing(link);
    setForm({ title:link.title, url:link.url, label:link.label, tag:link.tag, collection:link.collection, favorite:link.favorite, customTagInput:link.customTag||'' });
    setFormOpen(true);
  };

  const validate = ()=>{
    if(!form.title.trim()) return 'Title is required';
    if(!form.url.trim()) return 'URL is required';
    try{ new URL(form.url); }catch{ return 'Enter a valid URL (https://...)' }
    return '';
  };

  const saveLink = async ()=>{
    const err = validate();
    if(err){ setFormError(err); setShake(true); setTimeout(()=>setShake(false),400); return; }
    setFormError('');
    const favicon = '';
    if(editing){
      const updated: LinkItem = { ...editing, title:form.title.trim(), url:form.url.trim(), label:form.label.trim(), tag:form.tag, customTag:form.customTagInput.trim()||undefined, collection:form.collection.trim()||'General', favorite:form.favorite, updatedAt:Date.now(), favicon };
      setLinks(prev=> prev.map(l=> l.id===editing.id?updated:l));
      addToast('Link updated');
      if(gsheet.connected) syncSingle(updated,'edit');
    }else{
      const newLink: LinkItem = { id: Math.random().toString(36).slice(2,10), title:form.title.trim(), url:form.url.trim(), label:form.label.trim(), tag:form.tag, customTag:form.customTagInput.trim()||undefined, collection:form.collection.trim()||'General', favorite:form.favorite, createdAt:Date.now(), updatedAt:Date.now(), favicon };
      setLinks(prev=> [newLink, ...prev]);
      addToast('Link saved — nice!');
      triggerConfetti();
      if(gsheet.connected) syncSingle(newLink,'add');
    }
    if(form.customTagInput && !customTags.includes(form.customTagInput) && !Object.keys(TAG_META).includes(form.customTagInput)){
      setCustomTags(p=> [...p, form.customTagInput.trim()]);
    }
    setFormOpen(false);
  };

  const deleteLink = (id:string)=>{
    setLinks(p=> p.filter(l=>l.id!==id));
    setSelected(s=>{ const n=new Set(s); n.delete(id); return n; });
    addToast('Link deleted','info');
    if(gsheet.connected){
      const item = links.find(l=>l.id===id);
      if(item) syncSingle(item,'delete');
    }
  };

  const toggleFav = (id:string)=>{
    setLinks(p=> p.map(l=> l.id===id?{...l,favorite:!l.favorite, updatedAt:Date.now()}:l));
  };

  // GSheets sync
  const syncSingle = async (link:LinkItem, action:'add'|'edit'|'delete')=>{
    if(!gsheet.webAppUrl) return;
    setGsheetStatus('syncing');
    try{
      await fetch(gsheet.webAppUrl, { method:'POST', mode:'no-cors', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action, sheetId: gsheet.sheetId, data: link }) });
      setGsheetStatus('success'); addToast(`Synced to Sheets • ${action}`,'success'); setTimeout(()=>setGsheetStatus('idle'),2000);
    }catch{ setGsheetStatus('error'); addToast('Sheets sync failed','error'); }
  };
  const pushAll = async ()=>{
    if(!gsheet.webAppUrl){ addToast('Connect Sheets first','error'); setGsheetOpen(true); return; }
    setGsheetStatus('syncing');
    try{
      await fetch(gsheet.webAppUrl, { method:'POST', mode:'no-cors', body: JSON.stringify({ action:'pushAll', sheetId:gsheet.sheetId, data: links }) });
      setGsheetStatus('success'); addToast(`Pushed ${links.length} links to Sheets`,'success');
    }catch{ setGsheetStatus('error'); addToast('Push failed','error'); }
    setTimeout(()=>setGsheetStatus('idle'),2000);
  };
  const pullFromSheets = async ()=>{
    if(!gsheet.webAppUrl){ addToast('Connect Sheets first','error'); return; }
    setGsheetStatus('syncing');
    try{
      const res = await fetch(`${gsheet.webAppUrl}?sheetId=${gsheet.sheetId}&action=pull`);
      const resData = await res.json();
      const rawList = Array.isArray(resData) ? resData : (resData && Array.isArray(resData.data) ? resData.data : []);
      if(rawList.length){ 
        const mapped: LinkItem[] = rawList.map((d:any,i:number)=>({
          id: d.id || `sheet-${i}`,
          title: d.title || d.Title || 'Untitled',
          url: d.url || d.URL || d.link || '',
          label: d.label || d.Label || d.collection || '',
          tag: (d.tag || (Array.isArray(d.tags) ? d.tags[0] : (d.tags ? String(d.tags).split(',')[0] : 'other'))) as TagType,
          collection: d.collection || d.Label || 'General',
          favorite: d.favorite === true || d.favorite === 'TRUE' || d.favorite === 'true',
          createdAt: d.createdAt ? (isNaN(Number(d.createdAt)) ? new Date(d.createdAt).getTime() : Number(d.createdAt)) : Date.now(),
          updatedAt: Date.now(),
          favicon: d.favicon || d.faviconUrl || ''
        })).filter((l:LinkItem)=>!!l.url);
        if(mapped.length){ setLinks(mapped); addToast(`Pulled ${mapped.length} links`,'success'); }
        else addToast('No valid links found in Sheet','info');
      } else addToast('Sheet is empty or no data found','info');
      setGsheetStatus('success');
    }catch{ setGsheetStatus('error'); addToast('Pull failed — check Apps Script','error'); }
    setTimeout(()=>setGsheetStatus('idle'),2000);
  };

  // Import/Export
  const exportJSON = ()=>{
    const blob = new Blob([JSON.stringify(links,null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download=`link-saver-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url);
    addToast('Exported JSON');
  };
  const exportCSV = ()=>{
    const headers = ['id','title','url','label','tag','collection','favorite','createdAt'];
    const rows = links.map(l=> [l.id, `"${l.title.replace(/"/g,'""')}"`, l.url, `"${l.label.replace(/"/g,'""')}"`, l.tag, l.collection, l.favorite, new Date(l.createdAt).toISOString()].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv],{type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download=`link-saver-${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
    addToast('Exported CSV');
  };
  const importFile = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      try{
        const text = reader.result as string;
        let imported: LinkItem[] = [];
        if(file.name.endsWith('.json')){
          const json = JSON.parse(text);
          imported = Array.isArray(json)?json:json.links||[];
        }else{
          // csv simple parse
          const lines = text.split('\n').slice(1);
          imported = lines.filter(Boolean).map((line,i)=>{
            const parts = line.split(',');
            return { id:`csv-${Date.now()}-${i}`, title: parts[1]?.replace(/^"|"$/g,'')||'Imported', url: parts[2]||'', label: parts[3]?.replace(/^"|"$/g,'')||'', tag:(parts[4] as TagType)||'other', collection: parts[5]||'Imported', favorite: parts[6]==='true', createdAt: Date.now(), updatedAt: Date.now(), favicon: '' } as LinkItem;
          }).filter(l=>l.url);
        }
        if(imported.length){ setLinks(prev=> [...imported, ...prev]); addToast(`Imported ${imported.length} links`); }
      }catch{ addToast('Import failed — invalid file','error'); }
    };
    reader.readAsText(file);
    e.target.value='';
  };

  // Command palette actions
  const commands = [
    { id:'new', label:'Add new link', icon:Plus, action:()=>{ setCmdOpen(false); openNew(); } },
    { id:'search', label:'Focus search', icon:Search, action:()=>{ setCmdOpen(false); searchRef.current?.focus(); } },
    { id:'toggleTheme', label:`Toggle theme (${actualTheme})`, icon: actualTheme==='dark'?Sun:Moon, action:()=>{ setTheme(t=> t==='dark'?'light': t==='light'?'dark':'light'); setCmdOpen(false);} },
    { id:'viewGrid', label:'Switch to Grid view', icon:LayoutGrid, action:()=>{ setViewMode('grid'); setCmdOpen(false);} },
    { id:'viewWall', label:'Switch to Wall view', icon:LayoutPanelLeft, action:()=>{ setViewMode('wall'); setCmdOpen(false);} },
    { id:'push', label:'Push all to Google Sheets', icon:Cloud, action:()=>{ setCmdOpen(false); pushAll(); } },
    { id:'pull', label:'Pull from Google Sheets', icon:Download, action:()=>{ setCmdOpen(false); pullFromSheets(); } },
    { id:'clear', label:'Clear filters', icon:X, action:()=>{ setActiveTag('all'); setActiveCollection('all'); setFavOnly(false); setSearch(''); setCmdOpen(false);} },
    { id:'exportJson', label:'Export JSON', icon:Download, action:()=>{ setCmdOpen(false); exportJSON(); } },
    ...filtered.slice(0,5).map(l=>({ id:`open-${l.id}`, label:`Open: ${l.title}`, icon:ExternalLink, action:()=>{ window.open(l.url,'_blank'); setCmdOpen(false);} })),
  ];
  const filteredCommands = commands.filter(c=> !cmdQuery || c.label.toLowerCase().includes(cmdQuery.toLowerCase()));

  return (
    <div className={`min-h-screen w-full font-[Inter,system-ui] antialiased selection:bg-violet-500/30 overflow-x-hidden ${actualTheme==='dark'?'dark bg-[#08080a] text-zinc-100':'bg-[#fcfcf9] text-zinc-900'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap');
        *{font-family:Inter,system-ui}
        .serif{font-family:"Instrument Serif",serif}
        .aurora{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;max-width:100vw}
        .aurora div{position:absolute;border-radius:50%;filter:blur(80px);opacity:0.6;mix-blend:screen;animation:float 18s ease-in-out infinite;max-width:90vw}
        @keyframes float{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,-40px) scale(1.1)}}
        .noise{position:fixed;inset:0;pointer-events:none;z-index:1;opacity:${actualTheme==='dark'?0.04:0.02};background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
        .glass{backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px)}
        .bento{transition:all 0.35s cubic-bezier(0.16,1,0.3,1);transform-style:preserve-3d}
        .bento:hover{transform:translateY(-4px) rotateX(2deg) rotateY(-2deg);box-shadow:0 20px 40px -12px rgba(0,0,0,0.15),0 0 0 1px rgba(0,0,0,0.05)}
        .dark .bento:hover{box-shadow:0 20px 40px -12px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.08)}
        .shake{animation:shake 0.4s cubic-bezier(.36,.07,.19,.97) both}
        @keyframes shake{10%,90%{transform:translate3d(-1px,0,0)}20%,80%{transform:translate3d(2px,0,0)}30%,50%,70%{transform:translate3d(-4px,0,0)}40%,60%{transform:translate3d(4px,0,0)}}
        .confetti{position:fixed;width:10px;height:10px;top:0;pointer-events:none;z-index:9999;animation:confettiFall 1.1s cubic-bezier(0.16,1,0.3,1) forwards}
        @keyframes confettiFall{0%{transform:translateY(-20px) rotate(0) translateX(0)}100%{transform:translateY(100vh) rotate(720deg) translateX(60px);opacity:0}}
        .scrollbar-none::-webkit-scrollbar{display:none}
        .scrollbar-none{-ms-overflow-style:none;scrollbar-width:none}
      `}</style>

      {/* Aurora */}
      <div className="aurora">
        <div className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-gradient-to-br from-violet-400 via-fuchsia-300 to-indigo-400 -top-32 -left-32 md:-top-64 md:-left-64" style={{animationDelay:'0s'}}/>
        <div className="w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-gradient-to-br from-cyan-300 via-blue-300 to-violet-300 top-1/3 -right-20 md:-right-64" style={{animationDelay:'-6s'}}/>
        <div className="w-[350px] h-[350px] md:w-[500px] md:h-[500px] bg-gradient-to-br from-amber-200 via-orange-200 to-pink-300 bottom-0 left-1/3" style={{animationDelay:'-12s', opacity: actualTheme==='dark'?0.25:0.35}}/>
      </div>
      <div className="noise"/>

      {/* Header */}
      <header className={`sticky top-0 z-40 border-b ${actualTheme==='dark'?'bg-zinc-900/70 border-white/[0.06]':'bg-white/70 border-black/[0.06]'} glass`} style={{top:'var(--safe-area-inset-top,0px)'}}>
        <div className="mx-auto max-w-[1440px] px-4 md:px-6 h-[64px] flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black grid place-items-center font-bold text-[13px] tracking-tight">LS</div>
            <span className="serif text-[20px] leading-none tracking-tight hidden sm:block">Link Saver</span>
            <span className="hidden md:flex items-center gap-2 ml-2 text-[11px] font-medium px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-300 border border-violet-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"/> FINAL
            </span>
          </div>

          <div className="flex-1 max-w-[520px] mx-3 md:mx-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40"/>
            <input ref={searchRef} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search titles, tags, collections…  ( / )" className={`w-full h-10 pl-9 pr-3 rounded-full border text-[13.5px] outline-none transition-all ${actualTheme==='dark'?'bg-white/[0.06] border-white/[0.08] placeholder:text-white/40 focus:bg-white/[0.08] focus:border-white/15':'bg-black/[0.04] border-black/[0.06] placeholder:text-black/40 focus:bg-black/[0.06] focus:border-black/10'}`}/>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="hidden md:flex items-center rounded-full border p-1 gap-1 glass bg-white/40 dark:bg-white/[0.06] border-black/5 dark:border-white/10">
              <button aria-label="Grid view" onClick={()=>{setViewMode('grid'); addToast('Grid view');}} className={`w-8 h-7 rounded-full grid place-items-center transition ${viewMode==='grid'?'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-sm':'opacity-60 hover:opacity-100'}`}><LayoutGrid className="w-4 h-4"/></button>
              <button aria-label="Wall view" onClick={()=>{setViewMode('wall'); addToast('Wall view');}} className={`w-8 h-7 rounded-full grid place-items-center transition ${viewMode==='wall'?'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-sm':'opacity-60 hover:opacity-100'}`}><Layers className="w-4 h-4"/></button>
            </div>

            <button aria-label="Toggle theme" onClick={()=>{ const next = theme==='dark'?'light': theme==='light'?'dark':'light'; setTheme(next as any); addToast(`Theme: ${next}`); }} className={`w-9 h-9 rounded-full grid place-items-center border transition ${actualTheme==='dark'?'bg-white/[0.06] border-white/10 hover:bg-white/10':'bg-black/[0.04] border-black/5 hover:bg-black/10'}`} title="Toggle theme">
              {actualTheme==='dark'?<Sun className="w-4 h-4"/>:<Moon className="w-4 h-4"/>}
            </button>

            <button aria-label="Sheets sync" onClick={()=>setGsheetOpen(true)} className={`relative w-9 h-9 rounded-full grid place-items-center border transition ${gsheet.connected?'bg-emerald-500/10 border-emerald-500/20 text-emerald-600':'bg-black/[0.04] dark:bg-white/[0.06] border-black/5 dark:border-white/10 opacity-70 hover:opacity-100'}`} title="Sheets sync">
              {gsheet.connected? <Cloud className="w-4 h-4"/> : <CloudOff className="w-4 h-4"/>}
              {gsheet.connected && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900 animate-pulse"/>}
              {gsheetStatus==='syncing' && <span className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-ping"/>}
            </button>

            <button onClick={openNew} className="h-9 px-4 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black text-[13px] font-medium flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-transform">
              <Plus className="w-4 h-4"/> <span className="hidden sm:inline">New link</span><span className="sm:hidden">New</span>
              <span className="hidden md:inline ml-1 text-[10px] opacity-60 border border-white/20 dark:border-black/20 rounded px-1 py-0.5">N</span>
            </button>

            <button aria-label="Open command palette" onClick={()=>setCmdOpen(true)} className={`hidden md:grid w-9 h-9 rounded-full place-items-center border ${actualTheme==='dark'?'bg-white/[0.06] border-white/10':'bg-black/[0.04] border-black/5'}`}><Command className="w-4 h-4 opacity-70"/></button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 md:px-6 py-6 md:py-8 relative z-10 flex gap-6 min-w-0">
        {/* Sidebar */}
        <aside className="hidden lg:block w-[260px] shrink-0 sticky top-[88px] h-fit">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] font-semibold tracking-widest uppercase opacity-60">Collections</h3>
                <span className="text-[11px] opacity-40">{collections.length}</span>
              </div>
              <div className="space-y-1">
                <button onClick={()=>setActiveCollection('all')} className={`w-full text-left px-3 py-2 rounded-xl text-[13.5px] flex items-center justify-between transition ${activeCollection==='all'?'bg-zinc-900 text-white dark:bg-white dark:text-black font-medium shadow-sm':'hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'}`}>
                  <span className="flex items-center gap-2"><Bookmark className="w-4 h-4"/> All links</span><span className="text-[11px] opacity-60">{links.length}</span>
                </button>
                {collections.map(c=>{
                  const count = links.filter(l=>l.collection===c).length;
                  return <button key={c} onClick={()=>setActiveCollection(c)} className={`w-full text-left px-3 py-2 rounded-xl text-[13.5px] flex items-center justify-between transition ${activeCollection===c?'bg-zinc-900 text-white dark:bg-white dark:text-black font-medium shadow-sm':'hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'}`}>
                    <span className="truncate">{c}</span><span className="text-[11px] opacity-60">{count}</span>
                  </button>
                })}
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-semibold tracking-widest uppercase opacity-60 mb-3">Filters</h3>
              <button onClick={()=>setFavOnly(!favOnly)} className={`w-full px-3 py-2 rounded-xl text-[13.5px] flex items-center gap-2 border transition ${favOnly?'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300':'border-black/5 dark:border-white/10 hover:bg-black/[0.03] dark:hover:bg-white/[0.05]'}`}>
                <Star className={`w-4 h-4 ${favOnly?'fill-amber-500 text-amber-500':''}`}/> Favorites
              </button>

              <div className="mt-4 flex flex-wrap gap-1.5">
                <button onClick={()=>setActiveTag('all')} className={`px-2.5 py-1 rounded-full text-[12px] border transition ${activeTag==='all'?'bg-zinc-900 text-white dark:bg-white dark:text-black border-zinc-900 dark:border-white':'bg-white/60 dark:bg-white/[0.06] border-black/5 dark:border-white/10 hover:bg-white dark:hover:bg-white/10'}`}>All</button>
                {Object.entries(TAG_META).map(([key, meta])=>{
                  const Icon = meta.icon;
                  return <button key={key} onClick={()=>setActiveTag(key as TagType)} className={`px-2.5 py-1 rounded-full text-[12px] border flex items-center gap-1 transition ${activeTag===key?'bg-zinc-900 text-white dark:bg-white dark:text-black border-zinc-900':'border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/[0.06] hover:bg-white dark:hover:bg-white/10'}`}>
                    <Icon className="w-3 h-3"/>{meta.label}
                  </button>
                })}
                {customTags.map(t=> <button key={t} onClick={()=>{/* custom filter */ setSearch(t)}} className="px-2.5 py-1 rounded-full text-[12px] border bg-violet-500/10 border-violet-500/20 text-violet-600 dark:text-violet-300 flex items-center gap-1"><Tag className="w-3 h-3"/>{t}</button>)}
              </div>
            </div>

            <div className={`rounded-[20px] border p-4 ${actualTheme==='dark'?'bg-white/[0.04] border-white/[0.06]':'bg-white/70 border-black/[0.06]'} glass`}>
              <div className="flex items-center gap-2 text-[12px] font-medium mb-2"><Zap className="w-4 h-4 text-violet-500"/> Shortcuts</div>
              <div className="space-y-1.5 text-[11.5px] opacity-70 leading-relaxed">
                <div className="flex justify-between"><span>New link</span><span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono">N</span></div>
                <div className="flex justify-between"><span>Search</span><span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono">/</span></div>
                <div className="flex justify-between"><span>Command</span><span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono">⌘K</span></div>
                <div className="flex justify-between"><span>Help</span><span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono">?</span></div>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={exportJSON} className="flex-1 h-9 rounded-full border bg-white/60 dark:bg-white/[0.06] border-black/5 dark:border-white/10 text-[12px] font-medium flex items-center justify-center gap-1.5"><Download className="w-3.5 h-3.5"/> JSON</button>
              <button onClick={exportCSV} className="flex-1 h-9 rounded-full border bg-white/60 dark:bg-white/[0.06] border-black/5 dark:border-white/10 text-[12px] font-medium flex items-center justify-center gap-1.5"><Download className="w-3.5 h-3.5"/> CSV</button>
              <label className="flex-1 h-9 rounded-full border bg-white/60 dark:bg-white/[0.06] border-black/5 dark:border-white/10 text-[12px] font-medium flex items-center justify-center gap-1.5 cursor-pointer"><Upload className="w-3.5 h-3.5"/> Import<input type="file" accept=".json,.csv" className="hidden" onChange={importFile}/></label>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Mobile filters */}
          <div className="lg:hidden flex gap-2 overflow-auto scrollbar-none pb-3 -mx-1 px-1">
            <button onClick={()=>setActiveCollection('all')} className={`shrink-0 px-3 py-1.5 rounded-full text-[12px] border ${activeCollection==='all'?'bg-zinc-900 text-white':'bg-white border-black/5'}`}>All {links.length}</button>
            {collections.map(c=> <button key={c} onClick={()=>setActiveCollection(c)} className={`shrink-0 px-3 py-1.5 rounded-full text-[12px] border ${activeCollection===c?'bg-zinc-900 text-white':'bg-white border-black/5'}`}>{c}</button>)}
            <button onClick={()=>setViewMode(viewMode==='grid'?'wall':'grid')} className="shrink-0 w-8 h-8 rounded-full bg-white border border-black/5 grid place-items-center">{viewMode==='grid'?<LayoutGrid className="w-4 h-4"/>:<Layers className="w-4 h-4"/>}</button>
          </div>

          {/* Active filter chips */}
          {(activeTag!=='all' || activeCollection!=='all' || favOnly || search) && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {search && <span className="px-3 py-1 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black text-[12px] flex items-center gap-1.5">“{search}” <button onClick={()=>setSearch('')}><X className="w-3 h-3"/></button></span>}
              {activeTag!=='all' && <span className="px-3 py-1 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black text-[12px] flex items-center gap-1.5 capitalize">{activeTag} <button onClick={()=>setActiveTag('all')}><X className="w-3 h-3"/></button></span>}
              {activeCollection!=='all' && <span className="px-3 py-1 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black text-[12px] flex items-center gap-1.5">{activeCollection} <button onClick={()=>setActiveCollection('all')}><X className="w-3 h-3"/></button></span>}
              {favOnly && <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-[12px] flex items-center gap-1.5">Favorites <button onClick={()=>setFavOnly(false)}><X className="w-3 h-3"/></button></span>}
              <button onClick={()=>{setActiveTag('all');setActiveCollection('all');setFavOnly(false);setSearch('');}} className="text-[12px] opacity-60 hover:opacity-100 underline">Clear all</button>
            </div>
          )}

          <div className="flex items-center justify-between mb-5">
            <h2 className="serif text-[28px] md:text-[32px] leading-none tracking-tight">{favOnly?'Favorites': activeCollection==='all'?'All links':activeCollection} <span className="font-sans text-[13px] opacity-50 ml-2 align-middle">{filtered.length}</span></h2>
            <div className="hidden md:flex items-center gap-2 text-[11px] opacity-60">
              <Filter className="w-3.5 h-3.5"/>{filtered.length} of {links.length}
            </div>
          </div>

          {/* Grid / Wall */}
          {filtered.length===0 ? (
            <div className={`rounded-[24px] border-2 border-dashed p-12 text-center ${actualTheme==='dark'?'border-white/10 bg-white/[0.02]':'border-black/10 bg-white/50'}`}>
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black grid place-items-center mx-auto mb-4"><Search className="w-5 h-5"/></div>
              <p className="serif text-[18px]">No links found</p>
              <p className="text-[13px] opacity-60 mt-1">Try adjusting search or filters</p>
              <button onClick={()=>{setSearch('');setActiveTag('all');setActiveCollection('all');setFavOnly(false);}} className="mt-4 h-9 px-4 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black text-[13px]">Clear filters</button>
            </div>
          ) : viewMode==='grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 min-w-0">
              {filtered.map(link=>{
                const meta = TAG_META[link.tag] || TAG_META.other;
                const Icon = meta.icon;
                const isSel = selected.has(link.id);
                const initials = link.title.slice(0,2).toUpperCase();
                const host = (()=>{ try{ return new URL(link.url).hostname.replace('www.',''); }catch{ return link.url.slice(0,16);} })();
                return (
                  <div key={link.id} className={`bento group relative rounded-[22px] border p-4 md:p-5 min-w-0 ${actualTheme==='dark'?'bg-white/[0.05] border-white/[0.08]':'bg-white/80 border-black/[0.06]'} ${isSel?'ring-2 ring-violet-500/50':''}`}>
                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button aria-label="Toggle favorite" onClick={()=>{toggleFav(link.id); addToast(link.favorite?'Removed favorite':'Added to favorites');}} className={`w-7 h-7 rounded-full grid place-items-center border backdrop-blur ${link.favorite?'bg-amber-500 border-amber-500 text-white':'bg-white/80 dark:bg-zinc-800 border-black/5 dark:border-white/10'}`}><Star className={`w-3.5 h-3.5 ${link.favorite?'fill-white':''}`}/></button>
                      <button aria-label="Edit link" onClick={()=>openEdit(link)} className="w-7 h-7 rounded-full grid place-items-center bg-white/80 dark:bg-zinc-800 border border-black/5 dark:border-white/10 backdrop-blur"><Edit3 className="w-3.5 h-3.5"/></button>
                      <button aria-label="Delete link" onClick={()=>deleteLink(link.id)} className="w-7 h-7 rounded-full grid place-items-center bg-white/80 dark:bg-zinc-800 border border-black/5 dark:border-white/10 backdrop-blur hover:bg-red-500 hover:text-white hover:border-red-500"><Trash2 className="w-3.5 h-3.5"/></button>
                    </div>

                    <div className="flex items-start gap-3 pr-6">
                      <div className={`w-10 h-10 rounded-xl border grid place-items-center shrink-0 overflow-hidden shadow-sm font-bold text-[11px] ${actualTheme==='dark'?'bg-zinc-800 border-white/10 text-white':'bg-white border-black/5 text-zinc-900'}`}>
                        <span className={`${meta.color}`}>{initials}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${meta.bg} ${meta.color}`}><span className={`w-1 h-1 rounded-full ${meta.dot}`}/>{meta.label}</span>
                          {link.customTag && <span className="px-2 py-0.5 rounded-full text-[10px] bg-violet-500/10 border border-violet-500/20 text-violet-600">{link.customTag}</span>}
                        </div>
                        <h3 className="font-medium text-[14.5px] leading-[1.25] line-clamp-2 tracking-tight">{link.title}</h3>
                        {link.label && <p className="text-[12px] opacity-60 mt-1 line-clamp-1">{link.label}</p>}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex-1 min-w-0 flex items-center gap-1.5 text-[11px] opacity-60 truncate">
                        <Globe className="w-3 h-3 shrink-0"/>{host}
                      </div>
                      <span className="text-[11px] opacity-50">{relativeTime(link.updatedAt)}</span>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <a href={link.url} target="_blank" rel="noopener" className="flex-1 h-8 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black text-[12px] font-medium flex items-center justify-center gap-1 hover:scale-[1.02] transition-transform">Open <ArrowUpRight className="w-3.5 h-3.5"/></a>
                      <button aria-label="Copy link" onClick={()=>{navigator.clipboard.writeText(link.url); addToast('Copied link');}} className="w-8 h-8 rounded-full border grid place-items-center bg-white/70 dark:bg-white/[0.06] border-black/5 dark:border-white/10 hover:bg-white"><Copy className="w-3.5 h-3.5"/></button>
                      <button aria-label="Select link" onClick={()=> setSelected(s=>{ const n=new Set(s); if(n.has(link.id)) n.delete(link.id); else n.add(link.id); return n; })} className={`w-8 h-8 rounded-full border grid place-items-center transition ${isSel?'bg-violet-500 border-violet-500 text-white':'bg-white/70 dark:bg-white/[0.06] border-black/5 dark:border-white/10'}`}><Check className="w-3.5 h-3.5"/></button>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px]">
                      <span className="px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.04] dark:border-white/[0.06]">{link.collection}</span>
                      <span className="opacity-40 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"/> {new Date(link.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[22px] border p-3 md:p-4 bg-white/60 dark:bg-white/[0.04] border-black/5 dark:border-white/10">
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 md:gap-3">
                {filtered.map(link=>{
                  const initials = link.title.slice(0,1).toUpperCase();
                  return (
                  <div key={link.id} className="group relative aspect-square">
                    <a href={link.url} target="_blank" className="w-full h-full rounded-[14px] bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 grid place-items-center shadow-sm hover:scale-[1.08] hover:shadow-lg transition-all duration-300 hover:z-10 relative">
                      <span className="font-bold text-[14px] md:text-[16px] opacity-80">{initials}</span>
                      {link.favorite && <Star className="absolute -top-1 -right-1 w-3 h-3 fill-amber-500 text-amber-500"/>}
                    </a>
                    <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+8px)] opacity-0 group-hover:opacity-100 transition bg-zinc-900 text-white dark:bg-white dark:text-black text-[11px] px-2.5 py-1.5 rounded-full whitespace-nowrap shadow-xl z-20">
                      {link.title.slice(0,32)}{link.title.length>32?'…':''} • {relativeTime(link.updatedAt)}
                    </div>
                  </div>
                )})}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Bulk floating glass pill */}
      {selected.size>0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)] max-w-[calc(100vw-24px)]">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-full border shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] glass ${actualTheme==='dark'?'bg-zinc-900/80 border-white/10':'bg-white/90 border-black/10'}`}>
            <span className="w-7 h-7 rounded-full bg-violet-500 text-white grid place-items-center text-[12px] font-bold">{selected.size}</span>
            <span className="text-[13px] font-medium pr-1 hidden sm:inline">selected</span>
            <div className="w-px h-5 bg-black/10 dark:bg-white/10"/>
            <button aria-label="Favorite selected" onClick={()=>{ const toFav = links.filter(l=>selected.has(l.id)); setLinks(p=> p.map(l=> selected.has(l.id)?{...l,favorite:true}:l)); addToast(`Favorited ${toFav.length}`); }} className="h-8 px-3 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-300 text-[12px] flex items-center gap-1"><Star className="w-3.5 h-3.5"/> Fav</button>
            <button aria-label="Export selected" onClick={()=>{ const sel = links.filter(l=>selected.has(l.id)); const blob=new Blob([JSON.stringify(sel,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='selected.json'; a.click(); URL.revokeObjectURL(url); }} className="h-8 px-3 rounded-full bg-black/5 dark:bg-white/10 text-[12px] flex items-center gap-1"><Download className="w-3.5 h-3.5"/> Export</button>
            <button aria-label="Delete selected" onClick={()=>{ selected.forEach(id=> deleteLink(id)); setSelected(new Set()); }} className="h-8 px-3 rounded-full bg-red-500 text-white text-[12px] flex items-center gap-1"><Trash2 className="w-3.5 h-3.5"/> Delete</button>
            <button aria-label="Clear selection" onClick={()=>setSelected(new Set())} className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 grid place-items-center"><X className="w-4 h-4"/></button>
          </div>
        </div>
      )}

      {/* Studio Form - Floating with live preview */}
      {formOpen && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[12px]" onClick={()=>setFormOpen(false)}/>
          <div className={`relative w-full md:max-w-[960px] md:rounded-[28px] rounded-t-[28px] border shadow-[0_40px_120px_-20px_rgba(0,0,0,0.4)] max-h-[92vh] md:max-h-[86vh] overflow-hidden flex flex-col md:flex-row ${shake?'shake':''} ${actualTheme==='dark'?'bg-[#101010] border-white/10':'bg-[#fcfcf9] border-black/10'} glass`} style={{backdropFilter:'blur(24px)'}}>
            {/* Left form */}
            <div className="flex-1 p-6 md:p-8 overflow-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="serif text-[22px] leading-none">{editing?'Edit link':'New link'}</h3>
                  <p className="text-[12px] opacity-60 mt-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/> Live • {new Date(nowTick).toLocaleTimeString()} • {new Date(nowTick).toLocaleDateString()}</p>
                </div>
                <button onClick={()=>setFormOpen(false)} className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 grid place-items-center"><X className="w-4 h-4"/></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-semibold tracking-widest uppercase opacity-60 mb-1.5 block">URL * — paste to auto-tag</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40"/>
                    <input value={form.url} onChange={e=>setForm({...form, url:e.target.value})} placeholder="https://example.com/article" className={`w-full h-11 pl-9 pr-3 rounded-xl border text-[14px] outline-none ${actualTheme==='dark'?'bg-white/[0.06] border-white/10 focus:border-violet-500/50':'bg-white border-black/10 focus:border-violet-500/50'} focus:ring-4 focus:ring-violet-500/10 transition`}/>
                  </div>
                  {aiSuggestions.length>0 && (
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] flex items-center gap-1 opacity-70"><Wand2 className="w-3 h-3 text-violet-500"/> AI suggests</span>
                      {aiSuggestions.map(s=>{
                        const m = TAG_META[s];
                        const Ic = m.icon;
                        return <button key={s} onClick={()=>setForm({...form, tag:s})} className={`px-2.5 py-1 rounded-full text-[11px] border flex items-center gap-1 transition ${form.tag===s?'bg-violet-500 text-white border-violet-500':'bg-violet-500/10 border-violet-500/20 text-violet-600'}`}><Ic className="w-3 h-3"/>{m.label}</button>
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-semibold tracking-widest uppercase opacity-60 mb-1.5 block">Title *</label>
                  <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} placeholder="Linear — Issue Tracking…" className={`w-full h-11 px-3 rounded-xl border text-[14px] outline-none ${actualTheme==='dark'?'bg-white/[0.06] border-white/10 focus:border-violet-500/50':'bg-white border-black/10 focus:border-violet-500/50'} focus:ring-4 focus:ring-violet-500/10 transition`}/>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold tracking-widest uppercase opacity-60 mb-1.5 block">Label / Note</label>
                    <input value={form.label} onChange={e=>setForm({...form, label:e.target.value})} placeholder="Short note, context…" className={`w-full h-11 px-3 rounded-xl border text-[14px] outline-none ${actualTheme==='dark'?'bg-white/[0.06] border-white/10':'bg-white border-black/10'}`}/>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold tracking-widest uppercase opacity-60 mb-1.5 block">Collection</label>
                    <input list="cols" value={form.collection} onChange={e=>setForm({...form, collection:e.target.value})} placeholder="General" className={`w-full h-11 px-3 rounded-xl border text-[14px] outline-none ${actualTheme==='dark'?'bg-white/[0.06] border-white/10':'bg-white border-black/10'}`}/>
                    <datalist id="cols">{collections.map(c=> <option key={c} value={c}/>)}</datalist>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold tracking-widest uppercase opacity-60 mb-2 block">Tag — dropdown with icons & colors</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {Object.entries(TAG_META).map(([k, m])=>{
                      const Ic = m.icon;
                      const active = form.tag===k;
                      return <button key={k} onClick={()=>setForm({...form, tag:k as TagType})} type="button" className={`h-11 rounded-xl border text-[12px] font-medium flex items-center gap-1.5 justify-center transition-all ${active?'bg-zinc-900 text-white dark:bg-white dark:text-black border-zinc-900 shadow-lg scale-[1.02]':'bg-white dark:bg-white/[0.06] border-black/5 dark:border-white/10 hover:scale-[1.02]'}`}>
                        <Ic className={`w-4 h-4 ${active?'':'opacity-70'}`}/>{m.label}
                      </button>
                    })}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input value={form.customTagInput} onChange={e=>setForm({...form, customTagInput:e.target.value})} placeholder="Custom tag (e.g. research, client-x)" className={`flex-1 h-10 px-3 rounded-xl border text-[13px] ${actualTheme==='dark'?'bg-white/[0.06] border-white/10':'bg-white border-black/10'}`}/>
                    {customTags.length>0 && <div className="hidden md:flex gap-1.5 flex-wrap max-w-[180px]">{customTags.slice(0,3).map(t=> <button key={t} onClick={()=>setForm({...form, customTagInput:t})} className="px-2 py-1 rounded-full text-[11px] bg-black/5 dark:bg-white/10">{t}</button>)}</div>}
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" checked={form.favorite} onChange={e=>setForm({...form, favorite:e.target.checked})} className="sr-only"/>
                  <div className={`w-11 h-6 rounded-full p-1 transition flex ${form.favorite?'bg-amber-500 justify-end':'bg-black/10 dark:bg-white/10 justify-start'}`}><div className="w-4 h-4 rounded-full bg-white shadow"/></div>
                  <span className="text-[13px] flex items-center gap-1"><Star className={`w-4 h-4 ${form.favorite?'fill-amber-500 text-amber-500':''}`}/> Favorite</span>
                </label>

                {formError && <div className="flex items-center gap-2 text-[13px] text-red-600 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2"><AlertCircle className="w-4 h-4"/>{formError}</div>}

                <div className="flex gap-3 pt-2">
                  <button ref={magneticRef} onClick={saveLink} style={{transform:`translate(${magPos.x}px, ${magPos.y}px)`}} className="flex-1 h-12 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black font-medium text-[14px] flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)]">
                    <Magnet className="w-4 h-4 opacity-60"/>{editing?'Update link':'Save link'} <span className="text-[10px] opacity-50 ml-1">↵</span>
                  </button>
                  <button onClick={()=>setFormOpen(false)} className="h-12 px-6 rounded-full border bg-white dark:bg-white/10 border-black/10 dark:border-white/10 text-[14px]">Cancel</button>
                </div>

                <p className="text-[11px] opacity-50 text-center">Auto-captures date: <span className="font-medium">{new Date(nowTick).toLocaleString()}</span> • {relativeTime(nowTick)} • Will sync to Sheets if connected</p>
              </div>
            </div>

            {/* Right live preview */}
            <div className={`w-full md:w-[360px] border-t md:border-t-0 md:border-l p-6 md:p-6 ${actualTheme==='dark'?'border-white/10 bg-white/[0.03]':'border-black/5 bg-black/[0.02]'} overflow-auto`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-semibold tracking-widest uppercase opacity-60 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5"/> Live Preview</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"/>Bento</span>
              </div>

              {(() => {
                const meta = TAG_META[form.tag] || TAG_META.other;
                const Icon = meta.icon;
                const domain = (()=>{ try{ return new URL(form.url).hostname.replace('www.',''); }catch{ return 'example.com'; }})();
                return (
                  <div className={`rounded-[20px] border p-5 bento ${actualTheme==='dark'?'bg-white/[0.06] border-white/10':'bg-white border-black/5'} shadow-sm`}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-black/5 grid place-items-center shrink-0">
                        {form.url ? <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} alt="" className="w-6 h-6"/> : <Icon className={`w-5 h-5 ${meta.color}`}/>}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] border ${meta.bg} ${meta.color} flex items-center gap-1`}><span className={`w-1 h-1 rounded-full ${meta.dot}`}/>{meta.label}</span>
                          {form.customTagInput && <span className="px-2 py-0.5 rounded-full text-[10px] bg-violet-500/10 border border-violet-500/20 text-violet-600">{form.customTagInput}</span>}
                        </div>
                        <h4 className="font-medium text-[14px] leading-tight line-clamp-2">{form.title || 'Your title will appear here'}</h4>
                        {form.label && <p className="text-[12px] opacity-60 mt-1">{form.label}</p>}
                      </div>
                    </div>
                    <div className="mt-4 text-[11px] opacity-60 flex items-center gap-1.5"><Globe className="w-3 h-3"/>{domain} • {relativeTime(nowTick)}</div>
                    <div className="mt-3 h-8 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black text-[12px] grid place-items-center">Open preview</div>
                    <div className="mt-3 flex gap-2 text-[11px]">
                      <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">{form.collection || 'General'}</span>
                      <span className="opacity-50">{new Date(nowTick).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })()}

              <div className="mt-6 space-y-3">
                <h5 className="text-[12px] font-medium opacity-80">Tips</h5>
                <div className="space-y-2 text-[12px] leading-relaxed opacity-70">
                  <div className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/>Paste any URL — we detect favicon and suggest tags instantly.</div>
                  <div className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/>Use custom tags for client work, research buckets, or personal taxonomy.</div>
                  <div className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/>Wall view turns your library into a dense favicon mosaic.</div>
                </div>

                <div className={`mt-4 rounded-xl p-3 border text-[11px] ${actualTheme==='dark'?'bg-violet-500/10 border-violet-500/20':'bg-violet-500/5 border-violet-500/10'}`}>
                  <div className="font-medium flex items-center gap-1"><Wand2 className="w-3.5 h-3.5 text-violet-500"/> AI auto-tag logic</div>
                  <div className="opacity-70 mt-1 leading-relaxed">github→tool, figma→design, youtube→video, medium→blog, docs→docs. Click a suggestion chip to apply.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GSheets modal */}
      {gsheetOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[12px]" onClick={()=>setGsheetOpen(false)}/>
          <div className={`relative w-full max-w-[640px] rounded-[24px] border shadow-2xl p-6 md:p-7 max-h-[90vh] overflow-auto ${actualTheme==='dark'?'bg-zinc-900 border-white/10':'bg-white border-black/10'}`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="serif text-[20px] flex items-center gap-2"><Cloud className="w-5 h-5"/> Google Sheets Sync</h3>
              <button onClick={()=>setGsheetOpen(false)} className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 grid place-items-center"><X className="w-4 h-4"/></button>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center gap-2 text-[12px]">
                <span className={`w-2 h-2 rounded-full ${gsheet.connected?'bg-emerald-500 animate-pulse':'bg-zinc-400'}`}/>{gsheet.connected?'Connected':'Not connected'} {gsheetStatus!=='idle' && <span className="ml-2 px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 capitalize">{gsheetStatus}</span>}
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-widest opacity-60">Apps Script WebApp URL</label>
                <input value={gsheet.webAppUrl} onChange={e=>setGsheet({...gsheet, webAppUrl:e.target.value})} placeholder="https://script.google.com/macros/s/.../exec" className={`mt-1 w-full h-11 px-3 rounded-xl border text-[13px] ${actualTheme==='dark'?'bg-white/[0.06] border-white/10':'bg-black/[0.03] border-black/10'}`}/>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-widest opacity-60">Sheet ID</label>
                <input value={gsheet.sheetId} onChange={e=>setGsheet({...gsheet, sheetId:e.target.value})} placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms" className={`mt-1 w-full h-11 px-3 rounded-xl border text-[13px] ${actualTheme==='dark'?'bg-white/[0.06] border-white/10':'bg-black/[0.03] border-black/10'}`}/>
              </div>

              <div className="flex gap-2">
                <button onClick={()=>{ setGsheet({...gsheet, connected: !!gsheet.webAppUrl}); addToast(gsheet.webAppUrl?'Sheets connected':'Enter URL first', gsheet.webAppUrl?'success':'error'); }} className="h-10 px-4 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black text-[13px] font-medium">Save & Connect</button>
                <button onClick={pushAll} className="h-10 px-4 rounded-full border bg-white dark:bg-white/10 border-black/10 dark:border-white/10 text-[13px] flex items-center gap-1"><Cloud className="w-4 h-4"/> Push All</button>
                <button onClick={pullFromSheets} className="h-10 px-4 rounded-full border bg-white dark:bg-white/10 border-black/10 dark:border-white/10 text-[13px] flex items-center gap-1"><Download className="w-4 h-4"/> Pull</button>
              </div>

              <div className={`rounded-xl border p-3 ${actualTheme==='dark'?'bg-white/[0.04] border-white/10':'bg-black/[0.02] border-black/5'}`}>
                <div className="text-[11px] font-semibold uppercase tracking-widest opacity-60 mb-2">Apps Script code (paste in scripts/apps-script.js / Apps Script editor)</div>
                <pre className="text-[11px] leading-[1.5] overflow-auto p-3 rounded-lg bg-black text-white/80 max-h-[220px]">{`function doPost(e){
  try{
    const data = JSON.parse(e.postData.contents);
    const ss = data.sheetId ? SpreadsheetApp.openById(data.sheetId) : SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets()[0];
    if(sheet.getLastRow() === 0){
      sheet.appendRow(["Title","URL","Label","Tag","Date","Favorite","ID","Favicon"]);
    }
    function rowFromItem(r){
      const title = r.title || "";
      const url = r.url || "";
      const label = r.collection || r.label || "General";
      const tag = Array.isArray(r.tags) ? r.tags.join(",") : (r.tag || r.tags || "other");
      const date = r.createdAt || new Date().toISOString();
      const fav = r.favorite === true || r.favorite === "TRUE";
      const id = r.id || ("link-" + new Date().getTime());
      const favicon = r.faviconUrl || r.favicon || "";
      return [title, url, label, tag, date, fav, id, favicon];
    }
    if(data.action === "add"){
      sheet.appendRow(rowFromItem(data.data));
    } else if(data.action === "edit"){
      const r = data.data; const rows = sheet.getDataRange().getValues(); let found = false;
      for(let i=1; i<rows.length; i++){
        if(String(rows[i][6]) === String(r.id)){
          const updatedRow = rowFromItem(r);
          sheet.getRange(i+1, 1, 1, updatedRow.length).setValues([updatedRow]);
          found = true; break;
        }
      }
      if(!found) sheet.appendRow(rowFromItem(r));
    } else if(data.action === "delete"){
      const rows = sheet.getDataRange().getValues();
      for(let i=rows.length-1; i>=1; i--){
        if(String(rows[i][6]) === String(data.data.id)){ sheet.deleteRow(i+1); break; }
      }
    } else if(data.action === "pushAll"){
      sheet.clear();
      sheet.appendRow(["Title","URL","Label","Tag","Date","Favorite","ID","Favicon"]);
      const batch = (data.data || []).map(rowFromItem);
      if(batch.length > 0) sheet.getRange(2, 1, batch.length, 8).setValues(batch);
    }
    return ContentService.createTextOutput(JSON.stringify({success:true})).setMimeType(ContentService.MimeType.JSON);
  }catch(err){ return ContentService.createTextOutput(JSON.stringify({success:false, error: err.toString()})).setMimeType(ContentService.MimeType.JSON); }
}
function doGet(e){
  try{
    const ss = (e && e.parameter && e.parameter.sheetId) ? SpreadsheetApp.openById(e.parameter.sheetId) : SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets()[0]; const rows = sheet.getDataRange().getValues(); const out = [];
    for(let i=1; i<rows.length; i++){
      const r = rows[i]; if(!r[1]) continue;
      out.push({title:r[0], url:r[1], label:r[2], collection:r[2], tag:r[3], tags:(r[3]?String(r[3]).split(",").filter(Boolean):[]), createdAt:r[4], favorite:r[5]===true||r[5]==="TRUE", id:r[6], favicon:r[7], faviconUrl:r[7]});
    }
    return ContentService.createTextOutput(JSON.stringify({success:true, data:out})).setMimeType(ContentService.MimeType.JSON);
  }catch(err){ return ContentService.createTextOutput(JSON.stringify({success:false, error: err.toString()})).setMimeType(ContentService.MimeType.JSON); }
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Command Palette */}
      {cmdOpen && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center pt-[20vh] p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[10px]" onClick={()=>setCmdOpen(false)}/>
          <div className={`relative w-full max-w-[560px] rounded-[20px] border shadow-[0_30px_90px_-20px_rgba(0,0,0,0.5)] overflow-hidden ${actualTheme==='dark'?'bg-zinc-900 border-white/10':'bg-white border-black/10'}`}>
            <div className="flex items-center gap-3 px-4 h-14 border-b border-black/5 dark:border-white/10">
              <Search className="w-4 h-4 opacity-50"/><input autoFocus value={cmdQuery} onChange={e=>setCmdQuery(e.target.value)} placeholder="Search actions, links, collections…" className="flex-1 bg-transparent outline-none text-[14px] placeholder:opacity-50"/>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono">ESC</span>
            </div>
            <div className="max-h-[360px] overflow-auto p-2">
              {filteredCommands.map(c=>{
                const Ic = c.icon;
                return <button key={c.id} onClick={c.action} className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition text-[13.5px]"><div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 grid place-items-center"><Ic className="w-4 h-4"/></div>{c.label}</button>
              })}
              {filteredCommands.length===0 && <div className="p-6 text-center text-[13px] opacity-60">No commands found</div>}
            </div>
            <div className="px-4 h-10 border-t border-black/5 dark:border-white/10 flex items-center gap-2 text-[11px] opacity-60"><span className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono">↑↓</span> Navigate • <span className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono">↵</span> Select</div>
          </div>
        </div>
      )}

      {/* Help */}
      {showHelp && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[8px]" onClick={()=>setShowHelp(false)}/>
          <div className={`relative w-full max-w-[420px] rounded-[20px] border p-6 ${actualTheme==='dark'?'bg-zinc-900 border-white/10':'bg-white border-black/10'}`}>
            <h3 className="serif text-[18px] mb-4">Keyboard shortcuts</h3>
            <div className="space-y-2 text-[13px]">
              {[
                ['N','New link'],
                ['/','Focus search'],
                ['⌘K','Command palette'],
                ['?','Toggle help'],
                ['Esc','Close modal'],
              ].map(([k,v])=> <div key={k} className="flex justify-between"><span>{v}</span><span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 font-mono text-[11px]">{k}</span></div>)}
            </div>
            <button onClick={()=>setShowHelp(false)} className="mt-5 w-full h-10 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black">Got it</button>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-[90] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t=>(
          <div key={t.id} className={`pointer-events-auto px-4 py-2.5 rounded-full border shadow-xl flex items-center gap-2 text-[13px] font-medium backdrop-blur-xl animate-[slideUp_0.35s_cubic-bezier(0.16,1,0.3,1)] ${t.type==='success'?'bg-zinc-900 text-white dark:bg-white dark:text-black border-zinc-900':'bg-white dark:bg-zinc-800 border-black/10 dark:border-white/10'} ${t.type==='error'?'!bg-red-500 !text-white !border-red-500':''}`}>
            {t.type==='success'?<CheckCircle2 className="w-4 h-4"/>:t.type==='error'?<AlertCircle className="w-4 h-4"/>:<Sparkles className="w-4 h-4"/>}{t.message}
          </div>
        ))}
      </div>

      {/* Confetti */}
      {confetti.map((c,i)=>(
        <div key={i} className="confetti" style={{ left:`${Math.random()*100}vw`, background:c.color, transform:`rotate(${c.rot}deg)`, animationDelay:`${Math.random()*0.2}s`, borderRadius: Math.random()>0.5?'50%':'2px' }}/>
      ))}

      <style>{`@keyframes slideUp{from{transform:translateY(20px) translateX(-50%);opacity:0}to{transform:translateY(0) translateX(-50%);opacity:1}}`}</style>
    </div>
  );
}
