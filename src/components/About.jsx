import { ReasoningNode } from './Icons.jsx';

const PILLARS = [
  { title: 'Learning', body: 'We study how people build lasting understanding when an interactive system is part of the process, not just the outcome.' },
  { title: 'Reasoning', body: 'We trace how explanations get formed, tested, and revised in human-system exchanges.' },
  { title: 'Problem-solving', body: 'We focus on open-ended tasks, where the path to a solution has to be constructed, not recalled.' },
];

export default function About() {
  return (
    <>
      <div className="page-head">
        <div className="eyebrow"><span className="node"></span>About</div>
        <h2>Why the lab exists.</h2>
      </div>
      <div className="about-wrap">
        <p className="about-mission">
          We study how people reason together with interactive systems and tools, not AI alone, and use what we learn to
          design technologies that make STEM learners better problem-solvers, not just faster ones. Our work is grounded
          in a posthumanist ideology: we treat human and technological agency as entangled rather than separate, and
          design accordingly.
        </p>
        <div className="pillars">
          {PILLARS.map((p) => (
            <div className="pillar" key={p.title}>
              <div className="theme-node"><ReasoningNode size={26} /></div>
              <h4>{p.title}</h4>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
