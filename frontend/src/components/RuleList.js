import React from 'react';

const RuleList = ({ rules }) => {
  return (
    <div>
      <h3>Rules</h3>
      <ul>
        {rules.map((rule, index) => (
          <li key={index}>
            <strong>{rule.name}</strong>: {rule.condition}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RuleList;
