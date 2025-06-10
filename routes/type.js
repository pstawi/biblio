const express = require('express');
const router = express.Router();
const connection = require('../config/bdd.js');

// route to get all types
router.get('/type', (req, res) => {
    const getType = 'SELECT idType, libelle FROM type';
    connection.query(getType, (err, results) => {
        if (err) {
            console.error('Error fetching types:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

//route ajouter un type
router.post('/addType', (req, res) => {
    const libelle = req.body.libelle;
    const addType = 'INSERT INTO type (libelle) VALUES (?)';
    connection.query(addType, [libelle], (err, results) => {
        if (err) {
            console.error('Error adding type:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(201).json({ message: 'Type added successfully', idType: results.insertId });
    });
});

router.put('/updateType/:id', (req, res) => {
    const idType = req.params.id;
    const libelle = req.body.libelle;
    const updateType = 'UPDATE type SET libelle = ? WHERE idType = ?';
    connection.query(updateType, [libelle, idType], (err, results) => {
        if (err) {
            console.error('Error updating type:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Type not found' });
        }
        res.json({ message: 'Type updated successfully' });
    });
});

router.delete('/deleteType/:id', (req,res) => {
    const idType = req.params.id;
    const deleteTypeById = "DELETE FROM type WHERE idType = ?;";
    connection.query(deleteTypeById,[idType], (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.status(200);
            res.json({
                message: "Type supprimé avec succès",
            });
        }
    }); 
})

module.exports = router;