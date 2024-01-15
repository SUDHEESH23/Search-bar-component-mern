import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = async () => {
    fetch('http://localhost:5000/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ searchTerm }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setSearchResults(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleSuggestion = async () => {
    if (searchTerm.length > 0) {
      fetch('http://localhost:5000/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchTerm }),
      })
        .then(response => response.json())
        .then(data => {
          setSuggestions(data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      setSuggestions([]);
    }
  };

  const handleClear = () => {
    setSearchResults([]);
    setSearchTerm('');
    setSuggestions([]);
  };

  useEffect(() => {
    handleSuggestion();
  }, [searchTerm]);

  return (
    <div className="container mt-4">
      <div className="input-group mb-2">
        <input
          type="text"
          id="searchInput"
          name="searchTerm1"
          placeholder="Enter search term"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
        />
        <div className="input-group-append">
          <button onClick={handleSearch} className="btn btn-primary">
            Search
          </button>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-2 border rounded shadow-sm bg-light">
          {suggestions.map((suggestion) => (
            <div key={suggestion} onClick={() => { setSearchTerm(suggestion); setSuggestions([]); }} className="cursor-pointer p-2 border-bottom">
              {suggestion}
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-4 mb-2">Search Results</h2>
      <ul className="list-group">
        {searchResults !== null && searchResults.map((result) => (
          <li key={result._id} className="list-group-item">{result.name}</li>
        ))}
      </ul>

      {searchResults.length > 0 && (
        <button onClick={handleClear} className="btn btn-danger mt-2">
          Clear Results
        </button>
      )}
    </div>
  );
};

export default SearchComponent;
