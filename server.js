const express = require("express");
const bodyParser = require("body-parser");
const ExcelJS = require("exceljs");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

const FILE_NAME = "datos_concreto.xlsx";

if (!fs.existsSync(FILE_NAME)) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Programacion");
  sheet.addRow([
    "Día", "Mes", "Año", "Hora", "Elemento a Fundir", "Resistencia",
    "Grava", "Edad", "Asentamiento", "Adicional", "Descarga",
    "Cantidad", "Requiere ajuste", "Frecuencia llegada"
  ]);
  workbook.xlsx.writeFile(FILE_NAME);
}

app.post("/guardar", async (req, res) => {
  try {
    const datos = req.body;
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(FILE_NAME);
    const sheet = workbook.getWorksheet("Programacion");

    datos.forEach(row => {
      sheet.addRow([
        row.dia, row.mes, row.ano, row.hora, row.elemento,
        row.resistencia, row.grava, row.edad, row.asentamiento,
        row.adicional, row.descarga, row.cantidad,
        row.ajuste, row.frecuencia
      ]);
    });

    await workbook.xlsx.writeFile(FILE_NAME);
    res.status(200).send({ message: "Datos guardados correctamente." });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Error al guardar los datos." });
  }
});

app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
