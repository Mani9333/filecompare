import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';

const ColumnSelector = () => {
  const [primaryColumns, setPrimaryColumns] = useState([]);
  const [secondaryColumns, setSecondaryColumns] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/columns')
      .then((response) => {
        setPrimaryColumns(response.data.primaryColumns || []);
        setSecondaryColumns(response.data.secondaryColumns || []);
      })
      .catch((error) => {
        console.error("Error fetching columns:", error);
      });
  }, []);

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Available Columns
      </Typography>

      <Grid container spacing={2}>
        {/* Primary Columns */}
        <Grid item xs={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Primary Columns
              </Typography>
              <List sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                {primaryColumns.map((column, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemText primary={column} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Secondary Columns */}
        <Grid item xs={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Secondary Columns
              </Typography>
              <List sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                {secondaryColumns.map((column, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemText primary={column} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default ColumnSelector;
