import React, {
  useEffect,
  useRef,
} from 'react';
import { useSelector } from 'react-redux';
import MessageForm from './MessageForm.jsx';

function ChannelChat() {
  const currentChannelId = useSelector((store) => store.channels.currentChannelId);
  const messages = useSelector((store) => {
    const filteredMeessages = store.chat.messages
      .filter(({ channelId }) => channelId === currentChannelId);
    return filteredMeessages;
  });

  const chatContainer = useRef(null);

  useEffect(() => {
    chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
  }, [messages.length]);

  return (
    <div className="col h-100">
      <div className="d-flex flex-column h-100">
        <div id="messages-box" ref={chatContainer} className="chat-messages overflow-auto mb-3 text-break">
          {messages.map((message) => (
            <div key={message.id}>
              <b>{message.authorName}</b>
              :
              {message.text}
            </div>
          ))}
        </div>
        <MessageForm />
      </div>
    </div>
  );
}

export default ChannelChat;
