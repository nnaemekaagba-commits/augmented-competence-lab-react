export default function Blogs({ blogs }) {
  return (
    <>
      <div className="page-head">
        <div className="eyebrow"><span className="node"></span>Blogs</div>
        <h2>Notes from the lab.</h2>
        <p>Longer-form reflections on our research and the field.</p>
      </div>
      <div className="card-grid">
        {blogs.length === 0 && <div className="simple-card"><p>No posts yet.</p></div>}
        {blogs.slice().reverse().map((b) => (
          <div className="simple-card" key={b.id}>
            <div className="meta">{b.read}</div>
            <h3>{b.title}</h3>
            <p>{b.body}</p>
            <span className="go">Read post →</span>
          </div>
        ))}
      </div>
    </>
  );
}
