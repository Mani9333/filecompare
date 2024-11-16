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
  const rules = req.body.rules;

  if (!Array.isArray(rules)) {
    return res.status(400).json({ error: 'Invalid data format. Expected an array of rules.' });
  }

  const transformations = JSON.parse(fs.readFileSync('transformations.json', 'utf-8'));

  rules.forEach((rule) => {
    const { name, condition } = rule;

    // Validate the condition
    const invalidOperations = [];
    const processedCondition = condition.replace(/\b(\w+)\b/g, (column) => {
      if (isNumberTypeColumn(column)) {
        return column; // Valid numeric column
      } else {
        invalidOperations.push(column);
        return column; // Leave it as is but mark it invalid for logging
      }
    });

    // If there are invalid operations, return an error
    if (invalidOperations.length > 0) {
      return res.status(400).json({
        error: `Invalid operation on string-type columns: ${invalidOperations.join(', ')}`,
      });
    }

    // If validation passed, add the rule
    transformations.transformations.push({ name, condition: processedCondition });
  });

  fs.writeFileSync('transformations.json', JSON.stringify(transformations, null, 2));
  res.json({ message: 'Rules added successfully!' });
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
