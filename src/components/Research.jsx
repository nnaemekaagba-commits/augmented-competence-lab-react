import { useEffect, useState } from 'react';
import { publicationFileUrl } from '../api.js';

function TextBlocks({ text }) {
  return String(text || '').split(/\r?\n+/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>);
}

export default function Research({ publications }) {
  const [activePublication, setActivePublication] = useState(null);
  const [showPdf, setShowPdf] = useState(false);
  function closePublication() { setActivePublication(null); setShowPdf(false); }

  useEffect(() => {
    function onKeyDown(event) { if (event.key === 'Escape') closePublication(); }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <div className="page-head">
        <div className="eyebrow"><span className="node"></span>Research and Publication</div>
        <h2>Papers, projects, and preprints.</h2>
        <p>Our work focuses on learning tools, learning resources, and self-directed learning.</p>
      </div>
      <div className="pub-list">
        {publications.length === 0 && <div className="pub-card"><p>No entries yet.</p></div>}
        {publications.slice().reverse().map((publication) => (
          <article className="pub-card" key={publication.id}>
            <div className="pub-main">
              <div className="pub-tag">{publication.tag}</div>
              <h3>{publication.title}</h3>
              <div className="pub-meta">{publication.meta}</div>
              <div className="pub-abstract pub-preview">{publication.abstract}</div>
            </div>
            <div className="pub-actions">
              <div className="pub-note">HTML summary</div>
              <button className="pub-link" type="button" onClick={() => { setActivePublication(publication); setShowPdf(false); }}>View details</button>
            </div>
          </article>
        ))}
      </div>

      {activePublication ? (
        <div className="detail-shell" role="dialog" aria-modal="true" aria-labelledby="publication-title">
          <button className="detail-backdrop" onClick={closePublication} aria-label="Close publication details"></button>
          <article className="detail-panel publication-detail">
            <header className="detail-head">
              <div>
                <div className="eyebrow"><span className="node"></span>{activePublication.tag || 'Research publication'}</div>
                <h2 id="publication-title">{activePublication.title}</h2>
                <p className="detail-citation">{activePublication.meta}</p>
              </div>
              <button className="detail-close" type="button" onClick={closePublication}>Close</button>
            </header>
            <div className="detail-toolbar">
              <button className={!showPdf ? 'active' : ''} type="button" onClick={() => setShowPdf(false)}>HTML overview</button>
              {activePublication.hasFile ? <button className={showPdf ? 'active' : ''} type="button" onClick={() => setShowPdf(true)}>Original PDF</button> : null}
              {activePublication.hasFile ? <a href={publicationFileUrl(activePublication.id)} target="_blank" rel="noreferrer">Open in new tab ↗</a> : null}
            </div>
            {showPdf && activePublication.hasFile ? (
              <div className="detail-pdf-wrap"><iframe className="detail-pdf" title={activePublication.title} src={`${publicationFileUrl(activePublication.id)}#view=FitH`}></iframe></div>
            ) : (
              <div className="publication-body">
                <aside className="publication-aside">
                  <span>Publication type</span><strong>{activePublication.tag || 'Research paper'}</strong>
                  <span>Available format</span><strong>{activePublication.hasFile ? 'HTML overview + PDF' : 'HTML overview'}</strong>
                </aside>
                <section className="publication-copy">
                  <div className="section-kicker">Abstract</div>
                  <TextBlocks text={activePublication.abstract} />
                </section>
              </div>
            )}
          </article>
        </div>
      ) : null}
    </>
  );
}
