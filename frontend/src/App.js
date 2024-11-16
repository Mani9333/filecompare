import React, { useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import ColumnSelector from './components/ColumnSelector';
import RuleEditor from './components/RuleEditor';

const App = () => {
  const [rules, setRules] = useState([]);

  // Function to add a new rule
  const handleAddRule = () => {
    setRules([...rules, { name: '', condition: '' }]);
  };

  // Function to update a rule by index
  const handleUpdateRule = (index, updatedRule) => {
    const updatedRules = [...rules];
    updatedRules[index] = updatedRule;
    setRules(updatedRules);
  };

  // Function to remove a rule
  const handleRemoveRule = (index) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    setRules(updatedRules);
  };

  // Function to submit all rules
  const handleSubmit = () => {
    axios.post('http://localhost:5001/api/rules', { rules })
      .then((response) => {
        alert(response.data.message);
        setRules([]); // Clear all rules after submission
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.error) {
          alert(error.response.data.error); // Show error message from backend
        } else {
          console.error('Error submitting rules:', error);
        }
      });  
  };

  return (
    <Container maxWidth="lg">
      <Box textAlign="center" sx={{ paddingY: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Rule Builder
        </Typography>
        <Divider sx={{ marginBottom: 4 }} />
      </Box>

      <Box display="flex" gap={2}>
        {/* Left Column - Column Selector */}
        <Box flex={1}>
          <ColumnSelector />
        </Box>

        {/* Right Column - Rule Builder */}
        <Box flex={2}>
          {rules.map((rule, index) => (
            <RuleEditor
              key={index}
              index={index}
              rule={rule}
              onUpdateRule={handleUpdateRule}
              onRemoveRule={handleRemoveRule}
            />
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddRule}
            startIcon={<AddIcon />}
            sx={{ marginTop: 2 }}
          >
            Create Rule
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            sx={{ marginTop: 2, marginLeft: 2 }}
          >
            Submit All Rules
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default App;
