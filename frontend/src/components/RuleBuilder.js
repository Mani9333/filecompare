import React, { useState } from 'react';
import ConditionBuilder from './ConditionBuilder';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const RuleBuilder = ({ onSave }) => {
  const [ruleName, setRuleName] = useState('');
  const [conditions, setConditions] = useState([]);

  const addCondition = (newCondition) => {
    setConditions([...conditions, newCondition]);
  };

  const handleSave = () => {
    if (!ruleName) {
      alert('Rule name is required!');
      return;
    }
    onSave({ name: ruleName, conditions });
    setRuleName('');
    setConditions([]);
  };

  return (
    <Box sx={{ padding: 2, borderRadius: 1, boxShadow: 3, backgroundColor: 'white' }}>
      <Typography variant="h6" gutterBottom>
        Create Rule
      </Typography>
      <TextField
        label="Rule Name"
        variant="outlined"
        fullWidth
        value={ruleName}
        onChange={(e) => setRuleName(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <ConditionBuilder onAddCondition={addCondition} />
      <Divider sx={{ marginY: 2 }} />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        fullWidth
      >
        Save Rule
      </Button>
    </Box>
  );
};

export default RuleBuilder;
