const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Read application.properties
const properties = fs.readFileSync('application.properties', 'utf-8');
const config = properties.split('\n').reduce((acc, line) => {
  const [key, value] = line.split('=').map((item) => item.trim());
  acc[key] = value;
  return acc;
}, {});

const columns = config.columns.split(',');
const numberTypeOfColumns = (config.numberTypeOfColumns || '').split(','); // Columns that support numeric operations
const primaryDSPrefix = config.primaryDSPrefix || 'prerun';
const secondaryDSPrefix = config.secondaryDSPrefix || 'postrun';

app.get('/api/columns', (req, res) => {
  // Apply prefixes to columns
  const primaryColumns = columns.map((col) => `${primaryDSPrefix}${col}`);
  const secondaryColumns = columns.map((col) => `${secondaryDSPrefix}${col}`);

  res.json({
    primaryColumns,
    secondaryColumns,
  });
});


// Utility to check if a column supports numeric operations
const isNumberTypeColumn = (columnWithPrefix) => {
  // Remove prefix from the column name
  const baseColumnName = columnWithPrefix.replace(new RegExp(`^(${primaryDSPrefix}|${secondaryDSPrefix})`), '');
  // Check if the base name is in the numberTypeOfColumns list
  return numberTypeOfColumns.includes(baseColumnName);
};

// Endpoint to validate and add rules
app.post('/api/rules', (req, res) => {
    const rules = req.body.rules; // Expecting an array of rules
  
    if (!Array.isArray(rules)) {
      return res.status(400).json({ error: 'Invalid data format. Expected an array of rules.' });
    }
  
    const transformations = JSON.parse(fs.readFileSync('transformations.json', 'utf-8'));
  
    // Check for duplicate rule names in transformations
    const existingRuleNames = new Set(transformations.transformations.map((rule) => rule.name));
    const duplicateRules = rules.filter((rule) => existingRuleNames.has(rule.name));
  
    if (duplicateRules.length > 0) {
      return res.status(400).json({
        error: `Rule names already exist: ${duplicateRules.map((rule) => rule.name).join(', ')}`,
      });
    }
  
    // Add the new rules to transformations
    rules.forEach((rule) => {
      const { name, condition } = rule;
      transformations.transformations.push({ name, condition });
    });
  
    // Save the updated transformations file
    try {
      fs.writeFileSync('transformations.json', JSON.stringify(transformations, null, 2));
      return res.json({ message: 'Rules added successfully!' });
    } catch (error) {
      console.error('Error writing to transformations.json:', error);
      return res.status(500).json({ error: 'Failed to save rules.' });
    }
  });
  

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
