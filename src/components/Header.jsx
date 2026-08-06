import { useState } from 'react';
import { BurgerIcon, LockIcon } from './Icons.jsx';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'research', label: 'Research and Publication' },
  { id: 'news', label: 'News' },
  { id: 'blogs', label: 'Blogs' },
  { id: 'team', label: 'Team' },
  { id: 'about', label: 'About' },
];

export default function Header({ view, setView }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  function go(id) {
    setView(id);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  return (
    <header>
      <div className="nav-wrap">
        <div
          className="brand"
          role="button"
          tabIndex={0}
          title="Back to home"
          onClick={() => go('home')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go('home'); } }}
        >
          <span className="mark"><img src="/logo-icon.png" alt="Augmented Competence Lab" /></span>
          <span className="name">Augmented Competence Lab</span>
        </div>

        <div className="nav-right">
          <nav className="links">
            {NAV_ITEMS.map((item) => (
              <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => go(item.id)}>
                {item.label}
              </button>
            ))}
          </nav>

          <button
            className={'admin-link' + (view === 'admin' ? ' active' : '')}
            onClick={() => go('admin')}
            title="Lab admin"
          >
            <LockIcon size={13} /> Admin
          </button>

          <button className="burger" aria-label="Open menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen((o) => !o)}>
            <BurgerIcon />
          </button>
        </div>
      </div>

      <div className={'mobile-menu' + (mobileOpen ? ' open' : '')}>
        {NAV_ITEMS.map((item) => (
          <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => go(item.id)}>
            {item.label}
          </button>
        ))}
        <button
          className={'admin-link mobile' + (view === 'admin' ? ' active' : '')}
          onClick={() => go('admin')}
        >
          <LockIcon size={13} /> Admin
        </button>
      </div>
    </header>
  );
}
