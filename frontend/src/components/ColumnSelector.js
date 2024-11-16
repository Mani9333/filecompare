import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const ColumnSelector = ({ onColumnClick, onOperationClick }) => {
  const [primaryColumns, setPrimaryColumns] = useState([]);
  const [secondaryColumns, setSecondaryColumns] = useState([]);

  // Possible operations
  const operations = ['ABS', 'MIN', 'MAX', '<', '<=', '>', '>=', '=', '!=', 'AND', 'OR', 'NOT', 'IN', 'NOT IN'];

  useEffect(() => {
    axios
      .get('http://localhost:5001/api/columns')
      .then((response) => {
        setPrimaryColumns(response.data.primaryColumns || []);
        setSecondaryColumns(response.data.secondaryColumns || []);
      })
      .catch((error) => {
        console.error('Error fetching columns:', error);
      });
  }, []);

  const boxStyle = {
    padding: '8px 12px',
    margin: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      backgroundColor: '#e9e9e9',
    },
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Available Columns
      </Typography>

      <Grid container spacing={2} sx={{ alignItems: 'flex-start' }}>
        {/* Primary Columns */}
        <Grid item xs={6}>
          <Card variant="outlined" sx={{ width: '100%' }}>
            <CardContent>
              <Typography
                variant="h6"
                color="primary"
                gutterBottom
                sx={{ textAlign: 'center', marginBottom: 2 }}
              >
                Primary Columns
              </Typography>
              <List sx={{ maxHeight: '300px', overflowY: 'auto', padding: 0 }}>
                {primaryColumns.map((column, index) => (
                  <ListItem
                    key={index}
                    disablePadding
                    sx={boxStyle}
                    onClick={() => onColumnClick(column)}
                  >
                    {column}
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Secondary Columns */}
        <Grid item xs={6}>
          <Card variant="outlined" sx={{ width: '100%' }}>
            <CardContent>
              <Typography
                variant="h6"
                color="secondary"
                gutterBottom
                sx={{ textAlign: 'center', marginBottom: 2 }}
              >
                Secondary Columns
              </Typography>
              <List sx={{ maxHeight: '300px', overflowY: 'auto', padding: 0 }}>
                {secondaryColumns.map((column, index) => (
                  <ListItem
                    key={index}
                    disablePadding
                    sx={boxStyle}
                    onClick={() => onColumnClick(column)}
                  >
                    {column}
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Available Operations */}
      <Box mt={4} sx={{ width: '100%' }}>
        <Typography variant="h6" color="text.primary" gutterBottom>
          Available Operations
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={2} justifyContent="flex-start">
          {operations.map((operation, index) => (
            <Box
              key={index}
              sx={{
                ...boxStyle,
                padding: '10px 20px',
                backgroundColor: '#ffefef',
                color: '#ff5722',
              }}
              onClick={() => onOperationClick(operation)}
            >
              {operation}
            </Box>
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default ColumnSelector;
