import React, { useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
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
    setRules([...rules, { name: '', conditions: [] }]);
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
        console.error('Error submitting rules:', error);
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

      <Grid container spacing={2}>
        {/* Left Side - Column Selector */}
        <Grid item xs={12} md={4}>
          <Box sx={{ height: '80vh', overflowY: 'auto', padding: 2, boxShadow: 3, borderRadius: 1, backgroundColor: 'white' }}>
            <ColumnSelector />
          </Box>
        </Grid>

        {/* Right Side - Rule Builder and Buttons */}
        <Grid item xs={12} md={8}>
          <Box sx={{ padding: 2, backgroundColor: 'white', boxShadow: 3, borderRadius: 1 }}>
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
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
