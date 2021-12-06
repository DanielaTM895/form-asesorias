const express = require("express");
const path = require("path");

const app = express();
const bodyParser = require("body-parser");

let asesorias = [];

const HTML_DIR = path.join(__dirname, "/");
app.use(express.static(HTML_DIR));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  //res.send("Hello world");
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.post("/api/asesoria", (req, res) => {
  console.log("Enviado a la api");

  const asesoria = {
    nombre: req.body.nombre,
    grado: req.body.grado,
    grupo: req.body.grupo,
    plan: req.body.plan,
    correo: req.body.correo,
    docente: req.body.docente,
    materia: req.body.materia,
    tema: req.body.tema,
    nivel: req.body.nivel,
    tipo: req.body.tipo,
    dia: req.body.dia,
    hora: req.body.hora,
    motivo: req.body.motivo,
  };

  asesorias.push(asesoria);
  console.log(asesorias);
  res.json(asesoria);
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto: ", 3000);
});
