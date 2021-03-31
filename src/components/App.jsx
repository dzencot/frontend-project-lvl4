import React from 'react';
import { useSelector } from 'react-redux';

import ChannelsPanel from './ChannelsPanel';
import ChannelChat from './ChannelChat';
import ChannelModal from './ChannelModal';

function App() {
  const isOpenModal = useSelector((state) => state.modal.isOpen);

  return (
    <>
      <div className="row h-100 pb-3">
        <ChannelsPanel />
        <ChannelChat />
      </div>
      {isOpenModal && <ChannelModal />}
    </>
  );
}

export default App;
