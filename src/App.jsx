import { AUTOR, NASLOV_APLIKACIJE, STRANICE } from './constants.js';
import { useHashRuter } from './hooks/useHashRuter.js';
import Ekipa from './pages/Ekipa.jsx';
import Ekipe from './pages/Ekipe.jsx';
import Pocetna from './pages/Pocetna.jsx';
import Turnir from './pages/Turnir.jsx';
import Turniri from './pages/Turniri.jsx';

export default function App() {
  const { stranica, param, idi } = useHashRuter(STRANICE);

  // Stavka izbornika je aktivna i kad je otvorena njezina detaljna stranica
  const jeAktivna = (id) =>
    id === stranica ||
    (id === 'ekipe' && stranica === 'ekipa') ||
    (id === 'turniri' && stranica === 'turnir');

  return (
    <>
      <header className="zaglavlje">
        <button className="logo" onClick={() => idi('pocetna')}>
          {NASLOV_APLIKACIJE}
          <span className="autor">{AUTOR}</span>
        </button>
        <nav className="izbornik">
          {STRANICE.filter((s) => s.izbornik).map((s) => (
            <button
              key={s.id}
              className={jeAktivna(s.id) ? 'aktivna' : ''}
              onClick={() => idi(s.id)}
            >
              {s.naziv}
            </button>
          ))}
        </nav>
      </header>

      <main className="sadrzaj">
        {stranica === 'ekipe' ? (
          <Ekipe idi={idi} />
        ) : stranica === 'ekipa' ? (
          <Ekipa sifra={param} idi={idi} />
        ) : stranica === 'turniri' ? (
          <Turniri idi={idi} />
        ) : stranica === 'turnir' ? (
          <Turnir sifra={param} idi={idi} />
        ) : (
          <Pocetna idi={idi} />
        )}
      </main>

      <footer className="podnozje">© {NASLOV_APLIKACIJE}</footer>
    </>
  );
}
