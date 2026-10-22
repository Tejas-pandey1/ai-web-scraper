"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleHelp,
  Clipboard,
  Code2,
  ExternalLink,
  FileJson2,
  Globe2,
  LoaderCircle,
  LockKeyhole,
  MousePointer2,
  Sparkles,
  WandSparkles,
} from "lucide-react";

type ExtractResponse = {
  data?: unknown;
  sourceTitle?: string;
  sourceUrl?: string;
  pageDescription?: string;
  itemsFound?: number;
  error?: string;
};

const examples = [
  { label: "Products & prices", prompt: "Extract product names, prices, currencies, and product URLs." },
  { label: "Articles", prompt: "Extract article titles, authors, publication dates, and article URLs." },
  { label: "Contact details", prompt: "Extract publicly listed business names, email addresses, phone numbers, and locations." },
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [prompt, setPrompt] = useState(examples[0].prompt);
  const [result, setResult] = useState<ExtractResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const prettyResult = useMemo(
    () => result ? (JSON.stringify(result.data, null, 2) ?? "null") : "",
    [result],
  );

  async function runExtraction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);
    setBusy(true);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, prompt }),
      });
      const payload = (await response.json()) as ExtractResponse;
      if (!response.ok) throw new Error(payload.error || "The extraction could not be completed.");
      setResult(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function copyResult() {
    if (!prettyResult) return;
    try {
      await navigator.clipboard.writeText(prettyResult);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Clipboard access was blocked. You can still select and copy the result.");
    }
  }

  function downloadResult() {
    if (!prettyResult) return;
    const blob = new Blob([prettyResult], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = "scout-extraction.json";
    anchor.click();
    URL.revokeObjectURL(href);
  }

  return (
    <main className="site-shell">
      <nav className="topbar">
        <a className="brand" href="#" aria-label="Scout home">
          <span className="brand-mark"><Sparkles size={19} strokeWidth={2.4} /></span>
          <span>scout<span className="brand-period">.</span></span>
        </a>
        <div className="nav-center"><span className="status-dot" /> AI data workspace</div>
        <a className="top-link" href="#how-it-works">How it works <ArrowUpRight size={15} /></a>
      </nav>

      <section className="hero">
        <div className="eyebrow"><span className="eyebrow-icon"><WandSparkles size={14} /></span> YOUR WEB RESEARCH, ON AUTOPILOT</div>
        <h1>Find the useful stuff.<br /><span>Skip the busywork.</span></h1>
        <p className="hero-copy">
          Turn a public webpage into organised, ready-to-use data. Tell Scout what you need,
          and let AI do the sorting.
        </p>
        <div className="hero-notes">
          <span><Check size={14} /> Plain-English instructions</span>
          <span><Check size={14} /> Structured results</span>
          <span><Check size={14} /> Download as JSON</span>
        </div>
      </section>

      <section className="workspace" aria-label="Website data extraction workspace">
        <div className="workspace-heading">
          <div>
            <div className="section-kicker">WORKSPACE <span>01</span></div>
            <h2>What are we looking for?</h2>
            <p>Start with a public webpage and describe the information you want to collect.</p>
          </div>
          <div className="workspace-icon"><Globe2 size={22} /></div>
        </div>

        <form className="extract-form" onSubmit={runExtraction}>
          <label htmlFor="site-url">Website URL <span className="label-hint">Where should Scout look?</span></label>
          <div className="url-field">
            <Globe2 size={18} />
            <input
              id="site-url"
              type="url"
              placeholder="https://example.com/products"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              required
              maxLength={2048}
              autoComplete="url"
            />
            <span className="url-chip">PUBLIC PAGE</span>
          </div>

          <div className="prompt-heading">
            <label htmlFor="extraction-prompt">What should Scout find?</label>
            <span className="label-hint">Be as specific as you like</span>
          </div>
          <textarea
            id="extraction-prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="For example: Find each product name, price, rating, and product link."
            rows={4}
            required
            minLength={8}
            maxLength={1200}
          />
          <div className="prompt-footer"><span>Not sure what to ask? Try a starter below.</span><span>{prompt.length}/1200</span></div>

          <div className="examples">
            {examples.map((example) => (
              <button className={prompt === example.prompt ? "example-pill selected" : "example-pill"} key={example.label} type="button" onClick={() => setPrompt(example.prompt)}>
                <span className="pill-spark">✳</span>{example.label}
              </button>
            ))}
          </div>

          {error && <div className="error-box" role="alert"><CircleHelp size={18} /><span>{error}</span></div>}

          <button className="submit-button" type="submit" disabled={busy}>
            {busy ? <><LoaderCircle className="spin" size={18} /> Scout is exploring…</> : <><Sparkles size={18} /> Extract my data <ArrowUpRight size={17} /></>}
          </button>
          <div className="privacy-note"><LockKeyhole size={13} /> Your Groq API key stays on the server. Only use pages you’re allowed to access.</div>
        </form>
      </section>

      <section className="results-section" aria-live="polite">
        <div className="results-heading">
          <div>
            <div className="section-kicker">YOUR FINDINGS <span>02</span></div>
            <h2>Results, without the mess.</h2>
          </div>
          {result && <div className="result-count"><span className="status-dot" /> Extraction complete</div>}
        </div>

        {!result && !busy && (
          <div className="empty-state">
            <div className="empty-art">
              <div className="art-card art-card-back"><span /><span /><span /></div>
              <div className="art-card art-card-front"><FileJson2 size={32} /><span className="art-line long" /><span className="art-line" /><span className="art-line short" /></div>
              <span className="art-star star-one">✳</span><span className="art-star star-two">✦</span>
            </div>
            <h3>Your data will land here.</h3>
            <p>Run an extraction and Scout will organise the results into readable JSON you can copy or download.</p>
          </div>
        )}

        {busy && (
          <div className="loading-state">
            <div className="loading-orb"><LoaderCircle className="spin" size={26} /></div>
            <h3>Taking a closer look…</h3>
            <p>Scout is reading the page, cleaning up the clutter, and asking AI to structure the useful details.</p>
            <div className="loading-steps"><span className="step-active">Read page</span><span>Organise data</span><span>Prepare results</span></div>
          </div>
        )}

        {result && (
          <div className="result-panel">
            <div className="result-summary">
              <div className="result-file-icon"><FileJson2 size={23} /></div>
              <div className="result-file-info">
                <strong>{result.sourceTitle || "Website extraction"}</strong>
                <span>{result.itemsFound ?? "Structured"} {typeof result.itemsFound === "number" ? (result.itemsFound === 1 ? "item" : "items") : "result"} · JSON data</span>
                {result.sourceUrl && <a href={result.sourceUrl} target="_blank" rel="noreferrer">{result.sourceUrl} <ExternalLink size={12} /></a>}
              </div>
              <div className="result-actions">
                <button type="button" className="icon-button" onClick={copyResult} title="Copy JSON">{copied ? <Check size={16} /> : <Clipboard size={16} />}<span>{copied ? "Copied" : "Copy"}</span></button>
                <button type="button" className="download-button" onClick={downloadResult}><ArrowDownToLine size={16} /> Download</button>
              </div>
            </div>
            <div className="code-header"><span><span className="code-dot" /> JSON PREVIEW</span><span>{prettyResult.length.toLocaleString()} characters</span></div>
            <pre className="json-output"><code>{prettyResult}</code></pre>
            <div className="result-footnote"><Check size={14} /> Ready to use in a spreadsheet, script, or your next project.</div>
          </div>
        )}
      </section>

      <section className="how-section" id="how-it-works">
        <div className="how-intro">
          <div className="section-kicker">SMALL STEPS, USEFUL DATA</div>
          <h2>Three steps.<br /><span>One less headache.</span></h2>
          <p>No coding or complicated filters required. Just tell Scout what matters to you.</p>
        </div>
        <div className="how-steps">
          <article className="how-step"><div className="step-number">01</div><div className="step-icon peach"><Globe2 size={20} /></div><h3>Choose a page</h3><p>Paste the URL of a public page you’re permitted to access.</p></article>
          <article className="how-step"><div className="step-number">02</div><div className="step-icon lilac"><MousePointer2 size={20} /></div><h3>Say what you need</h3><p>Ask for names, prices, dates, links, or any useful fields.</p></article>
          <article className="how-step"><div className="step-number">03</div><div className="step-icon mint"><Code2 size={20} /></div><h3>Use your results</h3><p>Review the structured output, copy it, or download a JSON file.</p></article>
        </div>
      </section>

      <footer className="footer">
        <a className="brand footer-brand" href="#"><span className="brand-mark"><Sparkles size={16} /></span><span>scout<span className="brand-period">.</span></span></a>
        <span>Less digging. More doing.</span>
        <span className="footer-powered">Made with <span>✳</span> AI</span>
      </footer>
    </main>
  );
}