const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/quiz_website', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// Parse request bodies (for handling form data)
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/submit-username', (req, res) => {
    const username = req.body.username;
    if (!username) {
        res.status(400).send('Missing username');
        return;
    }

    // Validate username (e.g., check for length, special characters)
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        res.status(400).send('Invalid username');
        return;
    }

    storeUsernameOnServer(username)
        .then(() => {
            console.log('Username stored successfully:', username);
            res.status(200).send('Username submitted successfully');
        })
        .catch(err => {
            console.error('Error storing username:', err);
            res.status(500).send('Error storing username');
        });
});

const usernameSchema = new mongoose.Schema({
    username: String
});

const UsernameModel = mongoose.model('Username', usernameSchema);

function storeUsernameOnServer(username) {
    const newUsername = new UsernameModel({ username });
    return newUsername.save()
        .then(() => {
            console.log('Username stored successfully:', username);
        })
        .catch(err => {
            console.error('Error storing username:', err);
        });
}

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('a user connected');

    // Handle new username events
    socket.on('newUsername', (username) => {
        console.log('new username:', username);
        io.emit('newUsername', username);
    });
});

// Start the server
const port = 3000;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});