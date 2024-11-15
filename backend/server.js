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

app.post('/api/rules', (req, res) => {
  const { name, conditions } = req.body;
  const transformations = JSON.parse(fs.readFileSync('transformations.json', 'utf-8'));

  // Check if a rule with the same name already exists
  if (transformations.transformations.some((rule) => rule.name === name)) {
    return res.status(400).json({ error: 'Rule name already exists!' });
  }

  // Function to add ABS() around columns in numberTypeColumns with the correct prefix
  const applyAbsToNumberColumns = (condition) => {
    return condition.replace(/\b(\w+)\b/g, (column) => {
      // Check if the base column name without prefix is in numberTypeColumns
      const baseColumnName = column.replace(new RegExp(`^(${primaryDSPrefix}|${secondaryDSPrefix})`), '');
      if (numberTypeColumns.includes(baseColumnName)) {
        return `ABS(${column})`;
      }
      return column;
    });
  };

  // Process each condition and apply ABS() to relevant columns
  const processedConditions = conditions.map(applyAbsToNumberColumns);

  // Save the new rule with the processed condition
  transformations.transformations.push({ name, condition: processedConditions.join(' AND ') });
  fs.writeFileSync('transformations.json', JSON.stringify(transformations, null, 2));

  res.json({ message: 'Rule added successfully!' });
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
