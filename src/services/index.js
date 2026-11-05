import { napraviServis } from './napraviServis.js';
import { POCETNE_EKIPE, POCETNI_TURNIRI } from '../data/pocetniPodaci.js';

export const ekipeServis = napraviServis('rk_ekipe', POCETNE_EKIPE);
export const turniriServis = napraviServis('rk_turniri', POCETNI_TURNIRI);
