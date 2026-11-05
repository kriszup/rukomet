import { useState } from 'react';

// Tablica s obrascem za zapise ugniježđene u drugi zapis (igrači ekipe, rezultati i
// priznanja turnira). Cijeli popis `stavke` vraća se kroz `spremi` kad se nešto promijeni.
export default function TablicaZapisa({
  naslov,
  novi,
  stavke,
  spremi,
  fields,
  columns,
  validate,
  prazno,
}) {
  const prazniObrazac = Object.fromEntries(fields.map((f) => [f.name, f.default ?? '']));
  const [obrazac, setObrazac] = useState(prazniObrazac);
  const [uredjuje, setUredjuje] = useState(null);
  const [otvoreno, setOtvoreno] = useState(false);
  const [greske, setGreske] = useState({});

  const otvoriNovi = () => {
    setUredjuje(null);
    setObrazac(prazniObrazac);
    setGreske({});
    setOtvoreno(true);
  };

  const otvoriUredi = (zapis) => {
    setUredjuje(zapis);
    setObrazac(Object.fromEntries(fields.map((f) => [f.name, zapis[f.name] ?? ''])));
    setGreske({});
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
      podaci[f.name] = f.type === 'number' ? Number(v) : typeof v === 'string' ? v.trim() : v;
    });

    const sifra = stavke.reduce((max, z) => Math.max(max, z.sifra), 0) + 1;
    await spremi(
      uredjuje
        ? stavke.map((z) => (z.sifra === uredjuje.sifra ? { ...z, ...podaci } : z))
        : [...stavke, { ...podaci, sifra }]
    );
    zatvori();
  }

  async function obrisi(zapis) {
    if (!window.confirm('Jeste li sigurni da želite obrisati zapis?')) return;
    await spremi(stavke.filter((z) => z.sifra !== zapis.sifra));
  }

  return (
    <section>
      <div className="glava">
        <h2>{naslov}</h2>
        {!otvoreno && (
          <button className="gumb" onClick={otvoriNovi}>
            + {novi}
          </button>
        )}
      </div>

      {otvoreno && (
        <form className="kutija obrazac" onSubmit={posalji} noValidate>
          <h3>{uredjuje ? 'Uredi zapis' : novi}</h3>
          <div className="mreza-obrasca">
            {fields.map((f) => (
              <label key={f.name}>
                {f.label}
                {f.type === 'select' ? (
                  <select name={f.name} value={obrazac[f.name]} onChange={promjena}>
                    <option value="">— odaberite —</option>
                    {f.options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={f.name}
                    type={f.type || 'text'}
                    value={obrazac[f.name]}
                    onChange={promjena}
                  />
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
