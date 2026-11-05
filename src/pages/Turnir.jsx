import TablicaZapisa from '../components/TablicaZapisa.jsx';
import { useUcitaj } from '../hooks/useUcitaj.js';
import { turniriServis } from '../services/index.js';
import { formatDatum, ishod } from '../utils/format.js';

const provjeriGolove = (v) =>
  Number.isInteger(Number(v)) && Number(v) >= 0 ? null : 'Unesite cijeli broj golova (0 ili više).';

export default function Turnir({ sifra, idi }) {
  const turniri = useUcitaj(turniriServis);

  if (!turniri.ucitano) return <p className="prigusen">Učitavanje...</p>;

  const turnir = turniri.stavke.find((t) => t.sifra === Number(sifra));
  if (!turnir) {
    return (
      <p>
        Turnir nije pronađen.{' '}
        <button className="veza" onClick={() => idi('turniri')}>
          Natrag
        </button>
      </p>
    );
  }

  const rezultati = turnir.rezultati ?? [];
  const priznanja = turnir.priznanja ?? [];

  // Sprema promijenjeni popis (rezultati ili priznanja) u turnir
  async function spremi(polje, vrijednost) {
    await turniriServis.promijeni(turnir.sifra, { [polje]: vrijednost });
    await turniri.osvjezi();
  }

  const pobjede = rezultati.filter((r) => r.goloviZa > r.goloviProtiv).length;
  const porazi = rezultati.filter((r) => r.goloviZa < r.goloviProtiv).length;
  const goloviZa = rezultati.reduce((zbroj, r) => zbroj + r.goloviZa, 0);
  const goloviProtiv = rezultati.reduce((zbroj, r) => zbroj + r.goloviProtiv, 0);

  function validate(obrazac) {
    const greske = {};
    const za = provjeriGolove(obrazac.goloviZa);
    if (za) greske.goloviZa = za;
    const protiv = provjeriGolove(obrazac.goloviProtiv);
    if (protiv) greske.goloviProtiv = protiv;
    return greske;
  }

  return (
    <article>
      <button className="veza" onClick={() => idi('turniri')}>
        ← Turniri
      </button>
      <h1>{turnir.naziv}</h1>
      <p className="prigusen">
        {turnir.mjesto} · {formatDatum(turnir.datum)} · godište {turnir.godiste} · {turnir.brojEkipa}{' '}
        ekipa
        {turnir.osvojenoMjesto ? ` · osvojeno ${turnir.osvojenoMjesto}. mjesto` : ''}
      </p>

      <div className="kutije">
        <div className="kutija statistika">
          <b>{rezultati.length}</b>
          <span>Odigranih utakmica</span>
        </div>
        <div className="kutija statistika">
          <b>
            {pobjede} / {rezultati.length - pobjede - porazi} / {porazi}
          </b>
          <span>Pobjeda / neriješeno / poraza</span>
        </div>
        <div className="kutija statistika">
          <b>
            {goloviZa}:{goloviProtiv}
          </b>
          <span>Odnos golova</span>
        </div>
      </div>

      <TablicaZapisa
        naslov="Rezultati utakmica"
        novi="Nova utakmica"
        stavke={rezultati}
        spremi={(popis) => spremi('rezultati', popis)}
        validate={validate}
        prazno="Još nema upisanih utakmica."
        fields={[
          { name: 'protivnik', label: 'Protivnik', required: true },
          { name: 'goloviZa', label: 'Golovi naše ekipe', type: 'number', required: true },
          { name: 'goloviProtiv', label: 'Golovi protivnika', type: 'number', required: true },
        ]}
        columns={[
          { key: 'protivnik', label: 'Protivnik' },
          { label: 'Rezultat', render: (r) => `${r.goloviZa} : ${r.goloviProtiv}` },
          { label: 'Ishod', render: (r) => ishod(r.goloviZa, r.goloviProtiv) },
        ]}
      />

      <TablicaZapisa
        naslov="Priznanja"
        novi="Novo priznanje"
        stavke={priznanja}
        spremi={(popis) => spremi('priznanja', popis)}
        prazno="Još nema priznanja."
        fields={[{ name: 'tekst', label: 'Priznanje (npr. ime – najbolja igračica)', required: true }]}
        columns={[{ key: 'tekst', label: 'Priznanje' }]}
      />
    </article>
  );
}
