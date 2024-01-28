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

const chemicalSchema = new mongoose.Schema({
  companyNames: [String], // Assuming companyName is an array of strings
  chemicalName: String,
});

const ChemicalModel = mongoose.model('ChemicalModel', chemicalSchema);

// Suggestions for chemical names based on partial input
// app.post('/api/:companyName', async (req, res) => {
//   const { searchTerm } = req.body;

//   try {
//     const suggestions = await ChemicalModel.find({
//       chemicalName: { $regex: new RegExp(`${searchTerm}`, 'i') }
//     }).limit(5);

//     res.json(suggestions.map(result => result.chemicalName));
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// Search for chemicals associated with a company
app.post('/api/search-by-company', async (req, res) => {
  const { companyNames } = req.body;

  try {
    const chemicals = await ChemicalModel.find({
      companyNames: {
        $in: companyNames.map(name => new RegExp(name, 'i')) // Case-insensitive search
      }
    });

    if (chemicals.length > 0) {
      res.json(chemicals);
    } else {
      res.status(404).json('No chemicals found for the provided company name.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Suggestions for company names based on partial input
app.post('/api/company-suggestions', async (req, res) => {
  const { partialCompanyName } = req.body;

  try {
    const suggestions = await ChemicalModel.find({
      companyNames: { $regex: new RegExp(`${partialCompanyName}`, 'i') }
    }, 'companyNames').limit(5);

    const uniqueSuggestions = [...new Set(suggestions.flatMap(doc => doc.companyNames))];

    res.json(uniqueSuggestions);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
