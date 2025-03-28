const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { Turf, Group, Academy, Sport, History, User }
    = require('./models');

mongoose.connect("mongodb://localhost:27017/turf_db").then(() => {
    console.log("Connected successfully");
}); 

app.use(express.json());

app.put('/turfs/:name', async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'No fields provided for update' });
        }
        const up = await Turf.findOneAndUpdate(
            { name: req.params.name },   // Find by name
            { $set: req.body },          // Update with body data
            { new: true }                // Returns the updated document
        );
        if (!up) {
            return res.status(404).json({ error: 'No such turf found' });
        }
        res.json(up); // Return the updated turf
    }
    catch (error) {
        console.error("Error updating the turf:", error);
        res.status(500).json({ error: 'Error updating the turf' });
    };
});

app.post('/turfs', async (req, res) => {
    try {
        const newturf = new Turf({
            name: req.body.name,
            address: req.body.address,
            isOpen: req.body.isOpen,
            timings: req.body.timings,
            sports: req.body.sports,
            ownerName: req.body.ownerName,
            contact: req.body.contact,
            img: req.body.img
        });
        const savedturf = await newturf.save();
        res.status(201).json({ savedturf });
    }
    catch (error) {
        console.error('Error creating the turf', error);
        res.status(500).json({ error: 'Error creating the turf' });
    }
});

app.delete('/turfs/:name', async (req, res) => {
    try {
        const deletedturf = await Turf.findOneAndDelete({ name: req.params.name });
        if (!deletedturf) {
            return res.status(404).json({ error: 'Turf does not exist' });
        }
        res.json({ message: 'Turf deleted successfully', deletedturf }); // Corrected deletedtur to deletedturf
    }
    catch (error) {
        console.error('Error deleting turf:', error);
        res.status(500).json({ error: 'Error deleting the turf' });
    }
});

app.get('/turfs/:name', async (req, res) => {
    try {
        const turfname = await Turf.findOne({ name: req.params.name });
        if (!turfname) {
            return res.status(404).json({ error: 'No such turf exists' });
        }
        res.json({ message: 'Found the turf', turfname });
    }
    catch (error) {
        console.error('Error finding the turf:', error);
        res.status(500).json({ error: 'Could not find the turf' });
    }
});
module.exports = app;