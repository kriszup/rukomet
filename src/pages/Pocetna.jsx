import { useUcitaj } from '../hooks/useUcitaj.js';
import { ekipeServis, turniriServis } from '../services/index.js';
import { formatDatum } from '../utils/format.js';

export default function Pocetna({ idi }) {
  const ekipe = useUcitaj(ekipeServis);
  const turniri = useUcitaj(turniriServis);

  const brojIgraca = ekipe.stavke.reduce((zbroj, e) => zbroj + (e.igraci ?? []).length, 0);
  const brojUtakmica = turniri.stavke.reduce((zbroj, t) => zbroj + (t.rezultati ?? []).length, 0);
  const posljednji = [...turniri.stavke].sort((a, b) => b.datum.localeCompare(a.datum)).slice(0, 5);

  return (
    <>
      <h1>Evidencija ekipa i turnira</h1>

      <div className="kutije">
        <div className="kutija statistika">
          <b>{ekipe.stavke.length}</b>
          <span>Ekipa</span>
        </div>
        <div className="kutija statistika">
          <b>{brojIgraca}</b>
          <span>Igrača</span>
        </div>
        <div className="kutija statistika">
          <b>{turniri.stavke.length}</b>
          <span>Turnira</span>
        </div>
        <div className="kutija statistika">
          <b>{brojUtakmica}</b>
          <span>Odigranih utakmica</span>
        </div>
      </div>

      <div className="glava">
        <h2>Posljednji turniri</h2>
        <div className="alat bez-razmaka">
          <button className="gumb" onClick={() => idi('ekipe')}>
            Ekipe
          </button>
          <button className="gumb" onClick={() => idi('turniri')}>
            Turniri
          </button>
        </div>
      </div>

      <div className="kutija tablica-omot">
        {posljednji.length === 0 ? (
          <p className="prigusen popuna">Još nema turnira.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Turnir</th>
                <th>Datum</th>
                <th>Mjesto</th>
                <th>Plasman</th>
              </tr>
            </thead>
            <tbody>
              {posljednji.map((t) => (
                <tr key={t.sifra}>
                  <td>
                    <button className="veza" onClick={() => idi('turnir', t.sifra)}>
                      {t.naziv}
                    </button>
                  </td>
                  <td>{formatDatum(t.datum)}</td>
                  <td>{t.mjesto}</td>
                  <td>{t.osvojenoMjesto ? `${t.osvojenoMjesto}. mjesto` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
