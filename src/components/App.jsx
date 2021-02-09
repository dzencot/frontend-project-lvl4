import React, { useContext } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import Chat from './Chat';
import AppContext from '../AppContext';
import channelSlice from '../reducers';

function App(props) {
  const store = configureStore({
    reducer: channelSlice.reducer,
  });

  const { userName } = useContext(AppContext);
  const { channels } = props;

  const selectChannel = (id) => {
    const action = channelSlice.actions.selectChannel;
    store.dispatch(action({ id }));
  };
  return (
    <div className="row h-100 pb-3">
      <div className="col-3 border-right">
        <div className="d-flex mb-2">
          <span>Channels</span>
        </div>
        <ul className="nav flex-column nav-pills nav-fill">
          {channels.map(({ name, id }) => (
            <li key={id} className="nav-item">
              <button type="button" className="nav-link btn btn-block" onClick={() => selectChannel(id)}>{name}</button>
            </li>
          ))}
        </ul>
      </div>
      <Chat />
    </div>
  );
}

export default App;
