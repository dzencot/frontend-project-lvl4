import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Chat from './Chat';
import AppContext from '../AppContext';
import { selectChannel } from '../reducers';

const mapStateToProps = state => {
  return { state };
};

function App(props) {

  const { userName } = useContext(AppContext);
  const { channels, store } = props;

  return (
    <div className="row h-100 pb-3">
      <div className="col-3 border-right">
        <div className="d-flex mb-2">
          <span>Channels</span>
        </div>
        <ul className="nav flex-column nav-pills nav-fill">
          {channels.map(({ name, id }) => (
            <li key={id} className="nav-item">
              <button type="button" className="nav-link btn btn-block" onClick={() => store.dispatch(selectChannel(id))}>{name}</button>
            </li>
          ))}
        </ul>
      </div>
      <Chat store={store} />
    </div>
  );
}

export default App;
