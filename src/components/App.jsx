import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cn from 'classnames';
import Chat from './Chat';
import AppContext from '../AppContext';
import { selectChannel } from '../api';

const mapStateToProps = state => {
  return { state };
};

class App extends React.Component {

  render() {
    const { channels, store } = this.props;
    const { userName } = this.context;

    const getButtonClasses = (idChannel) => {
      const { selectedChannelId } = store.getState();
      return cn('btn', {
        'nav-link': true,
        'btn-block': true,
        'mb-2': true,
        'text-left': true,
        btn: true,
        'btn-primary': idChannel === selectedChannelId,
        'btn-light': idChannel !== selectedChannelId,
      });
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
                <button type="button" className={getButtonClasses(id)} onClick={() => selectChannel(id)(store.dispatch)}>{name}</button>
              </li>
            ))}
          </ul>
        </div>
        <Chat userName={userName} store={store} />
      </div>
    );
  }
}
App.contextType = AppContext;

export default connect(mapStateToProps)(App);
