'use strict';
(async () => {
  const out = document.createElement('pre');
  out.style.cssText = 'white-space:pre-wrap;padding:12px';
  document.body.appendChild(out);
  const log = s => out.textContent += s + '\n';
  const ids = {
    OP_STAT:'7d971cd2',
    BAT_LVL:'f4b68c11',
    DIA_STAT:'2b419d92',
    OP_ODO:'7d971cd3',
    SET_STAT:'bccae7e2',
    BAT_DIAG:'f4b68c14'
  };
  const btn = document.createElement('button');
  btn.textContent = 'UUIDs prüfen';
  document.body.appendChild(btn);
  btn.onclick = async () => {
    try {
      const dev = await navigator.bluetooth.requestDevice({
        acceptAllDevices:true,
        optionalServices:[
          '7d971cd0-8ebd-4684-b771-b2362b7e922a',
          'bccae7e0-458d-4554-8d8a-ddadd926efe3',
          '2b419d90-adef-4ca3-8652-c02093b6c84e',
          'f4b68c10-9e9e-4b97-a9c9-272e32453252'
        ]
      });
      const server = await dev.gatt.connect();
      const found = [];
      for (const svc of await server.getPrimaryServices()) {
        for (const c of await svc.getCharacteristics())
          found.push(c.uuid.toLowerCase());
      }
      log('Gefunden: ' + found.length);
      for (const [name,id] of Object.entries(ids)) {
        const matches = found.filter(u => u.startsWith(id));
        log(name + ': ' + (matches.join(', ') || 'NICHT GEFUNDEN'));
      }
      server.disconnect();
    } catch(e) { log('Fehler: ' + e.message); }
  };
})();
