import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ColumnSelector from './components/ColumnSelector';
import RuleBuilder from './components/RuleBuilder';
import RuleList from './components/RuleList';
import './App.css';

const App = () => {
  const [rules, setRules] = useState([]);

  // Fetch existing rules from backend
  useEffect(() => {
    axios.get('http://localhost:5001/api/rules')
      .then((response) => {
        console.log("Fetched rules:", response.data.transformations); // Debugging line
        setRules(response.data.transformations);
      })
      .catch((error) => {
        console.error('Error fetching rules:', error);
      });
  }, []);

  const handleSaveRule = (newRule) => {
    if (rules.find((rule) => rule.name === newRule.name)) {
      alert('Rule with this name already exists! Choose another name.');
      return;
    }

    // Save new rule to backend
    axios.post('http://localhost:5001/api/rules', newRule)
      .then((response) => {
        console.log(response.data.message); // Optional success message
        setRules([...rules, newRule]);
      })
      .catch((error) => {
        console.error('Error saving rule:', error);
      });
  };

  return (
    <div className="App">
      <h1>Rule Builder</h1>
      <ColumnSelector />
      <RuleBuilder onSave={handleSaveRule} />
      {/* <RuleList rules={rules} /> */}
    </div>
  );
};

export default App;
