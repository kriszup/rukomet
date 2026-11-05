import CrudStranica from '../components/CrudStranica.jsx';
import { useUcitaj } from '../hooks/useUcitaj.js';
import { ekipeServis, turniriServis } from '../services/index.js';
import { danas, formatDatum } from '../utils/format.js';

export default function Turniri({ idi }) {
  const turniri = useUcitaj(turniriServis);
  const ekipe = useUcitaj(ekipeServis);

  const nazivEkipe = (sifra) => ekipe.stavke.find((e) => e.sifra === sifra)?.naziv ?? '—';
  const poDatumu = [...turniri.stavke].sort((a, b) => b.datum.localeCompare(a.datum));

  function validate(obrazac) {
    const greske = {};
    if (!(Number(obrazac.brojEkipa) >= 2)) greske.brojEkipa = 'Turnir ima barem 2 ekipe.';
    if (
      obrazac.osvojenoMjesto !== '' &&
      obrazac.osvojenoMjesto !== null &&
      !(Number(obrazac.osvojenoMjesto) >= 1 && Number(obrazac.osvojenoMjesto) <= Number(obrazac.brojEkipa))
    ) {
      greske.osvojenoMjesto = 'Osvojeno mjesto mora biti između 1 i broja ekipa.';
    }
    return greske;
  }

  return (
    <CrudStranica
      naslov="Turniri"
      novi="Novi turnir"
      servis={turniriServis}
      stavke={poDatumu}
      osvjezi={turniri.osvjezi}
      prazno="Još nema turnira."
      validate={validate}
      fields={[
        { name: 'naziv', label: 'Naziv turnira', required: true },
        { name: 'mjesto', label: 'Mjesto održavanja', required: true },
        { name: 'datum', label: 'Datum', type: 'date', required: true, default: danas() },
        { name: 'godiste', label: 'Godište', type: 'number', required: true, default: 2017 },
        { name: 'brojEkipa', label: 'Broj ekipa', type: 'number', required: true },
        { name: 'osvojenoMjesto', label: 'Osvojeno mjesto', type: 'number' },
        {
          name: 'ekipa',
          label: 'Ekipa',
          type: 'select',
          asNumber: true,
          required: true,
          options: ekipe.stavke.map((e) => ({ value: e.sifra, label: e.naziv })),
        },
        { name: 'zavrsen', label: 'Turnir je završen', type: 'checkbox' },
      ]}
      columns={[
        {
          label: 'Turnir',
          render: (t) => (
            <button className="veza" onClick={() => idi('turnir', t.sifra)}>
              {t.naziv}
            </button>
          ),
        },
        { label: 'Datum', render: (t) => formatDatum(t.datum) },
        { key: 'mjesto', label: 'Mjesto' },
        { label: 'Ekipa', render: (t) => nazivEkipe(t.ekipa) },
        {
          label: 'Plasman',
          render: (t) => (t.osvojenoMjesto ? `${t.osvojenoMjesto}. od ${t.brojEkipa}` : '—'),
        },
        {
          label: 'Status',
          render: (t) => (
            <span className={t.zavrsen ? 'oznaka ok' : 'oznaka'}>
              {t.zavrsen ? 'Završen' : 'Najava'}
            </span>
          ),
        },
      ]}
    />
  );
}
