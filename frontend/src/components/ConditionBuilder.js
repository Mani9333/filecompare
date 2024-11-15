import React, { useState } from 'react';

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
    <div>
      <h4>Add Condition</h4>
      <input
        type="text"
        placeholder="Column"
        value={column}
        onChange={(e) => setColumn(e.target.value)}
      />
      <select value={operator} onChange={(e) => setOperator(e.target.value)}>
        <option value="">Select Operator</option>
        {operators.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={handleAdd}>Add Condition</button>
    </div>
  );
};

export default ConditionBuilder;
