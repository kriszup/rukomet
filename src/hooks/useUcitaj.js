import { useCallback, useEffect, useState } from 'react';

// Učitava zapise iz servisa i nudi osvjezi() nakon promjena
export function useUcitaj(servis) {
  const [stavke, setStavke] = useState([]);
  const [ucitano, setUcitano] = useState(false);

  const osvjezi = useCallback(async () => {
    const odgovor = await servis.get();
    setStavke(odgovor.data);
    setUcitano(true);
  }, [servis]);

  useEffect(() => {
    let aktivno = true;
    servis.get().then((odgovor) => {
      if (aktivno) {
        setStavke(odgovor.data);
        setUcitano(true);
      }
    });
    return () => {
      aktivno = false;
    };
  }, [servis]);

  return { stavke, ucitano, osvjezi };
}
