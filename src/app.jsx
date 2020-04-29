import React from 'react';
import ReactDOM from 'react-dom';
import Channel from './components/Channel';

const app = (channels) => {
  const container = document.getElementById('chat');
  const html = (
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

  ReactDOM.render(html, container);
};

export default app;
