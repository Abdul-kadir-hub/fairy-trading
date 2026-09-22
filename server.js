const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Aapka Admin Password (Isko aap yahan change kar sakte hain)
const ADMIN_PASSWORD = "fairy@786";

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Public API - Site ka data lene ke liye
app.get('/api/content', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error reading data' });
        res.json(JSON.parse(data));
    });
});

// Admin Verify API
app.post('/api/verify-admin', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        return res.json({ success: true, message: 'Authorized' });
    }
    return res.status(401).json({ success: false, message: 'Galat Password!' });
});

// Protected API - Sirf sahi password ke sath save hoga
app.post('/api/content', (req, res) => {
    const { password, data } = req.body;

    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized: Galat password.' });
    }

    fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), (err) => {
        if (err) return res.status(500).json({ error: 'Failed to save changes' });
        res.json({ message: 'Website content updated successfully!' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});