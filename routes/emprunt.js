const express = require('express');
const router = express.Router();
const connection = require('../config/bdd.js');

router.get("/emprunt", (req, res) => {
    const getEmprunt = "SELECT nom, prenom, titre, libelle, DATE_FORMAT(dateEmprunt, '%d/%m/%Y') as dateEmprunt, DATE_FORMAT(dateRetour, '%d/%m/%Y') as dateRetour FROM emprunt JOIN client ON emprunt.clientId = client.id JOIN document ON emprunt.documentId = document.idDocument JOIN type ON document.typeId = type.idType;";
    connection.query(getEmprunt, (err, result) => {
        if (err) {
            console.error('Error fetching emprunts:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json({
            message: "Emprunts retrieved successfully",
            emprunts: result
        });
    }
    );
});

router.post("/addEmprunt", (req, res) => {


    const { clientId, documentId, dateEmprunt, dateRetour } = req.body;

    const checkDocumentDispo = "SELECT * FROM document WHERE idDocument = ? AND dispo = TRUE;";
    // Vérification de la disponibilité du document
    connection.query(checkDocumentDispo, [documentId], (err, result) => {
        // Si une erreur se produit lors de la requête
        if (err) {
            console.error('Error checking document availability:', err);
            return res.status(500).json({ error: 'Internal server error' });
            // Si le document n'est pas disponible ou n'existe pas
        } else if (result.length === 0) {
            return res.status(404).json({ error: 'Document not available or does not exist' });
            // Si le document est disponible, on procède à l'ajout de l'emprunt
        } else {
            const addEmprunt = "INSERT INTO emprunt (clientId, documentId, dateEmprunt, dateRetour) VALUES (?, ?, ?, ?);";
            connection.query(addEmprunt, [clientId, documentId, dateEmprunt, dateRetour], (err, result) => {
                // Si une erreur se produit lors de l'ajout de l'emprunt
                if (err) {
                    console.error('Error adding emprunt:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                    // Si l'emprunt n'a pas été ajouté (affectedRows = 0)
                } else if (result.affectedRows === 0) {
                    return res.status(400).json({ error: 'Failed to add emprunt' });
                } else {
                    // Si l'emprunt a été ajouté avec succès, on met à jour la disponibilité du document
                    const updateDocumentDispo = "UPDATE document SET dispo = FALSE WHERE idDocument = ?;";
                    connection.query(updateDocumentDispo, [documentId], (err, updateResult) => {
                        // Si une erreur se produit lors de la mise à jour de la disponibilité du document
                        if (err) {
                            console.error('Error updating document availability:', err);
                            return res.status(500).json({ error: 'Internal server error' });
                            // Si la mise à jour n'a pas affecté de lignes (document non trouvé)
                        } else if (updateResult.affectedRows === 0) {
                            return res.status(400).json({ error: 'Failed to update document availability' });
                        }
                        // Si tout s'est bien passé, on renvoie une réponse de succès
                        res.status(201).json({
                            message: "Emprunt added successfully",
                            empruntId: result.insertId
                        });
                    });

                }

            });
        }
    }
    );
}
);

router.put("/updateEmprunt/:idEmprunt", (req, res) => {
    const idEmprunt = req.params.idEmprunt;
    const dateRetour = req.body.dateRetour;
    const updateEmprunt = "UPDATE emprunt SET dateRetour = ? WHERE idEmprunt = ?;";
    connection.query(updateEmprunt, [dateRetour, idEmprunt], (err, result) => {
        if (err) {
            console.error('Error updating emprunt:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Emprunt not found' });
        }
        res.json({
            message: "Emprunt updated successfully"
        });
    });
});

router.get("/histoClient/:id", (req, res) => {
    const id = req.params.id;
    const getHistoById = "SELECT idEmprunt, titre as titre_document, dateEmprunt, dateRetour, libelle FROM emprunt JOIN document ON emprunt.documentId = document.idDOcument JOIN type ON document.typeId = type.idType WHERE clientId = ?;";
    connection.query(getHistoById, [id], (err, result) => {
        if (err) {
            console.error('Error updating emprunt:', err);
            return res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(201);
            res.json({
                historique: result
            })
        };
    });
});

router.get("/mostEmprunt", (req, res) => {
    const mostEmprunt = "SELECT titre, COUNT(documentId) as nbEmprunt FROM emprunt INNER JOIN document ON emprunt.documentId = document.idDocument GROUP BY titre ORDER BY nbEmprunt;";
    connection.query(mostEmprunt, (err, result) => {
        if (err) {
            console.error('Error updating emprunt:', err);
            return res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(201);
            res.json({
                nbEmprunt: result
            })
        };
    });
});
module.exports = router;