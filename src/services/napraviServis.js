// Jednostavan "servis" koji podatke drži u memoriji i sprema u localStorage.
// Svaki zapis ima numeričku šifru (sifra).

async function ucitaj(kljuc, pocetno) {
  try {
    const spremljeno = localStorage.getItem(kljuc);
    if (spremljeno) {
      const podaci = JSON.parse(spremljeno);
      if (Array.isArray(podaci)) return podaci;
    }
  } catch {
    // neispravni podaci ili blokiran localStorage: koristimo početne podatke
  }
  return structuredClone(pocetno);
}

async function spremi(kljuc, podaci) {
  try {
    localStorage.setItem(kljuc, JSON.stringify(podaci));
    return true;
  } catch {
    return false;
  }
}

export function napraviServis(kljuc, pocetno) {
  let podaci = [];
  let obecanje = null;

  // Učitava se samo jednom, pri prvom korištenju
  function osiguraj() {
    obecanje ??= ucitaj(kljuc, pocetno).then((p) => {
      podaci = p;
    });
    return obecanje;
  }

  const sljedecaSifra = () => podaci.reduce((max, z) => Math.max(max, z.sifra), 0) + 1;

  async function get() {
    await osiguraj();
    return { data: [...podaci] };
  }

  async function getBySifra(sifra) {
    await osiguraj();
    return { data: podaci.find((z) => z.sifra === parseInt(sifra)) };
  }

  async function dodaj(zapis) {
    await osiguraj();
    podaci = [...podaci, { ...zapis, sifra: sljedecaSifra() }];
    return spremi(kljuc, podaci);
  }

  async function promijeni(sifra, promjene) {
    await osiguraj();
    podaci = podaci.map((z) => (z.sifra === parseInt(sifra) ? { ...z, ...promjene } : z));
    return spremi(kljuc, podaci);
  }

  async function obrisi(sifra) {
    await osiguraj();
    podaci = podaci.filter((z) => z.sifra !== parseInt(sifra));
    return spremi(kljuc, podaci);
  }

  return { get, getBySifra, dodaj, promijeni, obrisi };
}
