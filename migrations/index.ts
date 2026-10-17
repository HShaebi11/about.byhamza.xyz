import * as migration_20261017_132216_init from './20261017_132216_init';

export const migrations = [
  {
    up: migration_20261017_132216_init.up,
    down: migration_20261017_132216_init.down,
    name: '20261017_132216_init'
  },
];
