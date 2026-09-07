import React from 'react';
import { Loader } from './Loader';

export const PageLoader = ({ 
  message = 'Connecting to GiveHope Network...', 
  subMessage = 'Transparent aid for every vulnerable family across Pakistan.' 
}) => {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '3rem 1.5rem'
      }}
    >
      <Loader size="lg" message={message} subMessage={subMessage} />
    </div>
  );
};

export default PageLoader;
