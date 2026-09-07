import React from 'react';
import { Loader } from './Loader';

export const PageLoader = ({ 
  message = 'Connecting to GiveHope Live Network...', 
  subMessage = 'Transparent aid for every vulnerable life.' 
}) => {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      padding: '2rem 1rem'
    }}>
      <Loader size="lg" message={message} subMessage={subMessage} />
    </div>
  );
};

export default PageLoader;
