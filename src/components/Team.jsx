import { useEffect, useState } from 'react';
import { teamPhotoUrl } from '../api.js';

const GROUP_ORDER = ['Principal Investigator', 'Postdoctoral Researchers', 'PhD Students', 'Undergraduate Research Assistants'];

function initials(name) { return name.split(' ').map((word) => word[0]).join('').slice(0, 2); }

function MemberPhoto({ member, large = false }) {
  return <div className={large ? 'profile-photo' : 'avatar'}>{member.hasPhoto ? <img src={teamPhotoUrl(member.id)} alt={member.name} /> : initials(member.name)}</div>;
}

export default function Team({ team }) {
  const [activeMember, setActiveMember] = useState(null);
  const groups = GROUP_ORDER.map((group) => ({ group, members: team.filter((member) => member.group === group) })).filter((group) => group.members.length);

  useEffect(() => {
    function onKeyDown(event) { if (event.key === 'Escape') setActiveMember(null); }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <div className="page-head">
        <div className="eyebrow"><span className="node"></span>Team</div>
        <h2>The people behind the lab.</h2>
        <p>Meet the researchers developing resources and tools for self-directed learning.</p>
      </div>
      {groups.length === 0 && <div className="team-group"><p>No team members yet.</p></div>}
      {groups.map((group) => (
        <div className="team-group" key={group.group}>
          <h3>{group.group}</h3>
          <div className="team-grid">
            {group.members.map((member) => (
              <button className="member" type="button" key={member.id} onClick={() => setActiveMember(member)}>
                <MemberPhoto member={member} />
                <span className="mname">{member.name}</span>
                <span className="mrole">{member.group}</span>
                <span className="mfocus">{member.focus || member.role}</span>
                <span className="member-more">View profile →</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {activeMember ? (
        <div className="detail-shell" role="dialog" aria-modal="true" aria-labelledby="member-name">
          <button className="detail-backdrop" onClick={() => setActiveMember(null)} aria-label="Close team profile"></button>
          <article className="detail-panel profile-detail">
            <button className="detail-close profile-close" type="button" onClick={() => setActiveMember(null)}>Close</button>
            <div className="profile-intro">
              <MemberPhoto member={activeMember} large />
              <div>
                <div className="eyebrow"><span className="node"></span>{activeMember.group}</div>
                <h2 id="member-name">{activeMember.name}</h2>
                {activeMember.role && activeMember.role.length < 100 ? <p className="profile-position">{activeMember.role}</p> : null}
              </div>
            </div>
            <div className="profile-sections">
              {activeMember.role ? <section><div className="section-kicker">{activeMember.role.length < 100 ? 'Role' : 'Biography'}</div><p>{activeMember.role}</p></section> : null}
              {activeMember.focus ? <section><div className="section-kicker">Research focus</div><p>{activeMember.focus}</p></section> : null}
            </div>
          </article>
        </div>
      ) : null}
    </>
  );
}

export { GROUP_ORDER };
