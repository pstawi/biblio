const mysql = require("mysql2");

// Création de la connexion à la base de données
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'biblio',
  password: 'root'
});

//test de la connexion
connection.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
        return;
    } else {
        console.log('Connexion à la base de données réussie !');
    }
});

// Exportation de la connexion
module.exports = connection;