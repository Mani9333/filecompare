// src/components/RuleEditor.js
import React from 'react';
import { TextField, IconButton, Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const RuleEditor = ({ index, rule, onUpdateRule, onRemoveRule }) => {
  // Handle changes to rule name and condition
  const handleNameChange = (e) => {
    onUpdateRule(index, { ...rule, name: e.target.value });
  };

  const handleConditionChange = (e) => {
    onUpdateRule(index, { ...rule, condition: e.target.value });
  };

  return (
    <Box sx={{ padding: 2, marginBottom: 2, border: '1px solid #ccc', borderRadius: 1 }}>
      <TextField
        label="Rule Name"
        variant="outlined"
        value={rule.name}
        onChange={handleNameChange}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Query"
        placeholder="Enter your custom query here"
        variant="outlined"
        value={rule.condition}
        onChange={handleConditionChange}
        multiline
        rows={3}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button
          variant="contained"
          color="error"
          onClick={() => onRemoveRule(index)}
          startIcon={<DeleteIcon />}
          size="small"
        >
          Delete Rule
        </Button>
      </Box>
    </Box>
  );
};

export default RuleEditor;
