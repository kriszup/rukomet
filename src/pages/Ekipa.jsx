import TablicaZapisa from '../components/TablicaZapisa.jsx';
import { POZICIJE } from '../constants.js';
import { useUcitaj } from '../hooks/useUcitaj.js';
import { ekipeServis } from '../services/index.js';

export default function Ekipa({ sifra, idi }) {
  const ekipe = useUcitaj(ekipeServis);

  if (!ekipe.ucitano) return <p className="prigusen">Učitavanje...</p>;

  const ekipa = ekipe.stavke.find((e) => e.sifra === Number(sifra));
  if (!ekipa) {
    return (
      <p>
        Ekipa nije pronađena.{' '}
        <button className="veza" onClick={() => idi('ekipe')}>
          Natrag
        </button>
      </p>
    );
  }

  const igraci = ekipa.igraci ?? [];

  async function spremiIgrace(noviIgraci) {
    await ekipeServis.promijeni(ekipa.sifra, { igraci: noviIgraci });
    await ekipe.osvjezi();
  }

  // Broj dresa: cijeli broj 1-99 i jedinstven unutar ekipe
  function validate(obrazac, uredjuje) {
    const greske = {};
    const broj = Number(obrazac.brojDresa);
    if (!(Number.isInteger(broj) && broj >= 1 && broj <= 99)) {
      greske.brojDresa = 'Broj dresa mora biti između 1 i 99.';
    } else if (igraci.some((i) => i.sifra !== uredjuje?.sifra && i.brojDresa === broj)) {
      greske.brojDresa = `Broj dresa ${broj} već ima drugi igrač.`;
    }
    return greske;
  }

  return (
    <article>
      <button className="veza" onClick={() => idi('ekipe')}>
        ← Ekipe
      </button>
      <h1>{ekipa.naziv}</h1>
      <p className="prigusen">
        Godište {ekipa.godiste} · trener {ekipa.trener} · {ekipa.mjesto} · {igraci.length} igrača
      </p>

      <TablicaZapisa
        naslov="Igrači"
        novi="Novi igrač"
        stavke={[...igraci].sort((a, b) => a.brojDresa - b.brojDresa)}
        spremi={spremiIgrace}
        validate={validate}
        prazno="Ekipa još nema igrača."
        fields={[
          { name: 'ime', label: 'Ime', required: true },
          { name: 'prezime', label: 'Prezime', required: true },
          { name: 'brojDresa', label: 'Broj dresa', type: 'number', required: true },
          { name: 'pozicija', label: 'Pozicija', type: 'select', required: true, options: POZICIJE },
        ]}
        columns={[
          { key: 'brojDresa', label: 'Dres' },
          { label: 'Igrač', render: (i) => `${i.ime} ${i.prezime}` },
          { key: 'pozicija', label: 'Pozicija' },
        ]}
      />
    </article>
  );
}
