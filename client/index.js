import { adapters } from './widgets';

for (const [name, adapter] of Object.entries(adapters)) {
  window.telepath.register(name, adapter);
}
