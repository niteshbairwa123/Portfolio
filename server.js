const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors    = require('cors');
const path    = require('path');
const XLSX    = require('xlsx');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// ─── Initialize Database ───────────────────────────────────────────────────
const db = new sqlite3.Database('./bookings.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');

        // Existing: ticket bookings table
        db.run(`CREATE TABLE IF NOT EXISTS tickets (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            name          TEXT NOT NULL,
            email         TEXT NOT NULL,
            event         TEXT NOT NULL,
            ticket_type   TEXT NOT NULL,
            quantity      INTEGER NOT NULL,
            booking_date  DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // New: contact messages table
        db.run(`CREATE TABLE IF NOT EXISTS contacts (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            name         TEXT NOT NULL,
            email        TEXT NOT NULL,
            message      TEXT NOT NULL,
            submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (!err) console.log('Contacts table ready.');
        });
    }
});

// ─── API: Submit Contact Message ───────────────────────────────────────────
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Name is required.' });
    }
    if (!email || !email.trim() || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ error: 'A valid email address is required.' });
    }
    if (!message || !message.trim()) {
        return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const sql = `INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)`;
    db.run(sql, [name.trim(), email.trim(), message.trim()], function (err) {
        if (err) {
            console.error('DB Error (contacts):', err.message);
            return res.status(500).json({ error: 'Failed to save message. Please try again.' });
        }
        console.log(`New contact message from ${name} <${email}> — ID: ${this.lastID}`);
        res.status(201).json({
            success: true,
            message: "Thanks for reaching out! I'll get back to you soon.",
            id: this.lastID
        });
    });
});

// ─── API: View All Contact Messages (JSON) ────────────────────────────────
app.get('/api/contacts', (req, res) => {
    const sql = `SELECT * FROM contacts ORDER BY submitted_at DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'success', count: rows.length, data: rows });
    });
});

// ─── API: Export Contacts as Excel ────────────────────────────────────────
app.get('/api/contacts/export', (req, res) => {
    const sql = `SELECT id, name, email, message, submitted_at FROM contacts ORDER BY submitted_at DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        // Build worksheet data with friendly headers
        const wsData = [
            ['#', 'Name', 'Email', 'Message', 'Submitted At']  // header row
        ];

        rows.forEach(r => {
            wsData.push([r.id, r.name, r.email, r.message, r.submitted_at]);
        });

        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Auto column widths
        ws['!cols'] = [
            { wch: 5  },  // #
            { wch: 22 },  // Name
            { wch: 32 },  // Email
            { wch: 60 },  // Message
            { wch: 22 },  // Submitted At
        ];

        // Style header row bold (xlsx-style not needed — standard xlsx supports this via !rows)
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Contact Messages');

        const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        const filename = `contact_messages_${new Date().toISOString().slice(0,10)}.xlsx`;
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(excelBuffer);
    });
});

// ─── API: Handle Ticket Bookings (existing) ───────────────────────────────
app.post('/api/book', (req, res) => {
    const { name, email, eventSelection, ticketType, ticketQuantity } = req.body;

    if (!name || !email || !eventSelection || !ticketType || !ticketQuantity) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = `INSERT INTO tickets (name, email, event, ticket_type, quantity) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [name, email, eventSelection, ticketType, ticketQuantity], function (err) {
        if (err) {
            console.error('Database Error:', err.message);
            return res.status(500).json({ error: 'Failed to process booking' });
        }
        console.log(`New booking added with ID: ${this.lastID}`);
        res.status(201).json({
            message: 'Ticket Reserved Successfully!',
            bookingId: this.lastID
        });
    });
});

// ─── API: View All Bookings ────────────────────────────────────────────────
app.get('/api/bookings', (req, res) => {
    const sql = `SELECT * FROM tickets ORDER BY booking_date DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'success', data: rows });
    });
});

// ─── Catch-all → serve index.html ─────────────────────────────────────────
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

// ─── Start Server ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\nServer running    → http://localhost:${PORT}`);
    console.log(`Contacts API      → http://localhost:${PORT}/api/contacts`);
    console.log(`Bookings API      → http://localhost:${PORT}/api/bookings\n`);
});

// ─── Graceful Shutdown ─────────────────────────────────────────────────────
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) return console.error(err.message);
        console.log('Database connection closed.');
        process.exit(0);
    });
});
