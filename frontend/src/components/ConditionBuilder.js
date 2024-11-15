import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';

const ConditionBuilder = ({ onAddCondition }) => {
  const [column, setColumn] = useState('');
  const [operator, setOperator] = useState('');
  const [value, setValue] = useState('');

  const operators = ['<', '>', '=', '!=', 'IN', 'NOT IN'];

  const handleAdd = () => {
    if (!column || !operator || value === '') {
      alert('All fields are required!');
      return;
    }
    onAddCondition(`${column} ${operator} ${value}`);
    setColumn('');
    setOperator('');
    setValue('');
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', marginBottom: 2 }}>
      <TextField
        label="Column"
        variant="outlined"
        value={column}
        onChange={(e) => setColumn(e.target.value)}
      />
      <TextField
        select
        label="Operator"
        value={operator}
        onChange={(e) => setOperator(e.target.value)}
        variant="outlined"
        sx={{ width: '120px' }}
      >
        {operators.map((op) => (
          <MenuItem key={op} value={op}>
            {op}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Value"
        variant="outlined"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button
        variant="outlined"
        onClick={handleAdd}
        startIcon={<AddIcon />}  // Add icon here
      >
        Add Condition
      </Button>
    </Box>
  );
};

export default ConditionBuilder;
