import { useState } from 'react';

// Opća stranica za popis + dodavanje/uređivanje/brisanje zapisa preko servisa.
export default function CrudStranica({
  naslov,
  novi,
  servis,
  stavke,
  osvjezi,
  fields,
  columns,
  validate,
  blokirajBrisanje,
  prazno,
  alat,
}) {
  const pocetnaVrijednost = (f) => f.default ?? (f.type !== 'checkbox' && '');

  const prazniObrazac = Object.fromEntries(fields.map((f) => [f.name, pocetnaVrijednost(f)]));
  const [obrazac, setObrazac] = useState(prazniObrazac);
  const [uredjuje, setUredjuje] = useState(null);
  const [greske, setGreske] = useState({});
  const [otvoreno, setOtvoreno] = useState(false);
  const [poruka, setPoruka] = useState('');

  const otvoriNovi = () => {
    setUredjuje(null);
    setObrazac(prazniObrazac);
    setGreske({});
    setPoruka('');
    setOtvoreno(true);
  };

  const otvoriUredi = (zapis) => {
    setUredjuje(zapis);
    setObrazac(Object.fromEntries(fields.map((f) => [f.name, zapis[f.name] ?? pocetnaVrijednost(f)])));
    setGreske({});
    setPoruka('');
    setOtvoreno(true);
  };

  const zatvori = () => {
    setOtvoreno(false);
    setUredjuje(null);
    setGreske({});
  };

  const promjena = (e) => setObrazac({ ...obrazac, [e.target.name]: e.target.value });

  async function posalji(e) {
    e.preventDefault();

    const novaGreske = {};
    fields.forEach((f) => {
      if (f.required && !String(obrazac[f.name]).trim()) novaGreske[f.name] = 'Obavezno polje';
    });
    if (Object.keys(novaGreske).length === 0 && validate) {
      Object.assign(novaGreske, validate(obrazac, uredjuje));
    }
    setGreske(novaGreske);
    if (Object.keys(novaGreske).length) return;

    const podaci = {};
    fields.forEach((f) => {
      const v = obrazac[f.name];
      if (f.type === 'number' || f.asNumber) podaci[f.name] = v === '' ? null : Number(v);
      else podaci[f.name] = typeof v === 'string' ? v.trim() : v;
    });

    const uspjeh = uredjuje
      ? await servis.promijeni(uredjuje.sifra, podaci)
      : await servis.dodaj(podaci);
    await osvjezi();

    if (uspjeh) zatvori();
    else setPoruka('Spremanje nije uspjelo. Preglednik možda blokira spremanje podataka.');
  }

  async function obrisi(zapis) {
    const razlog = blokirajBrisanje && blokirajBrisanje(zapis);
    if (razlog) {
      setPoruka(razlog);
      return;
    }
    if (!window.confirm('Jeste li sigurni da želite obrisati zapis?')) return;

    const uspjeh = await servis.obrisi(zapis.sifra);
    await osvjezi();
    setPoruka(uspjeh ? '' : 'Brisanje nije uspjelo. Preglednik možda blokira spremanje podataka.');
  }

  return (
    <section>
      <div className="glava">
        <h1>{naslov}</h1>
        {!otvoreno && (
          <button className="gumb" onClick={otvoriNovi}>
            + {novi}
          </button>
        )}
      </div>

      {poruka && <div className="upozorenje">{poruka}</div>}

      {otvoreno && (
        <form className="kutija obrazac" onSubmit={posalji} noValidate>
          <h2>{uredjuje ? 'Uredi zapis' : novi}</h2>
          <div className="mreza-obrasca">
            {fields.map((f) => (
              <label
                key={f.name}
                className={f.type === 'textarea' ? 'puna' : f.type === 'checkbox' ? 'kvacica' : ''}
              >
                {f.type === 'checkbox' ? (
                  <>
                    <input
                      name={f.name}
                      type="checkbox"
                      checked={!!obrazac[f.name]}
                      onChange={(e) => setObrazac({ ...obrazac, [f.name]: e.target.checked })}
                    />
                    {f.label}
                  </>
                ) : (
                  <>
                    {f.label}
                    {f.type === 'select' ? (
                      <select name={f.name} value={obrazac[f.name]} onChange={promjena}>
                        <option value="">{f.praznoOznaka ?? '— odaberite —'}</option>
                        {f.options.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    ) : f.type === 'textarea' ? (
                      <textarea
                        name={f.name}
                        rows={3}
                        value={obrazac[f.name]}
                        onChange={promjena}
                      />
                    ) : (
                      <input
                        name={f.name}
                        type={f.type || 'text'}
                        step={f.step}
                        value={obrazac[f.name]}
                        onChange={promjena}
                      />
                    )}
                  </>
                )}
                {greske[f.name] && <em>{greske[f.name]}</em>}
              </label>
            ))}
          </div>
          <div className="akcije">
            <button className="gumb" type="submit">
              Spremi
            </button>
            <button className="gumb sporedni" type="button" onClick={zatvori}>
              Odustani
            </button>
          </div>
        </form>
      )}

      {alat}

      <div className="kutija tablica-omot">
        {stavke.length === 0 ? (
          <p className="prigusen popuna">{prazno}</p>
        ) : (
          <table>
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.label}>{c.label}</th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {stavke.map((z) => (
                <tr key={z.sifra}>
                  {columns.map((c) => (
                    <td key={c.label}>{c.render ? c.render(z) : z[c.key]}</td>
                  ))}
                  <td className="akcije-reda">
                    <button className="veza" onClick={() => otvoriUredi(z)}>
                      Uredi
                    </button>
                    <button className="veza opasno" onClick={() => obrisi(z)}>
                      Obriši
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
