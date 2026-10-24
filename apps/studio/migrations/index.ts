import * as migration_20261017_132216_init from './20261017_132216_init';
import * as migration_20261023_040800_content_expansion from './20261023_040800_content_expansion';

export const migrations = [
  {
    up: migration_20261017_132216_init.up,
    down: migration_20261017_132216_init.down,
    name: '20261017_132216_init',
  },
  {
    up: migration_20261023_040800_content_expansion.up,
    down: migration_20261023_040800_content_expansion.down,
    name: '20261023_040800_content_expansion'
  },
];
