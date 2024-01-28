import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  const [companyName, setCompanyName] = useState('');
  const [chemicals, setChemicals] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/search-by-company', {
        companyNames: [companyName]
      });
      setChemicals(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClear = () => {
    setCompanyName('');
    setChemicals([]);
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setCompanyName(input);
  };

  const handleSuggestionClick = (suggestion) => {
    setCompanyName(suggestion);
    setSuggestions([]);
  };

  useEffect(() => {
    // Fetch company name suggestions based on the input
    const fetchSuggestions = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/company-suggestions', {
          partialCompanyName: companyName
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    // Call the fetchSuggestions function after a short delay (e.g., 300 milliseconds) to avoid frequent API calls while typing
    const timeoutId = setTimeout(fetchSuggestions, 300);

    // Cleanup function to clear the timeout when the component unmounts or when the input changes
    return () => clearTimeout(timeoutId);
  }, [companyName]);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Company Chemical Search</h1>
      <div className="mb-3">
        <label className="form-label">Company Name:</label>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={companyName}
            onChange={handleInputChange}
          />
          <button onClick={handleSearch} className="btn btn-primary">Search</button>
          <button onClick={handleClear} className="btn btn-secondary ms-2">Clear</button>
        </div>
        {suggestions.length > 0 && (
          <ul className="list-group mt-2">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="list-group-item suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h2>Chemicals</h2>
        {chemicals.length > 0 ? (
          <ul className="list-group">
            {chemicals.map((chemical, index) => (
              <li key={index} className="list-group-item">
                <strong>Chemical Name:</strong> {chemical.chemicalName}<br />
                <strong>Company Names:</strong> {chemical.companyNames.join(', ')}
              </li>
            ))}
          </ul>
        ) : (
          <p>No chemicals found for the provided company name.</p>
        )}
      </div>
    </div>
  );
}

export default App;
