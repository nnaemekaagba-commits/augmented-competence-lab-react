import { monthYear } from '../api.js';

export default function News({ news }) {
  return (
    <>
      <div className="page-head">
        <div className="eyebrow"><span className="node"></span>News</div>
        <h2>Lab updates.</h2>
        <p>Grants, talks, awards, and new members.</p>
      </div>
      <div className="card-grid">
        {news.length === 0 && <div className="simple-card"><p>No news yet.</p></div>}
        {news.slice().reverse().map((n) => (
          <div className="simple-card" key={n.id}>
            <div className="meta">{monthYear(n.createdAt)}</div>
            <h3>{n.title}</h3>
            <p>{n.body}</p>
            <span className="go">Read more →</span>
          </div>
        ))}
      </div>
    </>
  );
}
