import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  IconDefinition,
  faNetworkWired,
  faDatabase,
  faRobot,
  faMusic,
  faPlay,
  faFilm,
  faBook,
  faGamepad,
  faTools
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faNetworkWired,
  faDatabase,
  faRobot,
  faMusic,
  faPlay,
  faFilm,
  faBook,
  faGamepad,
  faTools
);

const iconMap: Record<string, IconDefinition> = {
  networkWired: faNetworkWired,
  database: faDatabase,
  robot: faRobot,
  music: faMusic,
  play: faPlay,
  film: faFilm,
  book: faBook,
  gamepad: faGamepad,
  tools: faTools
};

export const getIconByName = (iconName: string): IconDefinition | null => {
  return iconMap[iconName] || null;
};

export const IMG_PERFIL_PADRAO = '/user.svg';