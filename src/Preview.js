import React from 'react';
import marked from 'marked';

const Preview = ({ value }) => (
  <div dangerouslySetInnerHTML={{
    __html: marked(value, {
      sanitize: true,
      breaks: true,
    })
  }} />
);

export default Preview;
