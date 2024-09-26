import { adapters as widgetAdapters } from './widgets.js';
import { adapters as formAdapters } from './forms.js';

for (const [name, adapter] of Object.entries(widgetAdapters)) {
  window.telepath.register(name, adapter);
}
for (const [name, adapter] of Object.entries(formAdapters)) {
    window.telepath.register(name, adapter);
}
