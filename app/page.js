import FixturesClient from '../components/FixturesClient';

export default function Home() {
  return (
    <>
      <header className="site-header">
        <div className="header-glow" />
        <div className="header-badge">🌍 Malawi Time (CAT · UTC+2)</div>
        <h1>FIFA World Cup <span>2026</span></h1>
        <p className="header-sub">All 104 fixtures · June 11 – July 19, 2026</p>
        <div className="header-meta">
          <span className="meta-pill">🏟 <strong>16</strong> Venues</span>
          <span className="meta-pill">🌐 <strong>48</strong> Teams</span>
          <span className="meta-pill">⚽ <strong>104</strong> Matches</span>
          <span className="meta-pill">🇺🇸🇲🇽🇨🇦 USA · Mexico · Canada</span>
        </div>
      </header>

      <main className="main-content">
        <FixturesClient />
      </main>

      <footer className="site-footer">
        Times converted from official FIFA Eastern Time (ET) schedule · CAT = ET + 6 hours
      </footer>    </>
  );
}
