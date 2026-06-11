'use client';

import { useState, useMemo } from 'react';
import { FIXTURES, GROUP_COLORS } from '../data/fixtures';

const groups = [...new Set(FIXTURES.filter(f => f.group !== '-').map(f => f.group))].sort();

const formatTime = (timeStr) => {
  const [hourStr, minute] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return { time: `${displayHour}:${minute}`, ampm };
};

export default function FixturesClient() {
  const [phase, setPhase] = useState('all');
  const [group, setGroup] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return FIXTURES.filter(f => {
      if (phase === 'group' && (f.ko || f.fin)) return false;
      if (phase === 'knockout' && !f.ko && !f.fin) return false;
      if (group !== 'all' && f.group !== group) return false;
      if (q && ![f.home, f.away, f.venue].some(s => s.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [phase, group, search]);

  const byDate = useMemo(() => {
    const map = {};
    filtered.forEach(f => {
      if (!map[f.date]) map[f.date] = [];
      map[f.date].push(f);
    });
    return map;
  }, [filtered]);

  return (
    <>
      <div className="controls">
        <select
          value={phase}
          onChange={e => { setPhase(e.target.value); if (e.target.value === 'knockout') setGroup('all'); }}
        >
          <option value="all">All phases</option>
          <option value="group">Group stage</option>
          <option value="knockout">Knockout rounds</option>
        </select>

        <select
          value={group}
          onChange={e => setGroup(e.target.value)}
          disabled={phase === 'knockout'}
        >
          <option value="all">All groups</option>
          {groups.map(g => (
            <option key={g} value={g}>Group {g}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search team or venue…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <span className="match-count">
          {filtered.length} match{filtered.length !== 1 ? 'es' : ''}
        </span>
      </div>

      <div id="fixtures">
        {filtered.length === 0 ? (
          <div className="empty">No matches found. Try adjusting your filters.</div>
        ) : (
          <>
            {Object.entries(byDate).map(([date, matches], dateIndex) => {
              const isFirstKO = phase === 'all' &&
                (matches[0].ko || matches[0].fin) &&
                !Object.entries(byDate).slice(0, dateIndex).some(([, ms]) => ms[0].ko || ms[0].fin);

              return (
                <div key={date}>
                  {isFirstKO && (
                    <div className="phase-heading">Knockout Stage</div>
                  )}
                  {dateIndex === 0 && phase !== 'knockout' && !matches[0].ko && !matches[0].fin && (
                    <div className="phase-heading">Group Stage</div>
                  )}
                  <div className="day-block">
                    <div className="day-label">{date}</div>
                    {matches.map((f, i) => {
                      const color = GROUP_COLORS[f.group] || 'transparent';
                      const rowClass = `match${f.fin ? ' final-match' : f.ko ? ' knockout' : ''}`;
                      return (
                        <div key={i} className={rowClass}>
                          <div className="match-time">
                            {formatTime(f.cat).time}
                            <span className="ampm">{formatTime(f.cat).ampm}</span>
                          </div>
                          <div className="team-home">{f.home}</div>
                          <div className="vs">vs</div>
                          <div className="team-away">{f.away}</div>
                          <div className="match-meta">
                            {f.group !== '-' && (
                              <div
                                className="group-badge"
                                style={{
                                  background: `${color}22`,
                                  color,
                                  border: `1px solid ${color}55`,
                                }}
                              >
                                GRP {f.group}
                              </div>
                            )}
                            <div className="match-venue">{f.venue}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      <style jsx>{`
        .controls {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 1.25rem;
          align-items: center;
        }
        .controls select,
        .controls input {
          background: var(--surface);
          color: var(--text);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 13px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.15s;
          cursor: pointer;
          -webkit-appearance: none;
          appearance: none;
        }
        .controls select {
          padding-right: 28px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%236b7a99' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
        }
        .controls select:focus,
        .controls input:focus { border-color: var(--accent); }
        .controls input { min-width: 160px; flex: 1; }
        .controls input::placeholder { color: var(--muted); }
        .controls select:disabled { opacity: 0.4; cursor: not-allowed; }

        .match-count {
          margin-left: auto;
          font-size: 12px;
          color: var(--muted);
          white-space: nowrap;
        }

        .phase-heading {
          font-family: 'Oswald', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent);
          margin: 2rem 0 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .phase-heading::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 16px;
          background: var(--accent);
          border-radius: 2px;
          flex-shrink: 0;
        }

        .day-block { margin-bottom: 1.25rem; }
        .day-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          padding: 0.4rem 0;
          margin-bottom: 6px;
          border-bottom: 1px solid var(--border);
        }

        .match {
          display: grid;
          grid-template-columns: 62px 1fr 30px 1fr 90px;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 10px;
          margin-bottom: 5px;
          transition: border-color 0.15s, background 0.15s;
          position: relative;
          overflow: hidden;
        }
        .match::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: transparent;
          transition: background 0.15s;
        }
        .match:hover { border-color: rgba(201,168,76,0.3); background: #1e2d44; }
        .match:hover::before { background: var(--accent); }
        .match.knockout::before { background: var(--green); }
        .match.final-match::before { background: var(--pink); }
        .match.final-match { border-color: rgba(224,107,139,0.3); background: #1f1a2e; }

        .match-time {
          font-size: 14px;
          font-weight: 600;
          color: var(--accent);
          white-space: nowrap;
          font-variant-numeric: tabular-nums;
        }
        .match-time .ampm {
          font-size: 10px;
          font-weight: 400;
          color: var(--muted);
          display: block;
          margin-top: 1px;
        }

        .team-home {
          font-size: 14px;
          font-weight: 500;
          color: var(--text);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .team-away {
          font-size: 14px;
          font-weight: 500;
          color: var(--text);
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .vs {
          font-size: 10px;
          color: var(--muted);
          text-align: center;
          font-weight: 600;
          letter-spacing: 0.05em;
        }
        .match-meta {
          text-align: right;
          overflow: hidden;
        }
        .match-venue {
          font-size: 11px;
          color: var(--muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .group-badge {
          display: inline-block;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.05em;
          padding: 2px 6px;
          border-radius: 4px;
          margin-bottom: 2px;
        }

        .empty {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--muted);
          font-size: 14px;
        }

        /* ── MOBILE ── */
        @media (max-width: 540px) {
          .match {
            grid-template-columns: 54px 1fr 22px 1fr 0px;
          }
          .match-meta { display: none; }
          .team-home, .team-away { font-size: 13px; }
          .controls { gap: 8px; }
          .controls select { flex: 1; min-width: 0; }
          .controls input { min-width: 0; width: 100%; }
          .match-count { width: 100%; margin-left: 0; text-align: right; }
        }
        @media (max-width: 380px) {
          .match {
            grid-template-columns: 50px 1fr 20px 1fr;
            padding: 8px 10px;
          }
          .match-time { font-size: 12px; }
          .team-home, .team-away { font-size: 12px; }
        }
      `}</style>
    </>
  );
}
