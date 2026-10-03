import React from 'react';

interface FooterProps {
  theme?: 'light' | 'dark';
}

export default function Footer({ theme = 'light' }: FooterProps) {
  const isDark = theme === 'dark';

  const cardStyle = isDark
    ? 'bg-[rgba(24,24,27,0.98)] backdrop-blur-[12px] border-[1.5px] border-[rgba(255,255,255,0.16)] shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]'
    : 'bg-[rgba(255,255,255,0.98)] backdrop-blur-[12px] border-[1.5px] border-[#E4E4E7] shadow-[0_1px_3px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)]';

  return (
    <footer
      role="contentinfo"
      aria-label="Site Footer"
      className="mt-16 pt-8 pb-32 md:pb-16 border-t-[1.5px] border-zinc-200 dark:border-white/10"
    >
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 space-y-12">
        {/* SEO OPTIMISED CTA SECTION */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="mono text-[11px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full bg-violet-600/10 text-violet-600 dark:bg-violet-400/10 dark:text-violet-400 border border-violet-500/20">
                Recommended Ecosystem
              </span>
              <h2 className="display text-xl md:text-2xl font-black tracking-[-0.03em] mt-2">
                Elevate Your Workflow & Knowledge Base
              </h2>
            </div>
            <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
              Discover industry-leading AI automation tools and curated engineering insights to scale your digital productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 pt-2">
            {/* CTA 1: Sudarshan AI */}
            <div
              className={`rounded-[20px] p-6 md:p-7 relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${cardStyle} glossy-before`}
            >
              <div
                className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-[50px] opacity-40 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #7C3AED, #2563EB)' }}
              />

              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-[10px] bg-violet-600 text-white font-black grid place-items-center text-sm shadow-md">
                    🤖
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                    Next-Gen AI Platform
                  </span>
                </div>

                <h3 className="display text-lg md:text-xl font-bold tracking-tight">
                  Supercharge Enterprise Intelligence with{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-500 dark:from-violet-400 dark:to-indigo-300">
                    Sudarshan AI
                  </span>
                </h3>

                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Harness autonomous AI agents, enterprise-grade cognitive automation, and state-of-the-art intelligent tools engineered for breakthrough productivity and operational speed.
                </p>
              </div>

              <div className="relative z-10 pt-6 mt-4 border-t border-zinc-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
                <a
                  href="https://sudarshan-ai.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Sudarshan AI - Next-Gen Enterprise AI Platform"
                  title="Sudarshan AI - Autonomous Agents and Enterprise AI Solutions"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-[12px] bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm border-[1.5px] border-[#5B21B6] shadow-[0_2px_8px_rgba(124,58,237,0.3),inset_0_1px_0_rgba(255,255,255,0.25)] transition-transform active:scale-[0.98]"
                >
                  <span>Explore Sudarshan AI</span>
                  <span aria-hidden="true">↗</span>
                </a>

                <span className="mono text-[11px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                  <a href="https://sudarshan-ai.com/" target="_blank" rel="noopener noreferrer">
                    sudarshan-ai.com
                  </a>
                </span>
              </div>
            </div>

            {/* CTA 2: Vyapai Blogs */}
            <div
              className={`rounded-[20px] p-6 md:p-7 relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${cardStyle} glossy-before`}
            >
              <div
                className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-[50px] opacity-40 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #2563EB, #059669)' }}
              />

              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-[10px] bg-blue-600 text-white font-black grid place-items-center text-sm shadow-md">
                    📚
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Tech & Business Insights
                  </span>
                </div>

                <h3 className="display text-lg md:text-xl font-bold tracking-tight">
                  Read Deep Tech & Engineering on{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-300">
                    Vyapai Blogs
                  </span>
                </h3>

                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Deep-dive into comprehensive articles, modern web development patterns, tech market trends, startup strategies, and actionable guides curated for builders.
                </p>
              </div>

              <div className="relative z-10 pt-6 mt-4 border-t border-zinc-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
                <a
                  href="https://blogs.vyapai.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Vyapai Blogs - In-depth Tech, AI & Business Insights"
                  title="Vyapai Blogs - Software Architecture, Web Tools and Innovation"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm border-[1.5px] border-blue-800 shadow-[0_2px_8px_rgba(37,99,235,0.3),inset_0_1px_0_rgba(255,255,255,0.25)] transition-transform active:scale-[0.98]"
                >
                  <span>Read Vyapai Blogs</span>
                  <span aria-hidden="true">↗</span>
                </a>

                <span className="mono text-[11px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                  <a href="https://blogs.vyapai.in/" target="_blank" rel="noopener noreferrer">
                    blogs.vyapai.in
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SEO DIRECTORY & FOOTER NAVIGATION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-6 border-t border-zinc-200 dark:border-white/10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[10px] bg-[#7C3AED] border border-[#5B21B6] grid place-items-center text-white font-black display text-[14px]">
                L
              </div>
              <span className="display font-extrabold text-[18px] tracking-[-0.03em]">
                LinkSaver
              </span>
              <span className="mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                ACTIVE SYNC
              </span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md leading-relaxed">
              Ultra-modern link saver and bookmark manager optimized for speed, mobile visibility, and 2-way Google Sheets synchronization. Organize resources seamlessly across devices.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="mono text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Ecosystem & Partners
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://sudarshan-ai.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Sudarshan AI Platform"
                  className="font-medium text-zinc-700 dark:text-zinc-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Sudarshan AI Platform</span>
                  <span className="text-xs text-zinc-400">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://blogs.vyapai.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Vyapai Tech & Business Blog"
                  className="font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Vyapai Tech Blogs</span>
                  <span className="text-xs text-zinc-400">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://docs.google.com/spreadsheets/d/1h9dlyn8bzdIr9sq_TGfrarMMZVvSPPZ49zhxAGYM-JE/edit"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Google Sheets Database"
                  className="font-medium text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Connected Sheet</span>
                  <span className="text-xs text-zinc-400">↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* SEO Focus Topics */}
          <div className="space-y-2">
            <h4 className="mono text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Key Capabilities
            </h4>
            <ul className="space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
              <li>• Google Sheets Bi-directional Sync</li>
              <li>• Notion-Style Bento & Grid Views</li>
              <li>• Instant Keyboard Navigation (Cmd+K)</li>
              <li>• Offline-First Local Storage</li>
              <li>• High-Contrast Mobile Interface</li>
            </ul>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT BAR */}
        <div className="pt-6 border-t border-zinc-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <p>
            © {new Date().getFullYear()} LinkSaver. All rights reserved. Supported by{' '}
            <a
              href="https://sudarshan-ai.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-zinc-700 dark:text-zinc-300 hover:underline"
            >
              Sudarshan AI
            </a>{' '}
            &{' '}
            <a
              href="https://blogs.vyapai.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-zinc-700 dark:text-zinc-300 hover:underline"
            >
              Vyapai Blogs
            </a>
            .
          </p>
          <div className="flex items-center gap-4 mono text-[11px]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Operational
            </span>
            <span>v2.1 Mobile-Fixed</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
