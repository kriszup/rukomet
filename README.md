# Rukomet: ekipe i turniri

Web aplikacija (React + Vite) za evidenciju rukometnih ekipa i turnira.

## Mogućnosti

- **Ekipe:** dodavanje, uređivanje i brisanje. Svaka ekipa ima popis igrača (ime, prezime, broj dresa, pozicija).
- **Turniri:** dodavanje, uređivanje i brisanje. Svaki turnir pripada jednoj ekipi i ima rezultate utakmica i priznanja.
- **Početna:** ukupan broj ekipa, igrača, turnira i utakmica te posljednji turniri.

## Podaci

Aplikacija nema bazu ni backend. Podaci se spremaju u `localStorage` preglednika (`rk_ekipe`, `rk_turniri`), pa su vidljivi samo na tom računalu.

Odnos: jedna ekipa može imati više turnira (1:N).

## Pokretanje

```bash
npm install
npm run dev
```

Izrada za objavu na webu:

```bash
npm run build
```

Sadržaj mape `dist/` učitava se na server.

## Struktura

```
src/
  pages/        stranice (Pocetna, Ekipe, Ekipa, Turniri, Turnir)
  components/   CrudStranica, TablicaZapisa
  hooks/        useUcitaj, useHashRuter
  services/     spremanje u localStorage
  data/         početni demo podaci
  utils/        formatiranje datuma i ishoda utakmice
```
