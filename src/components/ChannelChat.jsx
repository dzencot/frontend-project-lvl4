import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import MessageForm from './MessageForm.jsx';

const mapStateToProps = (state) => state;

function ChannelChat(props) {
  const { messages, userName, currentChannelId } = props;
  const currentMessages = messages.filter(({ channelId }) => channelId === currentChannelId);

  const chatContainer = useRef(null);

  useEffect(() => {
    chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
  }, [messages.length]);

  return (
    <div className="col h-100">
      <div className="d-flex flex-column h-100">
        <div id="messages-box" ref={chatContainer} className="chat-messages overflow-auto mb-3 text-break">
          {currentMessages.map((message) => (
            <div key={message.id}>
              <b>{message.authorName}</b>
              :
              {message.text}
            </div>
          ))}
        </div>
        <MessageForm userName={userName} currentChannelId={currentChannelId} />
      </div>
    </div>
  );
}

export default connect(mapStateToProps)(ChannelChat);
