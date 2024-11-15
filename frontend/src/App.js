import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ColumnSelector from './components/ColumnSelector';
import RuleBuilder from './components/RuleBuilder';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import './App.css';

const App = () => {
  const [rules, setRules] = useState([]);

  // Fetch existing rules from backend
  useEffect(() => {
    axios.get('http://localhost:5001/api/rules')
      .then((response) => {
        console.log("Fetched rules:", response.data.transformations); // Debugging line
        setRules(response.data.transformations);
      })
      .catch((error) => {
        console.error('Error fetching rules:', error);
      });
  }, []);

  const handleSaveRule = (newRule) => {
    if (rules.find((rule) => rule.name === newRule.name)) {
      alert('Rule with this name already exists! Choose another name.');
      return;
    }

    // Save new rule to backend
    axios.post('http://localhost:5001/api/rules', newRule)
      .then((response) => {
        console.log(response.data.message); // Optional success message
        setRules([...rules, newRule]);
      })
      .catch((error) => {
        console.error('Error saving rule:', error);
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
        {/* Left Sidebar - Column Selector */}
        <Grid item xs={12} md={4}>
          <Box sx={{
            height: '80vh',
            overflowY: 'auto',
            padding: 2,
            boxShadow: 3,
            borderRadius: 1,
            backgroundColor: 'white'
          }}>
            <ColumnSelector />
          </Box>
        </Grid>

        {/* Right Main Content - Rule Builder and Condition Builder */}
        <Grid item xs={12} md={8}>
          <Box sx={{
            padding: 2,
            boxShadow: 3,
            borderRadius: 1,
            backgroundColor: 'white'
          }}>
            <RuleBuilder onSave={handleSaveRule} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
