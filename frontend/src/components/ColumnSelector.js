

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Typography from '@mui/material/Typography';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemText from '@mui/material/ListItemText';
// import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';

// const ColumnSelector = () => {
//   const [primaryColumns, setPrimaryColumns] = useState([]);
//   const [secondaryColumns, setSecondaryColumns] = useState([]);

//   useEffect(() => {
//     axios
//       .get('http://localhost:5001/api/columns')
//       .then((response) => {
//         setPrimaryColumns(response.data.primaryColumns || []);
//         setSecondaryColumns(response.data.secondaryColumns || []);
//       })
//       .catch((error) => {
//         console.error('Error fetching columns:', error);
//       });
//   }, []);

//   return (
//     <div>
//       <Typography variant="h5" gutterBottom textAlign="center" sx={{ marginBottom: 2 }}>
//         Available Columns
//       </Typography>

//       <Grid container spacing={2}>
//         {/* Primary Columns */}
//         <Grid item xs={6}>
//           <Card
//             variant="outlined"
//             sx={{ boxShadow: 3, borderRadius: 2, backgroundColor: '#f9f9f9' }}
//           >
//             <CardContent>
//               <Typography variant="h6" color="primary" gutterBottom>
//                 Primary Columns
//               </Typography>
//               <List sx={{ maxHeight: '300px', overflowY: 'auto' }}>
//                 {primaryColumns.map((column, index) => (
//                   <ListItem
//                     key={index}
//                     sx={{
//                       backgroundColor: '#e0f7fa',
//                       marginBottom: 1,
//                       padding: 1,
//                       borderRadius: 1,
//                       boxShadow: 1,
//                     }}
//                   >
//                     <ListItemText primary={column} />
//                   </ListItem>
//                 ))}
//               </List>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Secondary Columns */}
//         <Grid item xs={6}>
//           <Card
//             variant="outlined"
//             sx={{ boxShadow: 3, borderRadius: 2, backgroundColor: '#f9f9f9' }}
//           >
//             <CardContent>
//               <Typography variant="h6" color="secondary" gutterBottom>
//                 Secondary Columns
//               </Typography>
//               <List sx={{ maxHeight: '300px', overflowY: 'auto' }}>
//                 {secondaryColumns.map((column, index) => (
//                   <ListItem
//                     key={index}
//                     sx={{
//                       backgroundColor: '#fce4ec',
//                       marginBottom: 1,
//                       padding: 1,
//                       borderRadius: 1,
//                       boxShadow: 1,
//                     }}
//                   >
//                     <ListItemText primary={column} />
//                   </ListItem>
//                 ))}
//               </List>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </div>
//   );
// };

// export default ColumnSelector;


// src/components/ColumnSelector.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';

const ColumnSelector = ({ onColumnClick }) => {
  const [primaryColumns, setPrimaryColumns] = useState([]);
  const [secondaryColumns, setSecondaryColumns] = useState([]);

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

  return (
    <div>
      <Typography variant="h5" gutterBottom textAlign="center" sx={{ marginBottom: 2 }}>
        Available Columns
      </Typography>

      <Grid container spacing={2}>
        {/* Primary Columns */}
        <Grid item xs={6}>
          <Card
            variant="outlined"
            sx={{ boxShadow: 3, borderRadius: 2, backgroundColor: '#f9f9f9' }}
          >
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Primary Columns
              </Typography>
              <List sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                {primaryColumns.map((column, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => onColumnClick(column)} // Trigger on column click
                    sx={{
                      backgroundColor: '#e0f7fa',
                      marginBottom: 1,
                      padding: 1,
                      borderRadius: 1,
                      boxShadow: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#b2ebf2',
                      },
                    }}
                  >
                    <ListItemText primary={column} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Secondary Columns */}
        <Grid item xs={6}>
          <Card
            variant="outlined"
            sx={{ boxShadow: 3, borderRadius: 2, backgroundColor: '#f9f9f9' }}
          >
            <CardContent>
              <Typography variant="h6" color="secondary" gutterBottom>
                Secondary Columns
              </Typography>
              <List sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                {secondaryColumns.map((column, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => onColumnClick(column)} // Trigger on column click
                    sx={{
                      backgroundColor: '#fce4ec',
                      marginBottom: 1,
                      padding: 1,
                      borderRadius: 1,
                      boxShadow: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#f8bbd0',
                      },
                    }}
                  >
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
