export const POCETNE_EKIPE = [
  {
    sifra: 1,
    naziv: 'RK Primjer (demo)',
    godiste: 2017,
    trener: 'Ana Trenerić',
    mjesto: 'Osijek',
    aktivna: true,
    igraci: [
      { sifra: 1, ime: 'Ema', prezime: 'Primjerić', brojDresa: 7, pozicija: 'vanjska' },
      { sifra: 2, ime: 'Mia', prezime: 'Uzoritić', brojDresa: 10, pozicija: 'krilo' },
      { sifra: 3, ime: 'Eva', prezime: 'Demić', brojDresa: 1, pozicija: 'golman' },
    ],
  },
  {
    sifra: 2,
    naziv: 'RK Test (demo)',
    godiste: 2015,
    trener: 'Marko Probić',
    mjesto: 'Tenja',
    aktivna: false,
    igraci: [],
  },
];

export const POCETNI_TURNIRI = [
  {
    sifra: 1,
    naziv: 'Demo turnir mini rukometa',
    mjesto: 'Karlovac',
    datum: '2026-10-30',
    godiste: 2017,
    brojEkipa: 24,
    osvojenoMjesto: 1,
    ekipa: 1,
    zavrsen: true,
    rezultati: [
      { sifra: 1, protivnik: 'RK Primjer 1', goloviZa: 12, goloviProtiv: 8 },
      { sifra: 2, protivnik: 'RK Primjer 2', goloviZa: 10, goloviProtiv: 10 },
    ],
    priznanja: [
      { sifra: 1, tekst: 'Ema Primjerić – najbolja igračica turnira' },
      { sifra: 2, tekst: 'Ana Trenerić – najbolja trenerica' },
    ],
  },
];
