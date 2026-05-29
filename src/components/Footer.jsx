import React from 'react';

const Footer = () => {
  return (
    <footer className="glass-panel" style={{ padding: '24px', textAlign: 'center', marginTop: '40px' }}>
      <p>&copy; {new Date().getFullYear()} VWings24x7. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
