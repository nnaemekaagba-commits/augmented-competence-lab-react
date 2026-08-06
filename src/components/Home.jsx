import { ReasoningNode, HeroTrace } from './Icons.jsx';
import { monthYear } from '../api.js';

export const THEME_NAME = 'Human-System Teaming';
const THEME = {
  name: THEME_NAME,
  blurb: 'How people and interactive systems — AI included, but not AI alone — coordinate, reason, and solve problems together.',
};
const FACETS = ['Learning', 'Reasoning', 'Problem-solving'];

export default function Home({ setView, publications, news, blogs }) {
  const latestPub = publications[publications.length - 1];
  const latestNews = news[news.length - 1];
  const latestBlog = blogs[blogs.length - 1];

  return (
    <>
      <div className="hero">
        <div className="hero-trace"><HeroTrace /></div>
        <div className="hero-inner">
          <div className="hero-top">
            <div className="hero-logo"><img src="/logo-icon.png" alt="Augmented Competence Lab" /></div>
            <div className="hero-title-block">
              <h1>Augmented Competence Lab</h1>
              <p>Advancing Human-System interaction, System Thinking, and Problem-solving for STEM Education and Lifelong Learning.</p>
            </div>
          </div>
          <div className="hero-nav-echo">
            <a href="#research" onClick={(e) => { e.preventDefault(); setView('research'); }}>Research and Publication</a>
            <a href="#news" onClick={(e) => { e.preventDefault(); setView('news'); }}>News</a>
            <a href="#blogs" onClick={(e) => { e.preventDefault(); setView('blogs'); }}>Blogs</a>
          </div>
        </div>
      </div>

      <div className="theme-spotlight">
        <div className="theme-spotlight-card">
          <div className="theme-spotlight-icon"><ReasoningNode size={56} /></div>
          <div className="theme-spotlight-body">
            <div className="eyebrow"><span className="node"></span>Our research theme</div>
            <h3>{THEME.name}</h3>
            <p>{THEME.blurb}</p>
            <div className="facet-row">
              {FACETS.map((f) => (
                <div className="facet-pill" key={f}><span className="fdot"></span>{f}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="home-feed">
        <div className="home-feed-head"><h2>From the lab</h2></div>
        <div className="feed-cols">
          <div className="feed-col">
            <div className="eyebrow"><span className="node"></span>Latest publication</div>
            {latestPub ? (
              <>
                <h4>{latestPub.title}</h4>
                <div className="meta">{latestPub.meta}</div>
                <div className="snippet">{latestPub.abstract}</div>
              </>
            ) : (
              <div className="snippet" style={{ marginTop: 12 }}>Nothing published yet.</div>
            )}
            <a className="go" href="#research" onClick={(e) => { e.preventDefault(); setView('research'); }}>Browse research →</a>
          </div>
          <div className="feed-col">
            <div className="eyebrow"><span className="node"></span>Latest news</div>
            {latestNews ? (
              <>
                <h4>{latestNews.title}</h4>
                <div className="meta">{monthYear(latestNews.createdAt)}</div>
                <div className="snippet">{latestNews.body}</div>
              </>
            ) : (
              <div className="snippet" style={{ marginTop: 12 }}>No news yet.</div>
            )}
            <a className="go" href="#news" onClick={(e) => { e.preventDefault(); setView('news'); }}>Read news →</a>
          </div>
          <div className="feed-col">
            <div className="eyebrow"><span className="node"></span>Latest blog</div>
            {latestBlog ? (
              <>
                <h4>{latestBlog.title}</h4>
                <div className="meta">{latestBlog.read}</div>
                <div className="snippet">{latestBlog.body}</div>
              </>
            ) : (
              <div className="snippet" style={{ marginTop: 12 }}>No posts yet.</div>
            )}
            <a className="go" href="#blogs" onClick={(e) => { e.preventDefault(); setView('blogs'); }}>Read blog →</a>
          </div>
        </div>
      </div>

      <div className="cta-band">
        <h2>See how we study human-system teaming.</h2>
        <div className="row">
          <button className="btn-mint" onClick={() => setView('research')}>Browse research</button>
          <button className="btn-ghost-navy" onClick={() => setView('team')}>Meet the team</button>
        </div>
      </div>
    </>
  );
}
