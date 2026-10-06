import React from 'react';

const ViewToggle = ({ viewMode = 'list', onViewChange }) => {
  return (
    <div className="view-toggle-group" title="Switch View Mode">
      <button
        type="button"
        className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
        onClick={() => onViewChange('list')}
      >
        <i className="fa-solid fa-list-ul"></i>
        <span>List</span>
      </button>
      <button
        type="button"
        className={`view-toggle-btn ${viewMode === 'card' ? 'active' : ''}`}
        onClick={() => onViewChange('card')}
      >
        <i className="fa-solid fa-grip"></i>
        <span>Cards</span>
      </button>
    </div>
  );
};

export default ViewToggle;
