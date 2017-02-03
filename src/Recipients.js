import React from 'react';

const Recipients = ({ checked, recipients, onChange }) => (
  <form>
    {recipients.map(recipient => (
      <p key={recipient.id}>
        <input 
          checked={checked === recipient.id}
          id={recipient.id}
          name="recipient"
          onChange={onChange}
          type="radio"
          value={recipient.id}
        />
        <label htmlFor={recipient.id}>{recipient.label}</label>
      </p>
        ))}
  </form>
);

export default Recipients;
