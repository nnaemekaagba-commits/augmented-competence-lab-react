import { teamPhotoUrl } from '../api.js';

const GROUP_ORDER = [
  'Principal Investigator',
  'Postdoctoral Researchers',
  'PhD Students',
  'Undergraduate Research Assistants',
];

function initials(name) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2);
}

export default function Team({ team }) {
  const groups = GROUP_ORDER.map((g) => ({ group: g, members: team.filter((m) => m.group === g) })).filter(
    (g) => g.members.length
  );

  return (
    <>
      <div className="page-head">
        <div className="eyebrow"><span className="node"></span>Team</div>
        <h2>The people behind the lab.</h2>
        <p>The people behind the lab's research.</p>
      </div>
      {groups.length === 0 && (
        <div className="team-group"><p>No team members yet.</p></div>
      )}
      {groups.map((g) => (
        <div className="team-group" key={g.group}>
          <h3>{g.group}</h3>
          <div className="team-grid">
            {g.members.map((m) => (
              <div className="member" key={m.id}>
                <div className="avatar">
                  {m.hasPhoto ? (
                    <img src={teamPhotoUrl(m.id)} alt={m.name} />
                  ) : (
                    initials(m.name)
                  )}
                </div>
                <div className="mname">{m.name}</div>
                <div className="mrole">{m.role}</div>
                <div className="mfocus">{m.focus}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

export { GROUP_ORDER };
