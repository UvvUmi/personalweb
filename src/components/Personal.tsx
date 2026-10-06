import { useState } from "react";

type PackageManager = "npm" | "yarn" | "pnpm" | "bun" | "deno";

// [command, arguments] so each part can be colored separately
const INSTALL: Record<PackageManager, readonly [string, string]> = {
  npm: ["npm", " install personal"],
  yarn: ["yarn", " add personal"],
  pnpm: ["pnpm", " add personal"],
  bun: ["bun", " add personal"],
  deno: ["deno", " add npm:personal"],
};

type Feature = readonly [title: string, body: string];

const FEATURES: Feature[] = [
  ["Minimal API, fast adoption", "Create a store with a single hook, subscribe with selectors, and avoid boilerplate or providers."],
  ["Safe under React concurrency", "Built to avoid zombie children and tearing issues while keeping renders predictable."],
  ["Works across React and vanilla", "Share stores between React, React Native, and non-React environments with the same API surface."],
  ["Batteries included", "Opt into devtools, persistence, Redux-style middleware, and Immer without changing your mental model."],
  ["TypeScript-first ergonomics", "Strongly typed helpers and patterns so your state and actions stay inferred."],
  ["Small footprint", "Tiny bundle size with zero config and performance that keeps pace in production."],
];

// Design tokens copied from the Rspress stylesheet of the original site
const css = `
.pw{--bg:#f7f9ff;--soft:#f8f8f9;--mute:#f1f1f1;--div:#0000001f;--t0:#000;--t1:#242424;--t2:#000000b3;--t3:#3c3c3c54;
  --brand:#ff5e00;--brand-d:#ff704d;--tabs-bg:#f8f8f9;--feat:linear-gradient(135deg,#fff,#f9f9f980);--shadow:#00000040;
  --r:12px;--rs:8px;--rl:16px;
  font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:var(--bg);color:var(--t1);min-height:100vh;position:relative;overflow-x:clip}
.pw.dark{--bg:#111;--soft:#292e37;--mute:#343a46;--div:#5454547a;--t0:#fff;--t1:#fffff5ed;--t2:#fffff5a6;--t3:#ebebeb61;
  --tabs-bg:#191919;--feat:linear-gradient(135deg,#fff0,#ffffff08);--shadow:#545454a6}
.pw *{box-sizing:border-box}
.pw button{font:inherit;color:inherit;cursor:pointer;background:none;border:0}
.pw :focus-visible{outline:2px solid var(--brand);outline-offset:2px}
.pw nav{position:sticky;top:0;z-index:20;height:56px;display:flex;align-items:center;justify-content:space-between;padding:0 20px;
  background:color-mix(in srgb,var(--bg) 60%,transparent);backdrop-filter:blur(25px);-webkit-backdrop-filter:blur(25px)}
.pw .logo{display:flex;align-items:center;gap:6px;font-weight:600;font-size:1rem;transition:opacity .3s}
.pw .logo:hover{opacity:.6}
.pw .right{display:flex;align-items:center;gap:16px}
.pw .search{display:flex;align-items:center;justify-content:space-between;gap:12px;min-width:140px;height:40px;padding:0 10px;font-size:13px;
  border:1px solid var(--div);border-radius:var(--rs);background:color-mix(in srgb,var(--bg) 30%,transparent);backdrop-filter:blur(25px);transition:border-color .3s}
.pw .search:hover{border-color:var(--brand)}
.pw .search .w{display:flex;align-items:center;gap:6px}
.pw .hot{background:var(--soft);border-radius:var(--rs);padding:0 8px;font-weight:500;color:var(--t3);display:flex;gap:2px}
.pw .menu{display:flex;gap:20px;list-style:none;margin:0;padding:0;font-size:14px;font-weight:500}
.pw .menu a:hover{color:var(--brand)}
.pw .divider{width:1px;height:20px;background:var(--div)}
.pw .ic{display:flex;align-items:center;justify-content:center;width:24px;height:24px;color:var(--t2);transition:color .2s}
.pw .ic:hover{color:var(--t0)}
.pw .ic svg{width:100%;height:100%}
.pw .bg{position:absolute;top:0;left:0;width:100%;height:1000px;z-index:0;pointer-events:none;filter:blur(2px);background:var(--bg)}
.pw .hero{position:relative;z-index:1;max-width:72rem;margin:5rem auto;padding:20px 40px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:32px}
.pw h1{margin:0;font-size:4rem;font-weight:600;line-height:1.2em;color:var(--t0)}
.pw .tagline{margin:0;color:var(--t2);font-size:1.25rem;max-width:42rem}
.pw .actions{display:flex;gap:1.5rem}
.pw .btn{display:inline-flex;align-items:center;justify-content:center;height:48px;min-width:142px;padding:0 24px;font-size:16px;font-weight:700;
  border-radius:var(--rl);white-space:nowrap;transition:all .3s}
.pw .btn.brand{background:var(--brand-d);color:#fff}
.pw .btn.alt{border:1px solid #d1d5db;color:var(--t0);background:var(--bg)}
.pw.dark .btn.alt{background:var(--mute);color:var(--t1);border-color:#484848}
.pw .btn:hover{opacity:.8}
.pw .tabs{width:100%;max-width:640px;margin:1rem 0;text-align:left;border:1px solid var(--div);border-radius:var(--r);overflow:hidden}
.pw .labels{display:flex;flex-wrap:wrap;padding:4px 12px;background:var(--tabs-bg);border-bottom:1px solid var(--div)}
.pw .tab{padding:4px 12px;margin-right:4px;font-size:.875rem;color:var(--t2);border-radius:calc(1.5*var(--rs));transition:color .2s,background-color .2s}
.pw .tab:hover{background:var(--mute)}
.pw .tab[aria-selected=true]{color:var(--t0);background:var(--bg);box-shadow:0 0 3px 0 var(--shadow)}
.pw.dark .tab[aria-selected=true]{background:var(--soft)}
.pw .block{position:relative;background:var(--bg);padding:20px}
.pw pre{margin:0;overflow-x:auto;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.875rem;line-height:1.7}
.pw .fn{color:#d9480f}.pw.dark .fn{color:#ffb86c}
.pw .str{color:#2f7d4f}.pw.dark .str{color:#a5d6a7}
.pw .copy{position:absolute;top:20px;right:20px;width:20px;height:20px;color:var(--t3);opacity:0;transition:opacity .2s,color .2s}
.pw .block:hover .copy,.pw .copy:focus-visible{opacity:1}
.pw .copy:hover{color:var(--t2)}
.pw .copy.ok{color:#10b981;opacity:1}
.pw .features{position:relative;z-index:1;max-width:72rem;margin:auto auto 2rem;padding:10px;display:grid;grid-template-columns:repeat(3,1fr);gap:15px}
.pw .card{height:100%;padding:2rem;border:1px solid var(--div);border-radius:2rem;background:var(--feat);backdrop-filter:blur(10px);transition:all .3s}
.pw .card:hover{border-color:var(--brand);color:var(--brand)}
.pw .card h2{margin:0;font-size:1.5rem;font-weight:700;line-height:1.3}
.pw .card p{margin:0;padding-top:.5rem;font-size:.875rem;font-weight:500;line-height:1.5;color:var(--t2)}
@media(max-width:960px){.pw .features{grid-template-columns:repeat(2,1fr)}}
@media(max-width:768px){.pw .search,.pw .menu,.pw .divider{display:none}.pw .actions{flex-direction:column;width:80%;gap:1rem}}
@media(max-width:640px){.pw .features{grid-template-columns:1fr}}
@media(max-width:600px){.pw .hero{padding:10px}.pw h1{font-size:2.5rem}.pw .tagline{font-size:1rem}}
@media(prefers-reduced-motion:reduce){.pw *{transition:none!important}}
`;

const Bear = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
    <circle cx="8" cy="9" r="4.5" fill="#a0522d" />
    <circle cx="24" cy="9" r="4.5" fill="#a0522d" />
    <circle cx="16" cy="18" r="11" fill="#c47a4a" />
    <ellipse cx="16" cy="21" rx="5" ry="3.8" fill="#f2d9bf" />
    <circle cx="12" cy="16" r="1.4" fill="#1c1917" />
    <circle cx="20" cy="16" r="1.4" fill="#1c1917" />
    <ellipse cx="16" cy="19.5" rx="1.8" ry="1.2" fill="#1c1917" />
  </svg>
);

const Github = () => (
  <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
);

const Npm = () => (
  <svg viewBox="0 0 24 24"><path fill="currentColor" d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019l-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" /></svg>
);

const Search = () => (
  <svg width="1em" height="1em" viewBox="0 0 20 21" fill="currentColor"><path d="M8.333 1.913A6.667 6.667 0 0 1 15 8.58c0 1.54-.525 2.957-1.402 4.085l4.49 4.492a.834.834 0 0 1-1.177 1.178l-4.491-4.49a6.64 6.64 0 0 1-4.087 1.402 6.667 6.667 0 0 1 0-13.334m0 1.667a5 5 0 1 0 0 10 5 5 0 0 0 0-10" /></svg>
);

const Sun = () => (
  <svg viewBox="0 0 24 24"><path fill="currentColor" d="m7.001 15.848-1.226 1.226a.58.58 0 0 0 0 .818.58.58 0 0 0 .818 0l1.226-1.226a.58.58 0 0 0 0-.818.58.58 0 0 0-.818 0m-.352-8.735a.584.584 0 0 0 .825-.825L6.237 5.051a.584.584 0 0 0-.825.825zM5.011 11.07h-1.75a.584.584 0 0 0 0 1.167h1.75c.324 0 .584-.26.584-.583a.585.585 0 0 0-.584-.584m7.003-5.835c.324 0 .584-.26.584-.584V2.9a.58.58 0 0 0-.584-.584.58.58 0 0 0-.583.583V4.65c0 .323.262.584.583.584m5.616 1.621 1.226-1.225a.58.58 0 0 0 0-.818.58.58 0 0 0-.818 0l-1.226 1.225a.58.58 0 0 0 0 .818.576.576 0 0 0 .818 0m3.138 4.214h-1.75a.58.58 0 0 0-.584.584c0 .324.26.584.583.584h1.751a.584.584 0 1 0 0-1.167m-3.389 5.124a.584.584 0 0 0-.825.825l1.238 1.238a.584.584 0 0 0 .825-.826zm-5.365-9.795a5.256 5.256 0 0 0-5.257 5.258 5.256 5.256 0 0 0 5.257 5.257 5.256 5.256 0 0 0 5.257-5.257 5.256 5.256 0 0 0-5.257-5.258m0 11.675a.58.58 0 0 0-.583.583v1.751a.582.582 0 1 0 1.167 0v-1.75a.584.584 0 0 0-.584-.584" /></svg>
);

const Moon = () => (
  <svg viewBox="0 0 19 19" width="19" height="19"><path fill="currentColor" d="M9.166 0a9.2 9.2 0 0 1 1.857.188.834.834 0 0 1 .042 1.623 4.47 4.47 0 1 0 5.457 5.457l.048-.135a.834.834 0 0 1 1.575.177q.186.902.188 1.856A9.168 9.168 0 1 1 9.166 0" /></svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export default function PersonalHome() {
  const [dark, setDark] = useState<boolean>(true); // the original site opens in dark mode
  const [pm, setPm] = useState<PackageManager>("npm");
  const [copied, setCopied] = useState<boolean>(false);

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(INSTALL[pm].join(""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className={`pw${dark ? " dark" : ""}`}>
      <style>{css}</style>
      <div className="bg" />

      <nav>
        <a className="logo" href="https://localhost">
          <Bear /> <span>Personal</span>
        </a>
        <div className="right">
          <button className="search" aria-label="Search">
            <span className="w"><Search /> Search</span>
            <span className="hot"><span>⌘</span><span>K</span></span>
          </button>
          <ul className="menu">
            <li><a href="#">Learn</a></li>
            <li><a href="#">Reference</a></li>
          </ul>
          <span className="divider" />
          <button className="ic" onClick={() => setDark(!dark)} aria-label="Toggle theme">
            {dark ? <Moon /> : <Sun />}
          </button>
          <a className="ic" href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github /></a>
          <a className="ic" href="https://www.npmjs.com" target="_blank" rel="noopener noreferrer" aria-label="npm"><Npm /></a>
        </div>
      </nav>

      <header className="hero">
        <h1>Bear necessities for React state</h1>
        <p className="tagline">
          A tiny, predictable store with hooks-first ergonomics and escape hatches that stay out of your way.
        </p>
        <div className="actions">
          <a className="btn brand" href="#">Introduction</a>
          <a className="btn alt" href="#">Quick Start</a>
        </div>

        <div className="tabs">
          <div className="labels" role="tablist">
            {(Object.keys(INSTALL) as PackageManager[]).map((k) => (
              <button key={k} role="tab" className="tab" aria-selected={pm === k} onClick={() => setPm(k)}>
                {k}
              </button>
            ))}
          </div>
          <div className="block">
            <pre><code><span className="fn">{INSTALL[pm][0]}</span><span className="str">{INSTALL[pm][1]}</span></code></pre>
            <button className={`copy${copied ? " ok" : ""}`} onClick={copy} title="Copy code" aria-label="Copy code">
              {copied ? "✓" : <CopyIcon />}
            </button>
          </div>
        </div>
      </header>

      <main className="features">
        {FEATURES.map(([title, body]) => (
          <article className="card" key={title}>
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </main>
    </div>
  );
}