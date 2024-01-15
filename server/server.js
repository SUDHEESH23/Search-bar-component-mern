const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));


const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Sudheesh_Patwardhan:sudheesh@cluster0.zdeut4e.mongodb.net/MIO';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const suggestionSchema = new mongoose.Schema({
  name: String,
});


const search = mongoose.model('search', suggestionSchema);

app.post('/api/suggestions', async (req, res) => {
    const { searchTerm } = req.body;
  
    try {
      const suggestions = await search.find({
        name: { $regex: new RegExp(`${searchTerm}`, 'i') }
      }).limit(5); 
  
      res.json(suggestions.map(result => result.name));
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
app.post('/api/search', async (req, res) => {
    const { searchTerm } = req.body;
  
    try {
      const searchResults = await search.find({
        name: { $regex: new RegExp(`${searchTerm}`, 'i') }
      });
  
      if (searchResults) {
        res.json(searchResults);
      } else {
        res.status(404).json('I dont have that');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
