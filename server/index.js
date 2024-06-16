const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());

// Use cors() to handle CORS
app.use(cors({
  origin: ["https://portfolio-frontend-drab-two.vercel.app/"],
  methods: ["POST","GET"],
  credentials: true
}));

app.use(express.json());

// MongoDB connection string from .env file
const MONGODB_URI = "mongodb+srv://prasadjawale:prasadjawale@atlascluster.za7y8ci.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster";
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });


// Define Item schema and model
const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const Item = mongoose.model('Item', ItemSchema);

// Routes

// @route GET /api/items
// @desc Get All Items
app.get('/getitems', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
 
// @route POST /additem
// @desc Add a new item
app.post('/additem', async (req, res) => {
    const item = new Item({
        name:req.body.name
    });

    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Simple API endpoint
app.get('/hello', (req, res) => {
    res.json({ message: 'Hello from the API' });
  });

  
// Simple API endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Server Started' });
  });

  // Simple API endpoint
app.get('*', (req, res) => {
    res.json({ message: 'No Endpoint' });
  });
