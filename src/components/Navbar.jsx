import React from 'react';

const Navbar = () => {
  return (
    <nav className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px', marginBottom: '24px' }}>
      <div className="brand">
        <span className="text-gradient">Navbar</span>
      </div>
    </nav>
  );
};

export default Navbar;
