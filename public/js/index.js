//apartado del indexedDb

const indexedDb = window.indexedDB;
const form = document.getElementById("form");

if (indexedDb && form) {
  let db;
  const request = indexedDb.open("listaAsesorias", 1);

  request.onsuccess = () => {
    db = request.result;
    console.log("OPEN", db);
    readData();
  };
  request.onupgradeneeded = () => {
    db = request.result;
    console.log("CREATE", db);

    const objectStore = db.createObjectStore("asesorias", {
      keyPath: "correo",
    });
  };

  request.onerror = (error) => {
    console.log("Error: ", error);
  };

  const addData = (data) => {
    const transaction = db.transaction(["asesorias"], "readwrite");
    const objectStore = transaction.objectStore("asesorias");
    const request = objectStore.add(data);
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
        cursor.continue();
      } else {
        console.log("No more data");
      }
    };
  };

  window.addEventListener("offline", () => {
    console.log("Sin conexion");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {
        nombre: e.target.nombre.value,
        grado: e.target.grado.value,
        grupo: e.target.grupo.value,
        plan: e.target.plan.value,
        correo: e.target.correo.value,
        docente: e.target.docente.value,
        materia: e.target.materia.value,
        tema: e.target.tema.value,
        nivel: e.target.nivel.value,
        tipo: e.target.tipo.value,
        dia: e.target.dia.value,
        hora: e.target.hora.value,
        motivo: e.target.motivo.value,
      };
      console.log(data);
      addData(data);
      window.addEventListener("online", () => {
        console.log("En linea");
      });
    });
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const asesoria = {
      nombre: e.target.nombre.value,
      grado: e.target.grado.value,
      grupo: e.target.grupo.value,
      plan: e.target.plan.value,
      correo: e.target.correo.value,
      docente: e.target.docente.value,
      materia: e.target.materia.value,
      tema: e.target.tema.value,
      nivel: e.target.nivel.value,
      tipo: e.target.tipo.value,
      dia: e.target.dia.value,
      hora: e.target.hora.value,
      motivo: e.target.motivo.value,
    };
    let asesoriaObjeto = JSON.stringify(asesoria);
    fetch("/api/asesoria", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: asesoriaObjeto,
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  });
}

//apartado del service worker

let newServiceWorker;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("service-worker.js", { scope: "form-asesorias" })
      .then((registerEvent) => {
        registerEvent.addEventListener("updatefound", () => {
          newServiceWorker = registerEvent.installing;

          newServiceWorker.addEventListener("statechange", () => {
            /* if (newServiveWorker.state === 'installed') {

            } */

            switch (newServiceWorker.state) {
              case "installed":
                showSnackbarUpdate();
                break;
            }
          });
        });
      });
  });
}

function showSnackbarUpdate() {
  // Get the snackbar DIV
  let x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";
}

let launchUpdate = document.getElementById("launchUpdate");
launchUpdate.addEventListener("click", () => {
  newServiceWorker.postMessage({
    action: "skipWaiting",
  });
  window.reload();
});
