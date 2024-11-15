import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ColumnSelector = () => {
  // Initialize as empty arrays
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
      <h3>Available Columns</h3>
      <div>
        <h4>Primary Columns (prerun)</h4>
        <ul>
          {primaryColumns.map((column, index) => (
            <li key={index}>{column}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4>Secondary Columns (postrun)</h4>
        <ul>
          {secondaryColumns.map((column, index) => (
            <li key={index}>{column}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ColumnSelector;
