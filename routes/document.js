const express = require('express');
const router = express.Router();
const connection = require('../config/bdd.js');

// Route pour récupérer tous les films
router.get('/documents', (req, res) => {
    const getDocuments = 
    "SELECT titre, resume, libelle, YEAR(dateSortie) as annee, dispo FROM document INNER JOIN type on document.typeId = type.idType;";
    connection.query(getDocuments, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "Erreur lors de la récupération" });
        } else {
            res.status(200).json({
                message: "documents récupérés avec succès",
                documents: result
            });
        }
    });
});

//route d'ajout de film
router.post('/addDocument', (req, res) => {
    const  titre = req.body.titre;
    const resume = req.body.resume;
    const dateSortie = req.body.dateSortie;
    const typeId = req.body.typeId;
    
    const addDocument = "INSERT INTO document (titre, resume, dateSortie, typeId) VALUES (?, ?, ?, ?);";

    connection.query(addDocument, [titre, resume, dateSortie, typeId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "Erreur lors de l'ajout du document" });
        } else {
            res.status(201).json({
                message: "document ajouté avec succès",
                documentID: result.insertId
            });
        }
    });
});

// route de modification d'un film
router.put('/updateDocument/:id', (req, res) => {
    const id = req.params.id;
    const { titre, resume, dateSortie, typeId, dispo} = req.body;
    const updateDocument = "UPDATE document SET titre = ?, resume = ?, dateSortie = ?, typeId = ?, dispo = ? WHERE idDocument = ?;";

    connection.query(updateDocument, [titre, resume, dateSortie, typeId, dispo, id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "Erreur lors de la mise à jour" });
        } else {
            res.status(200).json({
                message: "Document mis à jour avec succès"
            });
        }
    });
});

//route de suppression d'un film
router.delete('/deleteDocument/:id', (req, res) => {
    const id = req.params.id;
    const deleteDocument = "DELETE FROM document WHERE idDocument = ?;";

    connection.query(deleteDocument, [id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "Erreur lors de la suppression" });
        } else {
            res.status(200).json({
                message: "Document supprimé avec succès"
            });
        }
    });
});

//route pour récupérer un film par son ID
router.get('/document/:id', (req, res) => {
    const id = req.params.id;
const getDocumentById = 'SELECT titre, resume, dateSortie, libelle, dispo FROM document INNER JOIN type ON document.typeId = type.idType WHERE idDocument = ?;';

    connection.query(getDocumentById, [id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "Erreur lors de la récupération du document" });
        } else if (result.length === 0) {
            res.status(404).json({ message: "Document non trouvé" });
        } else {
            res.status(200).json({
                message: "Document récupéré avec succès",
                document: result[0]
            });
        }
    });
});

//exportation du router
module.exports = router;