// "2026-10-30" -> "30. 10. 2026."
export const formatDatum = (iso) => (iso ? iso.split('-').reverse().join('. ') + '.' : '');

export const danas = () => new Date().toISOString().slice(0, 10);

export const ishod = (goloviZa, goloviProtiv) =>
  goloviZa > goloviProtiv ? 'Pobjeda' : goloviZa < goloviProtiv ? 'Poraz' : 'Neriješeno';
