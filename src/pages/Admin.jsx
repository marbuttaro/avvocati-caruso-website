import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, Eye, EyeOff, LogOut, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import './Admin.css';

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(null);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState(false);
  const [revision, setRevision] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState(null);
  const [preview, setPreview] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const dialog = useRef(null);
  const titleInput = useRef(null);
  const dirty = draft && ['title', 'content', 'subtitle', 'court', 'category'].some(key => draft[key] !== draft.original[key]);

  async function request(action, method = 'GET', body) {
    const response = await fetch(`/api/admin?action=${action}`, {
      method, credentials: 'same-origin', cache: 'no-store',
      ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}),
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401 && action !== 'login') setAuthenticated(false);
      throw new Error(data.error || 'La richiesta non è stata completata. Riprova.');
    }
    return data;
  }

  function updateArticles(data) { setArticles(data.articles); setCategories(data.categories || []); setRevision(data.revision); }

  useEffect(() => {
    let active = true;
    fetch('/api/admin?action=articles', { cache: 'no-store', credentials: 'same-origin' })
      .then(async response => {
        if (!active) return;
        if (response.status === 401) { setAuthenticated(false); return; }
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setArticles(data.articles); setCategories(data.categories || []); setRevision(data.revision); setAuthenticated(true);
      })
      .catch(() => { if (active) { setAuthenticated(false); setError('L’accesso non è disponibile. Riprova tra poco.'); } });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const warn = event => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  useEffect(() => { if (draft) titleInput.current?.focus(); }, [draft?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (deleting) dialog.current?.showModal(); }, [deleting]);

  async function login(event) {
    event.preventDefault(); setPending(true); setError('');
    try {
      await request('login', 'POST', { username, password });
      setPassword('');
      updateArticles(await request('articles'));
      setAuthenticated(true);
    } catch (failure) { setError(failure.message || 'Accesso non disponibile. Riprova tra poco.'); }
    finally { setPending(false); }
  }

  function openEditor(article) {
    if (dirty && !window.confirm('Vuoi lasciare le modifiche senza salvarle?')) return;
    const fields = Object.fromEntries(['title', 'content', 'subtitle', 'court', 'category'].map(key => [key, article?.[key] || '']));
    setDraft({ id: article?.id || null, ...fields, original: fields });
    setNewCategory(false);
    setPreview(false); setError(''); setNotice('');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function closeEditor() {
    if (dirty && !window.confirm('Vuoi lasciare le modifiche senza salvarle?')) return;
    setDraft(null); setError('');
  }

  async function save(event) {
    event.preventDefault(); setPending(true); setError(''); setNotice('');
    try {
      const data = await request('articles', draft.id ? 'PATCH' : 'POST', { id: draft.id, title: draft.title, content: draft.content, subtitle: draft.subtitle, court: draft.court, category: draft.category, revision });
      updateArticles(data); setDraft(null);
      setNotice(draft.id ? 'Le modifiche sono online.' : 'L’articolo è online.');
    } catch (failure) { setError(failure.message || 'Il salvataggio non è disponibile. Riprova tra poco.'); }
    finally { setPending(false); }
  }

  async function remove() {
    setPending(true); setError(''); setNotice('');
    try {
      updateArticles(await request('articles', 'DELETE', { id: deleting.id, revision }));
      if (draft?.id === deleting.id) setDraft(null);
      setNotice('L’articolo è stato eliminato dal sito.');
    } catch (failure) { setError(failure.message || 'L’articolo non è stato eliminato. Riprova.'); }
    finally { setPending(false); setDeleting(null); }
  }

  async function refresh() {
    setPending(true); setError('');
    try { updateArticles(await request('articles')); setNotice('L’elenco è aggiornato.'); }
    catch (failure) { setError(failure.message || 'L’elenco non è disponibile. Riprova.'); }
    finally { setPending(false); }
  }

  async function logout() {
    if (dirty && !window.confirm('Vuoi uscire senza salvare le modifiche?')) return;
    setPending(true); setError('');
    try { await request('logout', 'POST', {}); setAuthenticated(false); setDraft(null); setArticles([]); setNotice(''); }
    catch (failure) { setError(failure.message || 'Non è stato possibile uscire. Riprova.'); }
    finally { setPending(false); }
  }

  const filtered = articles.filter(article => `${article.title} ${article.subtitle || ''} ${article.court || ''} ${article.category || ''} ${article.content}`.toLocaleLowerCase('it').includes(search.toLocaleLowerCase('it')));

  return <div className="admin-shell">
    <header className="admin-header">
      <a href="/" className="admin-brand" aria-label="Caruso Avvocati, sito pubblico"><img src="/assets/lettering-navy.svg" alt="Caruso Avvocati" /></a>
      <div className="admin-header-actions">
        <a href="/news" target="_blank" rel="noreferrer">News sul sito <ArrowUpRight size={16} aria-hidden="true" /></a>
        {authenticated && <button type="button" className="admin-text-button" onClick={logout} disabled={pending}><LogOut size={16} aria-hidden="true" /> Esci</button>}
      </div>
    </header>

    <main className="admin-main" id="contenuto">
      {authenticated === null ? <p role="status" className="admin-loading">Verifica dell’accesso…</p> : !authenticated ? <div className="admin-login-layout">
        <div className="admin-login-intro"><span className="admin-eyebrow">Caruso Avvocati · Area riservata</span><h1>Le parole<br />dello studio.</h1><p>Pubblica e aggiorna gli approfondimenti<br className="admin-desktop-break" /> di Caruso Avvocati.</p><span className="admin-intro-rule" /></div>
        <form className="admin-login-form" onSubmit={login}>
          <h2>Accesso amministratore</h2>
          {error && <p className="admin-error" role="alert">{error}</p>}
          {draft && <p className="admin-hint">Accedi di nuovo per riprendere il testo che stavi scrivendo.</p>}
          <label htmlFor="admin-username">Nome utente</label>
          <input id="admin-username" name="username" autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} required maxLength={100} autoCapitalize="none" spellCheck="false" />
          <label htmlFor="admin-password">Password</label>
          <div className="admin-password"><input id="admin-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required maxLength={256} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button></div>
          <button className="admin-button" disabled={pending}>{pending ? 'Accesso in corso…' : 'Accedi'} <ArrowUpRight size={20} aria-hidden="true" /></button>
        </form>
      </div> : <>
        <div className="admin-page-heading"><div><span className="admin-eyebrow">Area riservata · News</span><h1>{draft ? draft.id ? 'Modifica articolo' : 'Nuovo articolo' : 'Articoli'}</h1></div>{!draft && <button className="admin-button" onClick={() => openEditor()} disabled={pending}><Plus size={19} aria-hidden="true" /> Nuovo articolo</button>}{draft && <button className="admin-text-button" onClick={closeEditor} disabled={pending}><X size={18} aria-hidden="true" /> Chiudi</button>}</div>
        {error && <div className="admin-error" role="alert"><p>{error}</p><button className="admin-text-button" onClick={refresh} disabled={pending}>Ricarica l’elenco</button></div>}
        {notice && <p className="admin-notice" role="status"><Check size={18} aria-hidden="true" /> {notice}</p>}
        {draft ? <form className="admin-editor" onSubmit={save}>
          <div className="admin-editor-toolbar"><span className="admin-hint">{draft.id ? 'Le modifiche saranno visibili dopo il salvataggio.' : 'La pubblicazione rende l’articolo visibile sul sito.'}</span><button type="button" className="admin-text-button" onClick={() => setPreview(!preview)} aria-pressed={preview}><Eye size={17} aria-hidden="true" /> {preview ? 'Torna al testo' : 'Anteprima'}</button></div>
          <div hidden={preview} className="admin-fields"><label htmlFor="article-title">Titolo</label><input ref={titleInput} id="article-title" className="admin-title-input" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} maxLength={240} required disabled={pending} /><label htmlFor="article-subtitle">Sottotitolo <span className="admin-hint">(facoltativo)</span></label>
            <input id="article-subtitle" value={draft.subtitle} onChange={e => setDraft({ ...draft, subtitle: e.target.value })} maxLength={1000} disabled={pending} />
            <label htmlFor="article-court">Ente emittente <span className="admin-hint">(facoltativo)</span></label>
            <input id="article-court" value={draft.court} onChange={e => setDraft({ ...draft, court: e.target.value })} maxLength={300} placeholder="Es. Tribunale di Napoli, Sezione Penale" disabled={pending} />
            <label htmlFor="article-category">Categoria <span className="admin-hint">(facoltativa)</span></label>
            <select id="article-category" value={newCategory ? '__new__' : draft.category ? `category:${draft.category}` : ''} onChange={e => { setNewCategory(e.target.value === '__new__'); setDraft({ ...draft, category: e.target.value === '__new__' ? '' : e.target.value.replace(/^category:/, '') }); }} disabled={pending}>
              <option value="">Nessuna categoria</option>
              {categories.map(category => <option key={category} value={`category:${category}`}>{category}</option>)}
              <option value="__new__">+ Crea nuova categoria</option>
            </select>
            {newCategory && <div className="admin-new-category">
              <label htmlFor="article-new-category">Nome della nuova categoria</label>
              <input id="article-new-category" value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })} maxLength={100} required disabled={pending} aria-describedby="category-hint" />
              <p id="category-hint" className="admin-hint">Sarà disponibile anche per gli altri articoli dopo il salvataggio.</p>
            </div>}
            <label htmlFor="article-content">Testo</label><textarea id="article-content" value={draft.content} onChange={e => setDraft({ ...draft, content: e.target.value })} maxLength={100000} required rows={16} disabled={pending} /><span className="admin-hint">I paragrafi e gli a capo vengono mantenuti.</span></div>
          {preview && <article className="admin-preview"><span className="admin-eyebrow">Anteprima dell’articolo</span><h2>{draft.title || 'Titolo da scrivere'}</h2>{draft.subtitle && <p className="admin-preview-subtitle">{draft.subtitle}</p>}{draft.category && <p className="admin-preview-category">{draft.category}</p>}{draft.court && <p className="admin-preview-court">Ente emittente: {draft.court}</p>}{draft.content ? draft.content.split(/\n\s*\n/).map((paragraph, i) => <p key={i}>{paragraph}</p>) : <p>Il testo dell’articolo è ancora vuoto.</p>}</article>}
          <div className="admin-editor-footer"><button className="admin-text-button" type="button" onClick={closeEditor} disabled={pending}>Annulla</button><button className="admin-button" type="submit" disabled={pending || !draft.title.trim() || !draft.content.trim() || (newCategory && !draft.category.trim())}>{pending ? 'Salvataggio…' : draft.id ? 'Salva modifiche' : 'Pubblica articolo'} <ArrowUpRight size={19} aria-hidden="true" /></button></div>
        </form> : <>
          <div className="admin-list-toolbar"><span>{articles.length} {articles.length === 1 ? 'articolo pubblicato' : 'articoli pubblicati'}</span><label className="admin-search"><Search size={18} aria-hidden="true" /><span className="visually-hidden">Cerca articoli</span><input type="search" placeholder="Cerca articoli" value={search} onChange={e => setSearch(e.target.value)} /></label></div>
          <div className="admin-articles">{filtered.map(article => <article className="admin-article-row" key={article.id}>
            <div className="admin-article-copy"><time>{article.date}</time>{article.category && <span className="admin-article-category"> · {article.category}</span>}<h2><button onClick={() => openEditor(article)}>{article.title}</button></h2><p>{article.content.replace(/\s+/g, ' ').slice(0, 180)}{article.content.length > 180 ? '…' : ''}</p></div>
            <div className="admin-row-actions"><a href={article.slug} target="_blank" rel="noreferrer" aria-label={`Leggi: ${article.title}`} title="Leggi sul sito"><ArrowUpRight size={20} /></a><button onClick={() => openEditor(article)} aria-label={`Modifica: ${article.title}`} title="Modifica articolo" disabled={pending}><Pencil size={18} /></button><button className="admin-delete-button" onClick={() => setDeleting(article)} aria-label={`Elimina: ${article.title}`} title="Elimina articolo" disabled={pending}><Trash2 size={18} /></button></div>
          </article>)}</div>
          {!filtered.length && <div className="admin-empty"><h2>{search ? 'Nessun articolo trovato' : 'Il prossimo approfondimento parte da qui.'}</h2><p>{search ? 'Prova con un altro titolo o una parola del testo.' : 'Pubblica il primo articolo dello studio.'}</p>{!search && <button className="admin-button" onClick={() => openEditor()}>Scrivi un articolo <Plus size={18} aria-hidden="true" /></button>}</div>}
        </>}
      </>}
    </main>
    <footer className="admin-footer"><span>Caruso Avvocati</span><span>Gestione editoriale</span></footer>
    {deleting && <dialog ref={dialog} className="admin-dialog" onCancel={event => { if (pending) event.preventDefault(); else setDeleting(null); }} aria-labelledby="delete-title" aria-describedby="delete-description"><h2 id="delete-title">Eliminare l’articolo?</h2><p className="admin-delete-title">{deleting.title}</p><p id="delete-description">Verrà rimosso dal sito. L’eliminazione è definitiva.</p><div className="admin-dialog-actions"><button className="admin-text-button" type="button" onClick={() => setDeleting(null)} disabled={pending} autoFocus>Annulla</button><button className="admin-button admin-danger" type="button" onClick={remove} disabled={pending}>{pending ? 'Eliminazione…' : 'Elimina articolo'}</button></div></dialog>}
  </div>;
}
