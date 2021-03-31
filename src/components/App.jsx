import React from 'react';

import ChannelsPanel from './ChannelsPanel';
import ChannelChat from './ChannelChat';
import ChannelModal from './ChannelModal';

function App() {
  return (
    <>
      <div className="row h-100 pb-3">
        <ChannelsPanel />
        <ChannelChat />
      </div>
      <ChannelModal />
    </>
  );
}

export default App;
