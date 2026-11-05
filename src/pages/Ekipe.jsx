import CrudStranica from '../components/CrudStranica.jsx';
import { useUcitaj } from '../hooks/useUcitaj.js';
import { ekipeServis, turniriServis } from '../services/index.js';

export default function Ekipe({ idi }) {
  const ekipe = useUcitaj(ekipeServis);
  const turniri = useUcitaj(turniriServis);

  const brojTurnira = (sifraEkipe) => turniri.stavke.filter((t) => t.ekipa === sifraEkipe).length;

  function validate(obrazac) {
    const greske = {};
    const godiste = Number(obrazac.godiste);
    if (!(godiste >= 1990 && godiste <= new Date().getFullYear())) {
      greske.godiste = 'Unesite ispravno godište.';
    }
    return greske;
  }

  return (
    <CrudStranica
      naslov="Ekipe"
      novi="Nova ekipa"
      servis={ekipeServis}
      stavke={ekipe.stavke}
      osvjezi={ekipe.osvjezi}
      prazno="Još nema ekipa."
      validate={validate}
      fields={[
        { name: 'naziv', label: 'Naziv ekipe', required: true },
        { name: 'godiste', label: 'Godište', type: 'number', required: true, default: 2017 },
        { name: 'trener', label: 'Trener', required: true },
        { name: 'mjesto', label: 'Mjesto', required: true },
        { name: 'aktivna', label: 'Aktivna ekipa', type: 'checkbox', default: true },
      ]}
      columns={[
        {
          label: 'Ekipa',
          render: (e) => (
            <button className="veza" onClick={() => idi('ekipa', e.sifra)}>
              {e.naziv}
            </button>
          ),
        },
        { key: 'godiste', label: 'Godište' },
        { key: 'trener', label: 'Trener' },
        { key: 'mjesto', label: 'Mjesto' },
        { label: 'Igrača', render: (e) => (e.igraci ?? []).length },
        {
          label: 'Status',
          render: (e) => (
            <span className={e.aktivna ? 'oznaka ok' : 'oznaka'}>
              {e.aktivna ? 'Aktivna' : 'Neaktivna'}
            </span>
          ),
        },
      ]}
      blokirajBrisanje={(e) =>
        brojTurnira(e.sifra) > 0 ? 'Ekipa ima turnire i ne može se obrisati.' : null
      }
    />
  );
}
