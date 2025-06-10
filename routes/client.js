const express = require('express');
const router = express.Router();
const connection = require('../config/bdd.js');

router.get('/client', (req, res) => {
    // requete sql
    const getClient = "SELECT id, nom, prenom, mail FROM client;";
    connection.query(getClient, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.status(200);
            res.json({
                message: "Clients récupérés avec succès",
                clients: result
            });
        }
    });
});
// route de modification (put)
router.put("/updateClient/:id", (req,res) => {
    const id = req.params.id;
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const mail = req.body.mail;
    const updateClient = "UPDATE client SET nom = ?, prenom = ?, mail = ? WHERE id = ?;";

    connection.query(updateClient,[nom, prenom, mail, id], (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.status(200);
            res.json({
                message: "Client modifié avec succès",
            });
        }
    });
});

//route de modification (patch)


// routes avec un parametre
router.get("/client/:id", (req, res) => {
    const id = req.params.id;
    const getClientById = "SELECT id, nom, prenom, mail FROM client WHERE id = ?;";
    connection.query(getClientById,[id], (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.status(200);
            res.json({
                message: "Client récupéré avec succès",
                client: result
            });
        }
    }); 
});

//route de suppression
router.delete("/deleteClient/:id", (req, res) => {
    const id = req.params.id;
    const deleteClientById = "DELETE FROM client WHERE id = ?;";
    connection.query(deleteClientById,[id], (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.status(200);
            res.json({
                message: "Client supprimé avec succès",
            });
        }
    }); 
});

// route post avec récupération de données
router.post("/ajoutClient",(req, res) => {
    // récupération des données envoyées 
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const mail = req.body.mail;
    
    //preparation de la requete sql
    const ajoutClient = "INSERT INTO client (nom,prenom,mail) VALUES(?, ?, ?)";

    // execution de la requete
    connection.query(ajoutClient,[nom, prenom, mail], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200);
            res.json({
                message: "Client ajouté avec succès",
            });
        }
    });
    });

// exportation du router
// pour l'utiliser dans le fichier index.js
module.exports = router;