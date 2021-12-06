console.log("hecho");

var cacheStatic = "cache-static-v2-danielat";
var cacheInmutable = "cache-inmutable-v1-danielat";
var cacheDinamyc = "cache-dinamyc-v1-danielat";

const files = [
  "public/css/style.css",
  "public/js/index.js",
  "index.html",
  "app.js",
];
const inmutable_files = [
  "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css",
];

self.addEventListener("install", (event) => {
  console.log("install SW");

  const guardarCacheStatic = caches
    .open(cacheStatic)
    .then((cache) => cache.addAll(files));

  const guardarCacheInmutable = caches
    .open(cacheInmutable)
    .then((cache) => cache.addAll(inmutable_files));

  event.waitUntil(Promise.all([guardarCacheStatic, guardarCacheInmutable]));
});

//network first
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).then((respuestaRed) => {
      return respuestaRed || caches.match(event.request);
    })
  );
});

//Actualizar cache
self.addEventListener("activate", (event) => {
  const cacheList = [cacheStatic, cacheInmutable, cacheDinamyc];

  console.log("Activado");
  event.waitUntil(
    caches.keys().then((cachesNames) =>
      cachesNames.map((cacheName) => {
        if (cacheList.indexOf(cacheName) === -1) {
          console.log("activado");
          return caches.delete(cacheName);
        }
      })
    )
  );
});

//
self.addEventListener("sync", (event) => {
  if (event.tad == "asesoria-pendiente") {
    event.waitUntil(asesoriasPendientes());
  }
});

function asesoriasPendientes() {
  const indexedDb = window.indexedDB;
  if (indexedDb) {
    let db;
    const request = indexedDb.open("listaAsesorias", 1);

    request.onsuccess = () => {
      db = request.result;
      console.log("OPEN", db);
      readData();
    };
    const readData = () => {
      const transaction = db.transaction(["asesorias"], "readonly");
      const objectStore = transaction.objectStore("asesorias");
      const request = objectStore.openCursor();

      request.onsuccess = (e) => {
        console.log(e.target);
        const cursor = e.target.result;
        if (cursor) {
          console.log(cursor.value);
          fetch("/api/asesoria", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: cursor.value,
          });
          cursor.continue();
        } else {
          console.log("No more data");
        }
      };
    };
  }
}
