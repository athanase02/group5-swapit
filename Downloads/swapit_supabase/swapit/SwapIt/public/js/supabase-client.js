// public/js/supabase-client.js
// Purpose: Initialize Supabase client in the browser in a way that works for
// both classic <script> includes and module scripts. It uses a runtime
// dynamic import of the ESM bundle and exposes `window.supabase` and
// `window.SUPABASE_READY` (a promise that resolves when ready).

// Default configuration (can be overridden by setting window.__SUPABASE_CONFIG__
// before loading this script).
const DEFAULT_CONFIG = {
  url: 'https://qgnsseawrxumdavlrrsk.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnbnNzZWF3cnh1bWRhdmxycnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg1ODkxMjAsImV4cCI6MjAxNDE2NTEyMH0.gC586ntvlzI0a3K3WOMXWgwGqw5X21TjOxPJ-EmWHsw'
};

const cfg = (typeof window !== 'undefined' && window.__SUPABASE_CONFIG__) ? window.__SUPABASE_CONFIG__ : DEFAULT_CONFIG;

// Expose a promise so other scripts can await the client being ready.
let resolveReady;
window.SUPABASE_READY = new Promise((res)=>{ resolveReady = res; });

// Initialize client using dynamic import so this file can be loaded without
// type="module" and still retrieve the ESM bundle at runtime.
(async function initSupabase(){
  try {
    const pkg = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
    const createClient = pkg.createClient || pkg.default?.createClient || pkg.createClient;
    if (!createClient) throw new Error('createClient not available from supabase bundle');

    const supabase = createClient(cfg.url, cfg.anonKey);

    if (typeof window !== 'undefined') {
      window.supabase = supabase;
      window.SUPABASE_CONFIG = { url: cfg.url, anonKey: cfg.anonKey };
    }

    resolveReady({ supabase });
  } catch (err) {
    console.error('Could not initialize Supabase client:', err);
    resolveReady({ error: err });
  }
})();

/*
Notes:
- To override the URL/key at runtime, include a small script before this file:

  <script>
    window.__SUPABASE_CONFIG__ = { url: 'https://your-project.ref.supabase.co', anonKey: '...anon...' };
  </script>

- This script exposes `window.supabase` (the client) and `window.SUPABASE_READY`
  (a Promise that resolves when initialization finishes). Other scripts that
  call Supabase should await `window.SUPABASE_READY` or check `window.supabase`.
*/