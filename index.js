// importation de express
const express = require('express');
const cors = require('cors');
// importation de la connection à la base de données
const connection = require('./config/bdd.js');

// affectation de express à une variable
const app = express();

//importation des routes client
const clientRoute = require('./routes/client.js');
// importation des routes films
const documentsRoute = require('./routes/document.js');
// importation des routes type
const typeRoute = require('./routes/type.js');
// importation des routes emprunt
const empruntRoute = require('./routes/emprunt.js');

//middleware pour lire des données JSON
app.use(express.json());
// app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use("/api",clientRoute, documentsRoute, typeRoute, empruntRoute);

// démmarage du serveur (sur le port 3000)
app.listen(3000, () => {
    console.log("OK capitain sur le port 3000");
});