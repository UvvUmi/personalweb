import { useRef, useState } from "react";
import translations from "../localizedStrings.json";
import URL from "../linkUrls.json";

const INFO_CATEGORIES = ["profile", "stack", "experience", "projects", "languages"] as const;
type InfoCategory = (typeof INFO_CATEGORIES)[number];
type Locale = keyof typeof translations;
type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const JSON_TOKEN = /("(?:\\.|[^"\\])*")|([{}\[\],:])|(\b(?:true|false|null)\b)|(-?\d+(?:\.\d+)?)/g;

function highlightJson(value: JsonValue) {
  const json = JSON.stringify(value, null, 2) ?? "null";

  return json.split("\n").map((line, lineIndex) => {
    const tokens = line.split(JSON_TOKEN);

    return (
      <span className="json-line" key={lineIndex}>
        {tokens.map((token, tokenIndex) => {
          if (!token) return null;

          if (token.startsWith('"')) {
            const nextToken = tokens.slice(tokenIndex + 1).find((part) => part?.trim());
            const tokenClass = nextToken === ":" ? "json-key" : "json-string";
            return <span className={tokenClass} key={tokenIndex}>{token}</span>;
          }

          if (/^[{}\[\],:]$/.test(token)) {
            return <span className="json-punctuation" key={tokenIndex}>{token}</span>;
          }

          if (/^(true|false|null|-?\d)/.test(token)) {
            return <span className="json-literal" key={tokenIndex}>{token}</span>;
          }

          return <span key={tokenIndex}>{token}</span>;
        })}
      </span>
    );
  });
}

const styles = `
.pw {
  --page: #f7f9ff;
  --surface: #fff;
  --surface-soft: #f1f3f8;
  --border: #202a3b20;
  --text: #242a36;
  --muted: #606b7c;
  --key: #7652c7;
  --string: #287a50;
  --literal: #bd5425;
  --shadow: 0 16px 42px #18233b12;
  --radius: 16px;
  height: 100vh;
  height: 100svh;
  min-height: 0;
  overflow: hidden;
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  color: var(--text);
  background: var(--page);
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
.pw.dark {
  --page: #11141b;
  --surface: #191e28;
  --surface-soft: #202735;
  --border: #ffffff20;
  --text: #f3f5f9;
  --muted: #aab3c2;
  --key: #c4a7ff;
  --string: #9ed9ae;
  --literal: #ffb86c;
  --shadow: 0 16px 42px #00000035;
}
.pw,
.pw * {
  box-sizing: border-box;
}
.pw a {
  color: inherit;
  text-decoration: none;
}
.pw button {
  border: 0;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.pw :focus-visible {
  outline: 2px solid #ff704d;
  outline-offset: 3px;
}
.pw .background {
  position: absolute;
  z-index: -1;
  inset: 0 0 auto;
  height: 34rem;
  pointer-events: none;
  background: radial-gradient(ellipse at 50% 0%, #ff704d12, transparent 68%);
}
.pw .site-nav {
  position: relative;
  z-index: 5;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 68px;
  padding: 0 clamp(16px, 4vw, 40px);
  border-bottom: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
  background: color-mix(in srgb, var(--page) 82%, transparent);
  backdrop-filter: blur(12px) saturate(125%);
  -webkit-backdrop-filter: blur(12px) saturate(125%);
  box-shadow: 0 1px 12px #10182808;
}
.pw .logo {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  gap: 11px;
  white-space: nowrap;
}
.pw .logo-symbol {
  display: grid;
  width: 36px;
  height: 36px;
  flex: none;
  place-items: center;
  border: 1px solid color-mix(in srgb, #ff704d 35%, var(--border));
  border-radius: 11px;
  color: #d95736;
  background: color-mix(in srgb, #ff704d 8%, var(--surface));
  font-size: 11px;
  font-weight: 800;
  letter-spacing: -0.06em;
}
.pw .logo-copy {
  display: grid;
  min-width: 0;
  gap: 3px;
}
.pw .logo-name {
  overflow: hidden;
  color: var(--text);
  font-size: 14px;
  font-weight: 680;
  letter-spacing: -0.035em;
  text-overflow: ellipsis;
}
.pw .logo-role {
  color: var(--muted);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.085em;
  line-height: 1;
  text-transform: uppercase;
}
.pw .nav-right,
.pw .menu,
.pw .social-links {
  display: flex;
  align-items: center;
}
.pw .nav-right {
  gap: clamp(12px, 2vw, 24px);
}
.pw .nav-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}
.pw .menu {
  gap: clamp(12px, 2vw, 22px);
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--muted);
  font-size: 13px;
  font-weight: 550;
}
.pw .menu a,
.pw .social-link,
.pw .theme-toggle {
  transition: color 160ms ease, background-color 160ms ease, border-color 160ms ease;
}
.pw .menu a:hover,
.pw .social-link:hover,
.pw .theme-toggle:hover {
  color: var(--text);
}
.pw .nav-divider {
  width: 1px;
  height: 24px;
  background: var(--border);
}
.pw .social-links {
  gap: 6px;
}
.pw .social-link,
.pw .theme-toggle {
  display: inline-flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 10px;
  color: var(--muted);
  background: transparent;
}
.pw .social-link:hover,
.pw .theme-toggle:hover {
  background: var(--surface-soft);
}
.pw .social-link svg,
.pw .theme-toggle svg {
  display: block;
  width: 20px;
  height: 20px;
}
.pw .language-picker {
  position: relative;
}
.pw .language-trigger {
  display: inline-flex;
  min-width: 74px;
  height: 36px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 9px;
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--muted);
  background: color-mix(in srgb, var(--surface) 76%, transparent);
  font-size: 12px;
  font-weight: 650;
  transition: color 160ms ease, border-color 160ms ease, background-color 160ms ease;
}
.pw .language-trigger:hover,
.pw .language-trigger[aria-expanded="true"] {
  border-color: color-mix(in srgb, #ff704d 40%, var(--border));
  color: var(--text);
  background: var(--surface);
}
.pw .language-trigger svg {
  width: 13px;
  height: 13px;
  transition: transform 160ms ease;
}
.pw .language-trigger[aria-expanded="true"] svg {
  transform: rotate(180deg);
}
.pw .language-menu {
  position: absolute;
  z-index: 10;
  top: calc(100% + 8px);
  right: 0;
  display: grid;
  min-width: 148px;
  gap: 3px;
  padding: 5px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: color-mix(in srgb, var(--surface) 92%, transparent);
  box-shadow: var(--shadow);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
.pw .language-menu[hidden] { display: none; }
.pw .language-option {
  display: flex;
  min-height: 34px;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 0 9px;
  border-radius: 8px;
  color: var(--muted);
  background: transparent;
  font-size: 12px;
  text-align: left;
}
.pw .language-option:hover,
.pw .language-option[aria-pressed="true"] {
  color: var(--text);
  background: var(--surface-soft);
}
.pw .language-option[aria-pressed="true"] {
  font-weight: 650;
}
.pw .language-option-check {
  color: #d95736;
  font-size: 13px;
}
.pw .hero {
  display: flex;
  flex: 1 1 auto;
  width: min(100% - 32px, 760px);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 0;
  gap: clamp(12px, 2vh, 22px);
  margin: 0 auto;
  padding-block: clamp(12px, 2vh, 24px);
  text-align: center;
}
.pw .avatar {
  display: block;
  width: clamp(84px, 17svh, 152px);
  height: clamp(84px, 17svh, 152px);
  flex: none;
  border: 8px solid var(--surface);
  border-radius: 50%;
  object-fit: cover;
  box-shadow: var(--shadow);
}
.pw .intro {
  display: grid;
  justify-items: center;
  gap: 12px;
}
.pw h1 {
  margin: 0;
  color: var(--text);
  font-size: clamp(2.25rem, 6vw, 4rem);
  font-weight: 680;
  letter-spacing: -0.055em;
  line-height: 1.08;
}
.pw .tagline {
  max-width: 42rem;
  margin: 0;
  color: var(--muted);
  font-size: clamp(1rem, 2vw, 1.2rem);
  line-height: 1.6;
}
.pw .info-panel {
  display: flex;
  width: 100%;
  min-height: 0;
  max-height: min(48vh, 430px);
  flex: 0 1 auto;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
  text-align: left;
}
.pw .category-list {
  display: flex;
  flex: none;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  padding: 8px;
  border-bottom: 1px solid var(--border);
  background: var(--surface-soft);
}
.pw .category-button {
  min-height: 36px;
  padding: 7px 13px;
  border-radius: 9px;
  color: var(--muted);
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  text-transform: capitalize;
  transition: color 160ms ease, background-color 160ms ease, box-shadow 160ms ease;
}
.pw .category-button:hover {
  color: var(--text);
  background: color-mix(in srgb, var(--surface) 65%, transparent);
}
.pw .category-button[aria-pressed="true"] {
  color: var(--text);
  background: var(--surface);
  box-shadow: 0 1px 4px #141c2a18;
}
.pw .code-panel {
  min-height: 0;
  overflow: auto;
  padding: clamp(16px, 3vw, 24px);
  background: var(--surface);
}
.pw pre {
  max-width: 100%;
  margin: 0;
  overflow: auto;
  color: var(--text);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px;
  line-height: 1.8;
  tab-size: 2;
}
.pw pre code {
  display: block;
  width: max-content;
  min-width: 100%;
  padding: 0;
  border-radius: 0;
  color: inherit;
  background: none;
  font: inherit;
}
.pw .json-line {
  display: block;
  white-space: pre;
}
.pw .json-key {
  color: var(--key);
}
.pw .json-string {
  color: var(--string);
}
.pw .json-punctuation {
  color: var(--muted);
}
.pw .json-literal {
  color: var(--literal);
}
@media (max-width: 820px) {
  .pw .menu,
  .pw .nav-divider {
    display: none;
  }
}
@media (max-width: 480px) {
  .pw .site-nav {
    min-height: 60px;
    padding-inline: 12px;
  }
  .pw .nav-right {
    gap: 4px;
  }
  .pw .nav-controls {
    gap: 2px;
  }
  .pw .logo {
    gap: 6px;
  }
  .pw .logo-symbol {
    width: 32px;
    height: 32px;
    border-radius: 11px;
  }
  .pw .logo-name {
    max-width: calc(100vw - 220px);
    font-size: 12px;
  }
  .pw .logo-role {
    display: none;
  }
  .pw .social-links {
    gap: 2px;
  }
  .pw .language-trigger {
    min-width: 60px;
    min-height: 30px;
    height: 30px;
    gap: 5px;
    padding-inline: 7px;
    font-size: 11px;
  }
  .pw .language-menu { min-width: 136px; }
  .pw .social-link,
  .pw .theme-toggle {
    width: 28px;
    height: 28px;
    padding: 5px;
  }
  .pw .hero {
    width: min(100% - 24px, 760px);
    gap: clamp(10px, 1.8vh, 16px);
    padding-block: 10px;
  }
  .pw .category-list {
    justify-content: flex-start;
    gap: 2px;
    padding: 7px;
  }
  .pw .category-button {
    padding-inline: 10px;
  }
  .pw .code-panel {
    padding: 12px;
  }
  .pw .info-panel {
    max-height: min(48vh, 360px);
  }
  .pw pre {
    overflow-x: hidden;
    font-size: clamp(11px, 3.2vw, 12px);
    line-height: 1.7;
  }
  .pw pre code {
    width: 100%;
    min-width: 0;
  }
  .pw .json-line {
    overflow-wrap: anywhere;
    white-space: pre-wrap;
  }
}
@media (max-height: 620px) {
  .pw .hero {
    gap: 8px;
    padding-block: 6px;
  }
  .pw .avatar {
    width: clamp(68px, 14svh, 96px);
    height: clamp(68px, 14svh, 96px);
  }
  .pw h1 { font-size: clamp(1.65rem, 6vw, 2.5rem); }
  .pw .intro { gap: 5px; }
  .pw .tagline { font-size: 14px; }
  .pw .info-panel { max-height: 40vh; }
  .pw .code-panel { padding-block: 10px; }
}
@media (prefers-reduced-motion: reduce) {
  .pw *,
  .pw *::before,
  .pw *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
`;

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C6.422 18.07 5.633 17.7 5.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0-5a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm0 18a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1ZM4.93 3.515l.707.707a1 1 0 1 1-1.414 1.414l-.707-.707a1 1 0 0 1 1.414-1.414Zm12.728 12.728.707.707a1 1 0 0 1-1.414 1.414l-.707-.707a1 1 0 0 1 1.414-1.414ZM2 12a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1Zm18 0a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1ZM4.222 17.778a1 1 0 0 1 1.414 0l.707.707a1 1 0 1 1-1.414 1.414l-.707-.707a1 1 0 0 1 0-1.414ZM17.657 4.343a1 1 0 0 1 1.414 0 1 1 0 0 1 0 1.414l-.707.707a1 1 0 1 1-1.414-1.414l.707-.707Z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M20.2 15.4A8.5 8.5 0 0 1 8.6 3.8 8.6 8.6 0 1 0 20.2 15.4Z" />
    </svg>
  );
}

export default function Landing() {
  const [isDark, setIsDark] = useState(true);
  const [locale, setLocale] = useState<Locale>("en-US");
  const [activeCategory, setActiveCategory] = useState<InfoCategory>("profile");
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const languageTriggerRef = useRef<HTMLButtonElement>(null);
  const copy = translations[locale];

  return (
    <div className={`pw${isDark ? " dark" : ""}`} lang={locale}>
      <style>{styles}</style>
      <div className="background" aria-hidden="true" />

      <nav className="site-nav" aria-label={copy.main_navigation}>
        <a className="logo" href="/" aria-label={`${copy.full_name} home`}>
          <span className="logo-symbol" aria-hidden="true">DK</span>
          <span className="logo-copy">
            <span className="logo-name">{copy.full_name}</span>
            <span className="logo-role">{copy.role}</span>
          </span>
        </a>

        <div className="nav-right">
          <ul className="menu">
            <li><a href="https://javascript.info">JavaScript</a></li>
            <li><a href="https://www.typescriptlang.org">TypeScript</a></li>
            <li><a href="https://react.dev">React</a></li>
            <li><a href="https://learn.microsoft.com/en-us/dotnet/csharp/">C#</a></li>
            <li><a href="https://dotnet.microsoft.com/en-us/apps/aspnet">ASP.NET Core</a></li>
          </ul>

          <span className="nav-divider" aria-hidden="true" />

          <div className="nav-controls">
            <div
              className="language-picker"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setIsLanguageMenuOpen(false);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setIsLanguageMenuOpen(false);
                  languageTriggerRef.current?.focus();
                }
              }}
            >
              <button
                className="language-trigger"
                ref={languageTriggerRef}
                type="button"
                aria-label={`${copy.language_selector}: ${copy.current_language}`}
                aria-expanded={isLanguageMenuOpen}
                aria-controls="language-menu"
                onClick={() => setIsLanguageMenuOpen((open) => !open)}
              >
                <span>{locale.slice(0, 2).toUpperCase()}</span>
                <ChevronDownIcon />
              </button>
              <div
                className="language-menu"
                id="language-menu"
                role="group"
                aria-label={copy.language_selector}
                hidden={!isLanguageMenuOpen}
              >
                {(Object.keys(translations) as Locale[]).map((language) => (
                  <button
                    className="language-option"
                    key={language}
                    type="button"
                    aria-pressed={locale === language}
                    onClick={() => {
                      setLocale(language);
                      setIsLanguageMenuOpen(false);
                    }}
                  >
                    <span>{translations[language].current_language}</span>
                    {locale === language && <span className="language-option-check" aria-hidden="true">✓</span>}
                  </button>
                ))}
              </div>
            </div>
            <div className="social-links" role="group" aria-label={copy.profile_links}>
              <a className="social-link" href={URL.my_github} target="_blank" rel="noopener noreferrer" aria-label={copy.github_profile} title="GitHub">
                <GithubIcon />
              </a>
              <a className="social-link" href={URL.my_linkedin} target="_blank" rel="noopener noreferrer" aria-label={copy.linkedin_profile} title="LinkedIn">
                <LinkedInIcon />
              </a>
            </div>
            <button
              className="theme-toggle"
              type="button"
              onClick={() => setIsDark((current) => !current)}
              aria-label={isDark ? copy.switch_to_light : copy.switch_to_dark}
              aria-pressed={isDark}
              title={isDark ? copy.switch_to_light : copy.switch_to_dark}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </nav>

      <main className="hero">
        <img
          className="avatar"
          src="https://mockmind-api.uifaces.co/content/human/92.jpg"
          alt={copy.profile_photo}
          width="184"
          height="184"
        />

        <div className="intro">
          <h1>{copy.greeting}</h1>
          <p className="tagline">{copy.tagline}</p>
        </div>

        <section className="info-panel" aria-label={copy.developer_information}>
          <div className="category-list" role="group" aria-label={copy.choose_category}>
            {INFO_CATEGORIES.map((category) => (
              <button
                className="category-button"
                key={category}
                type="button"
                aria-pressed={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {copy.categories[category]}
              </button>
            ))}
          </div>

          <div
            className="code-panel"
            role="region"
            aria-label={copy.json_information_format.replace("{category}", copy.categories[activeCategory])}
          >
            <pre>
              <code>{highlightJson(copy.info[activeCategory])}</code>
            </pre>
          </div>
        </section>
      </main>

    </div>
  );
}
