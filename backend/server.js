
// const express = require('express');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // Read and parse the application.properties file
// const properties = fs.readFileSync('application.properties', 'utf-8');
// const config = properties.split('\n').reduce((acc, line) => {
//   const [key, value] = line.split('=').map((item) => item.trim());
//   acc[key] = value;
//   return acc;
// }, {});

// // Config values with default fallbacks
// const columns = config.columns ? config.columns.split(',') : [];
// const numberTypeColumns = config.numberTypeColumns ? config.numberTypeColumns.split(',') : []; // Fallback to an empty array if not defined
// const primaryDSPrefix = config.primaryDSPrefix || 'prerun';
// const secondaryDSPrefix = config.secondaryDSPrefix || 'postrun';

// // Log parsed configuration for debugging
// console.log("Configuration:", {
//   columns,
//   numberTypeColumns,
//   primaryDSPrefix,
//   secondaryDSPrefix
// });

// // Route to get columns with prefixes
// app.get('/api/columns', (req, res) => {
//   // Apply prefixes to columns
//   const primaryColumns = columns.map((col) => `${primaryDSPrefix}${col}`);
//   const secondaryColumns = columns.map((col) => `${secondaryDSPrefix}${col}`);

//   res.json({
//     primaryColumns,
//     secondaryColumns,
//   });
// });

// // Helper function to check if a column supports numeric operations
// const isNumericColumn = (column) => numberTypeColumns.includes(column.replace(new RegExp(`^(${primaryDSPrefix}|${secondaryDSPrefix})`), ''));

// // Helper function to validate conditions
// const validateCondition = (condition) => {
//   const numericOperations = ['+', '-', '*', '/', 'ABS(', '<', '>', '<=', '>='];

//   const tokens = condition.split(/\s+/);
//   for (let i = 0; i < tokens.length; i++) {
//     const token = tokens[i];
//     if (numericOperations.some((op) => token.includes(op))) {
//       const columnWithoutPrefix = token.replace(/\bABS\(|\)|[\W]+/g, ''); // Remove ABS() and special characters
//       if (!isNumericColumn(columnWithoutPrefix)) {
//         throw new Error(`Numeric operation is not allowed on non-numeric column: ${columnWithoutPrefix}`);
//       }
//     }
//   }
// };

// // POST endpoint to add rules
// app.post('/api/rules', (req, res) => {
//   const rules = req.body.rules;

//   if (!Array.isArray(rules)) {
//     return res.status(400).json({ error: 'Invalid data format. Expected an array of rules.' });
//   }

//   const transformations = JSON.parse(fs.readFileSync('transformations.json', 'utf-8'));

//   const existingRuleNames = new Set(transformations.transformations.map((rule) => rule.name));
//   const duplicateRules = rules.filter((rule) => existingRuleNames.has(rule.name));

//   if (duplicateRules.length > 0) {
//     return res.status(400).json({
//       error: `Rule names already exist: ${duplicateRules.map((rule) => rule.name).join(', ')}`,
//     });
//   }

//   try {
//     rules.forEach((rule) => {
//       const { name, condition } = rule;
//       validateCondition(condition); // Validate condition for numeric operations on non-numeric columns
//       transformations.transformations.push({ name, condition });
//     });

//     fs.writeFileSync('transformations.json', JSON.stringify(transformations, null, 2));
//     return res.json({ message: 'Rules added successfully!' });
//   } catch (error) {
//     console.error('Validation error:', error.message);
//     return res.status(400).json({ error: error.message });
//   }
// });

// const PORT = 5001;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Read and parse the application.properties file
const properties = fs.readFileSync('application.properties', 'utf-8');
const config = properties.split('\n').reduce((acc, line) => {
  const [key, value] = line.split('=').map((item) => item.trim());
  acc[key] = value;
  return acc;
}, {});

// Config values with default fallbacks
const columns = config.columns ? config.columns.split(',') : [];
const numberTypeColumns = config.numberTypeColumns ? config.numberTypeColumns.split(',') : []; // Fallback to an empty array if not defined
const primaryDSPrefix = config.primaryDSPrefix || 'prerun';
const secondaryDSPrefix = config.secondaryDSPrefix || 'postrun';

// Log parsed configuration for debugging
console.log("Configuration:", {
  columns,
  numberTypeColumns,
  primaryDSPrefix,
  secondaryDSPrefix
});

// Route to get columns with prefixes
app.get('/api/columns', (req, res) => {
  // Apply prefixes to columns
  const primaryColumns = columns.map((col) => `${primaryDSPrefix}${col}`);
  const secondaryColumns = columns.map((col) => `${secondaryDSPrefix}${col}`);

  res.json({
    primaryColumns,
    secondaryColumns,
  });
});

// Helper function to check if a column supports numeric operations
const isNumericColumn = (column) => {
  const baseColumn = column.replace(new RegExp(`^(${primaryDSPrefix}|${secondaryDSPrefix})`), '');
  return numberTypeColumns.includes(baseColumn);
};

// Helper function to validate conditions
// const validateCondition = (condition) => {
//   const numericOperations = ['+', '-', '*', '/', 'ABS(', '<', '>', '<=', '>='];
//   const nonAllowedStringOperations = ['MIN', 'MAX']; // Add MIN and MAX for validation

//   const openingParentheses = (condition.match(/\(/g) || []).length;
//   const closingParentheses = (condition.match(/\)/g) || []).length;

//   if (openingParentheses !== closingParentheses) {
//     throw new Error(
//       `Unbalanced parentheses: ${openingParentheses} opening and ${closingParentheses} closing`
//     );
//   }

//   const tokens = condition.split(/\s+/);
//   for (let i = 0; i < tokens.length; i++) {
//     const token = tokens[i];
//     if (numericOperations.some((op) => token.includes(op))) {
//       const columnWithoutPrefix = token.replace(/\bABS\(|\)|[\W]+/g, ''); // Remove ABS() and special characters
//       if (!isNumericColumn(columnWithoutPrefix)) {
//         throw new Error(`Numeric operation is not allowed on non-numeric column: ${columnWithoutPrefix}`);
//       }
//     }
//   }
// };

const validateCondition = (condition) => {
  const numericOperations = ['+', '-', '*', '/', 'ABS(', '<', '>', '<=', '>='];
  const allowedNumericOperations = [...numericOperations, 'MIN(', 'MAX(']; // Include MIN and MAX for numeric columns

  const openingParentheses = (condition.match(/\(/g) || []).length;
  const closingParentheses = (condition.match(/\)/g) || []).length;

  if (openingParentheses !== closingParentheses) {
    throw new Error(
      `Unbalanced parentheses: ${openingParentheses} opening and ${closingParentheses} closing`
    );
  }

  const tokens = condition.split(/\s+/);
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Check for numeric operations including MIN and MAX
    if (allowedNumericOperations.some((op) => token.includes(op))) {
      // Extract the column name from the token
      const columnWithoutPrefix = token.replace(/\bABS\(|MIN\(|MAX\(|\)|[\W]+/g, ''); // Remove operations and special characters
      if (!isNumericColumn(columnWithoutPrefix)) {
        throw new Error(
          `Operation '${token}' is not allowed on non-numeric column: ${columnWithoutPrefix}`
        );
      }
    }
  }
};

// POST endpoint to add rules
app.post('/api/rules', (req, res) => {
  const rules = req.body.rules;

  if (!Array.isArray(rules)) {
    return res.status(400).json({ error: 'Invalid data format. Expected an array of rules.' });
  }

  const transformations = JSON.parse(fs.readFileSync('transformations.json', 'utf-8'));

  const existingRuleNames = new Set(transformations.transformations.map((rule) => rule.name));
  const duplicateRules = rules.filter((rule) => existingRuleNames.has(rule.name));

  if (duplicateRules.length > 0) {
    return res.status(400).json({
      error: `Rule names already exist: ${duplicateRules.map((rule) => rule.name).join(', ')}`,
    });
  }

  try {
    rules.forEach((rule) => {
      const { name, condition } = rule;
      validateCondition(condition); // Validate condition for numeric operations on non-numeric columns
      transformations.transformations.push({ name, condition });
    });

    fs.writeFileSync('transformations.json', JSON.stringify(transformations, null, 2));
    return res.json({ message: 'Rules added successfully!' });
  } catch (error) {
    console.error('Validation error:', error.message);
    return res.status(400).json({ error: error.message });
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
