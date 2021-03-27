import React, { useContext } from 'react';
import { useSelector } from 'react-redux';

import AppContext from '../AppContext';

import ChannelsPanel from './ChannelsPanel';
import ChannelChat from './ChannelChat';
import ChannelModal from './ChannelModal';

function App() {
  const channels = useSelector((store) => store.channelsPanel.channels);
  const currentChannelId = useSelector((store) => store.channelsPanel.currentChannelId);
  const messages = useSelector((store) => {
    const filteredMeessages = store.channelChat.messages
      .filter(({ channelId }) => channelId === currentChannelId);
    return filteredMeessages;
  });
  const { userName } = useContext(AppContext);

  return (
    <>
      <div className="row h-100 pb-3">
        <ChannelsPanel channels={channels} currentChannelId={currentChannelId} />
        <ChannelChat userName={userName} messages={messages} currentChannelId={currentChannelId} />
      </div>
      <ChannelModal />
    </>
  );
}

export default App;
