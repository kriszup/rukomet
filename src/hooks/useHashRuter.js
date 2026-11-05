import { useEffect, useState } from 'react';

// Jednostavno usmjeravanje preko hash-a: #/ekipa/1 -> { stranica: 'ekipa', param: '1' }
function procitajHash(stranice) {
  const [stranica, param] = window.location.hash.replace(/^#\/?/, '').split('/');
  return {
    stranica: stranice.some((s) => s.id === stranica) ? stranica : stranice[0].id,
    param: param ?? null,
  };
}

export function useHashRuter(stranice) {
  const [ruta, setRuta] = useState(() => procitajHash(stranice));

  useEffect(() => {
    const naPromjenu = () => setRuta(procitajHash(stranice));
    window.addEventListener('hashchange', naPromjenu);
    return () => window.removeEventListener('hashchange', naPromjenu);
  }, [stranice]);

  const idi = (stranica, param) => {
    window.location.hash = param == null ? `#/${stranica}` : `#/${stranica}/${param}`;
  };

  return { ...ruta, idi };
}
