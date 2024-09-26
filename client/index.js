import { adapters } from './widgets.js';

for (const [name, adapter] of Object.entries(adapters)) {
  window.telepath.register(name, adapter);
}
