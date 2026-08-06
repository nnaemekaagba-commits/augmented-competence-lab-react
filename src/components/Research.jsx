import { API_BASE_URL } from '../api.js';

export default function Research({ publications }) {
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
            <div>
              <div className="pub-tag">{p.tag}</div>
              <h3>{p.title}</h3>
              <div className="pub-meta">{p.meta}</div>
              <div className="pub-abstract">{p.abstract}</div>
            </div>
            {p.hasFile ? (
              <a className="pub-link" href={`${API_BASE_URL}/publications/${p.id}/file`} target="_blank" rel="noopener noreferrer">View PDF</a>
            ) : (
              <span className="pub-link" style={{ opacity: 0.45, cursor: 'default' }}>No file</span>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
