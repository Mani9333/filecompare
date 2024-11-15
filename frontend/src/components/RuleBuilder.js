import React, { useState } from 'react';
import ConditionBuilder from './ConditionBuilder';

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
    <div>
      <h3>Create Rule</h3>
      <input
        type="text"
        placeholder="Rule Name"
        value={ruleName}
        onChange={(e) => setRuleName(e.target.value)}
      />
      <ConditionBuilder onAddCondition={addCondition} />
      <button onClick={handleSave}>Save Rule</button>
    </div>
  );
};

export default RuleBuilder;
