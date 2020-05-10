import React, { useContext } from 'react';
import Channel from './Channel';
import AppContext from '../AppContext';

function Chat(props) {
  const { userName } = useContext(AppContext);
  const { channels } = props;
  return (
    <div className="row h-100 pb-3">
      <div className="col-3 border-right">
        <div className="d-flex mb-2">
          <span>Channels</span>
        </div>
        <ul className="nav flex-column nav-pills nav-fill">
          {channels.map(({ name, id }) => <Channel name={name} key={id} />)}
        </ul>
      </div>
    </div>
  );
}

export default Chat;
