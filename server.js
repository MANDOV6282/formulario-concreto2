const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const { google } = require("googleapis");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static("public"));

const CREDENTIALS_PATH = "./credenciales.json";
const SHEET_ID = "19mYfGFkT6w5YBRQ-U275Pz8-dfmMfJawnoiSjgs9Nrw";

// Autenticación con Google
async function getAuthSheets() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: authClient });
  return sheets;
}

app.post("/guardar", async (req, res) => {
  try {
    const datos = req.body;

    const sheets = await getAuthSheets();
    const valores = datos.map(row => [
      row.dia, row.mes, row.ano, row.hora, row.elemento,
      row.resistencia, row.grava, row.edad, row.asentamiento,
      row.adicional, row.descarga, row.cantidad,
      row.ajuste, row.frecuencia
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "A2",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      resource: { values: valores },
    });

    res.status(200).send({ message: "Datos guardados en Google Sheets." });
  } catch (error) {
    console.error("Error al guardar:", error);
    res.status(500).send({ error: "Error al guardar en Google Sheets." });
  }
});

app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));