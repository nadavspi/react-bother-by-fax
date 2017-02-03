import React from 'react';

const Fields = ({ fields, onChange }) => {

  return (
    <div>
      {fields.map(field => {
        let input = (
          <textarea 
            id={field.id}
            cols="30"
            rows="10"
            onChange={onChange.bind(null, field.id)}
            value={field.value}
          />
        );
        if (field.type === 'input') {
          input = (
            <input
              id={field.id}
              onChange={onChange.bind(null, field.id)}
              type="text"
              value={field.value}
            />
          );
        }

        return (
          <p key={field.id}>
            <label htmlFor={field.id}>{field.id}</label>
            {input}
          </p>
        );
      })}
    </div>
  );
};

export default Fields;
