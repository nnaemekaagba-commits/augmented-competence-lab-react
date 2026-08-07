import { useState } from 'react';
import { API_BASE_URL } from '../api.js';

export default function Research({ publications }) {
  const [activePublication, setActivePublication] = useState(null);

  return (
    <>
      <div className="page-head">
        <div className="eyebrow"><span className="node"></span>Research and Publication</div>
        <h2>Papers, projects, and preprints.</h2>
        <p>All work here sits under one research theme — Human-System Teaming.</p>
      </div>
      <div className="pub-list">
        {publications.length === 0 && (
          <div className="pub-card"><p>No entries yet.</p></div>
        )}
        {publications.slice().reverse().map((p) => (
          <div className="pub-card" key={p.id}>
            <div className="pub-main">
              <div className="pub-tag">{p.tag}</div>
              <h3>{p.title}</h3>
              <div className="pub-meta">{p.meta}</div>
              <div className="pub-abstract">{p.abstract}</div>
            </div>
            {p.hasFile ? (
              <div className="pub-actions">
                <div className="pub-note">Read-only viewer</div>
                <button className="pub-link" type="button" onClick={() => setActivePublication(p)}>
                  Read paper
                </button>
              </div>
            ) : (
              <span className="pub-link" style={{ opacity: 0.45, cursor: 'default' }}>No file</span>
            )}
          </div>
        ))}
      </div>
      {activePublication ? (
        <div className="pdf-modal-shell" role="dialog" aria-modal="true" aria-labelledby="pdf-reader-title">
          <div className="pdf-modal-backdrop" onClick={() => setActivePublication(null)}></div>
          <div className="pdf-modal">
            <div className="pdf-modal-head">
              <div>
                <div className="eyebrow"><span className="node"></span>Research paper</div>
                <h3 id="pdf-reader-title">{activePublication.title}</h3>
                <p>{activePublication.meta}</p>
              </div>
              <button className="pdf-close" type="button" onClick={() => setActivePublication(null)} aria-label="Close paper viewer">
                Close
              </button>
            </div>
            <div className="pdf-frame-wrap">
              <iframe
                className="pdf-frame"
                title={activePublication.title}
                src={`${API_BASE_URL}/publications/${activePublication.id}/file#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
              ></iframe>
            </div>
            <p className="pdf-disclaimer">
              This view is presented inline for reading. A determined visitor can still save the file from the browser or network tools, so this is a best-effort read-only experience rather than hard DRM.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
