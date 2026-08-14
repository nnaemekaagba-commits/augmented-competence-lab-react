import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Home from './components/Home.jsx';
import Research from './components/Research.jsx';
import News from './components/News.jsx';
import Blogs from './components/Blogs.jsx';
import Team from './components/Team.jsx';
import About from './components/About.jsx';
import Admin from './components/Admin.jsx';
import { api, API_BASE_URL } from './api.js';

export default function App() {
  const [view, setView] = useState('home');
  const [publications, setPublications] = useState([]);
  const [news, setNews] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [team, setTeam] = useState([]);
  const [apiError, setApiError] = useState(false);

  async function refreshSiteData() {
    try {
      const [pubs, newsData, blogData, teamData] = await Promise.all([
        api.getPublications(), api.getNews(), api.getBlogs(), api.getTeam(),
      ]);
      setPublications(pubs);
      setNews(newsData);
      setBlogs(blogData);
      setTeam(teamData);
      setApiError(false);
    } catch (err) {
      console.error('Could not reach the API at ' + API_BASE_URL, err);
      setApiError(true);
    }
  }

  useEffect(() => {
    refreshSiteData();
  }, []);

  // All sections stay mounted at once (shown/hidden via CSS), so Admin's
  // login state survives switching tabs — same behavior as the static version.
  return (
    <>
      <Header view={view} setView={setView} />

      <section className={'view' + (view === 'home' ? ' active' : '')}>
        <Home setView={setView} publications={publications} news={news} blogs={blogs} />
      </section>

      <section className={'view' + (view === 'research' ? ' active' : '')}>
        {apiError ? <ApiErrorNotice /> : <Research publications={publications} />}
      </section>

      <section className={'view' + (view === 'news' ? ' active' : '')}>
        {apiError ? <ApiErrorNotice /> : <News news={news} />}
      </section>

      <section className={'view' + (view === 'blogs' ? ' active' : '')}>
        {apiError ? <ApiErrorNotice /> : <Blogs blogs={blogs} />}
      </section>

      <section className={'view' + (view === 'team' ? ' active' : '')}>
        {apiError ? <ApiErrorNotice /> : <Team team={team} />}
      </section>

      <section className={'view' + (view === 'about' ? ' active' : '')}>
        <About />
      </section>

      <section className={'view' + (view === 'admin' ? ' active' : '')}>
        <Admin
          publications={publications} setPublications={setPublications}
          news={news} setNews={setNews}
          blogs={blogs} setBlogs={setBlogs}
          team={team} setTeam={setTeam}
          refreshSiteData={refreshSiteData}
        />
      </section>

      <footer>Augmented Competence Lab &nbsp;·&nbsp; Advancing Human-System Interaction, System Thinking, and Problem-solving for STEM Education and Lifelong Learning</footer>
    </>
  );
}

function ApiErrorNotice() {
  return (
    <div className="page-head">
      <p>Could not reach the site's API. If you're the site owner, check that <code>VITE_API_BASE_URL</code> in your <code>.env</code> points to your deployed backend.</p>
    </div>
  );
}
