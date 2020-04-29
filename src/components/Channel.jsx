import React from 'react';

function Channel(props) {
  const { name } = props;
  return (
    <li className="nav-item">
      <button type="button" className="nav-link btn btn-block">{name}</button>
    </li>
  );
}

export default Channel;
