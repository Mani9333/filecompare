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
const numberTypeColumns = config.numberTypeColumns.split(',');
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

// Function to add ABS() around columns in numberTypeColumns where applicable
const applyAbsToNumberColumns = (condition) => {
  return condition.replace(/\b(\w+)\b/g, (column) => {
    // Remove prefix to check if the column is in numberTypeColumns
    const baseColumnName = column.replace(new RegExp(`^(${primaryDSPrefix}|${secondaryDSPrefix})`), '');

    // If the base column name is in numberTypeColumns, wrap with ABS()
    if (numberTypeColumns.includes(baseColumnName)) {
      return `ABS(${column})`;
    }

    // Otherwise, return the column as is
    return column;
  });
};

app.post('/api/rules', (req, res) => {
    const rules = req.body.rules; // Expecting an array of rules
  
    if (!Array.isArray(rules)) {
      return res.status(400).json({ error: 'Invalid data format. Expected an array of rules.' });
    }
  
    const transformations = JSON.parse(fs.readFileSync('transformations.json', 'utf-8'));
  
    // Check for duplicate rule names in transformations
    const existingRuleNames = new Set(transformations.transformations.map((rule) => rule.name));
    for (const rule of rules) {
      if (existingRuleNames.has(rule.name)) {
        return res.status(400).json({ error: `Rule name "${rule.name}" already exists!` });
      }
    }
  
    // Process each rule and add it to transformations
    rules.forEach((rule) => {
      const { name, conditions } = rule;
  
      // Ensure all conditions are processed individually and concatenated with "AND"
      const processedConditions = conditions.map(applyAbsToNumberColumns);
      const finalCondition = processedConditions.join(' AND '); // Join all conditions with "AND"
  
      // Add the new rule with the processed condition
      transformations.transformations.push({ name, condition: finalCondition });
    });
  
    // Save the updated transformations file
    fs.writeFileSync('transformations.json', JSON.stringify(transformations, null, 2));
  
    res.json({ message: 'Rules added successfully!' });
  });
  

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
