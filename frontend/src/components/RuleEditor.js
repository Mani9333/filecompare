import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ConditionBuilder from './ConditionBuilder'; // Reusing existing ConditionBuilder component
import DeleteIcon from '@mui/icons-material/Delete';

const RuleEditor = ({ index, rule, onUpdateRule, onRemoveRule }) => {
  const [conditions, setConditions] = useState(rule.conditions || []);

  // Handle rule name change
  const handleNameChange = (event) => {
    onUpdateRule(index, { ...rule, name: event.target.value, conditions });
  };

  // Add a new condition
  const handleAddCondition = (condition) => {
    const updatedConditions = [...conditions, condition];
    setConditions(updatedConditions);
    onUpdateRule(index, { ...rule, conditions: updatedConditions });
  };

  return (
    <Box sx={{ marginBottom: 4, padding: 2, border: '1px solid #ddd', borderRadius: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          label="Rule Name"
          variant="outlined"
          fullWidth
          value={rule.name}
          onChange={handleNameChange}
          sx={{ marginBottom: 2 }}
        />
        <Button
          variant="outlined"
          color="error"
          onClick={() => onRemoveRule(index)}
          startIcon={<DeleteIcon />}
          sx={{ marginLeft: 2 }}
        >
          Delete Rule
        </Button>
      </Box>

      <Typography variant="h6" gutterBottom>
        Conditions
      </Typography>
      {conditions.map((condition, i) => (
        <Typography key={i} variant="body1" sx={{ marginBottom: 1 }}>
          - {condition}
        </Typography>
      ))}
      <ConditionBuilder onAddCondition={handleAddCondition} />
    </Box>
  );
};

export default RuleEditor;
