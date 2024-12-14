import Typewriter from 'react-ts-typewriter';

const MessageList = ({ messages,usermessage, currentTypingId, onEndTyping }) => (
    <div className="messages-list">
      {messages.map((message,index) =>
        message.isTyping && message.id === currentTypingId ? (
            <div
                key={index}
                className={message.isUser ? 'chat_item question_chat user-message' : 'chat_item answer_chat ai-message'}
            >
                <div className="profile_info">
                    <div className="profile_img"></div>
                    <p className="profile_name">{message.isUser ? '사용자이름' : '냥냥이(AI)'}</p>
                </div>
                <div className="chat_message">
                    <Typewriter speed={50} text={message.text} key={index} onFinished={() => onEndTyping(message.id)}/>
                </div>
                <div className="chat_time"><span>{message.id}</span></div>
            </div>
        ) : (
          <div
            key={index}
            className={message.isUser ? 'chat_item question_chat user-message' : 'chat_item answer_chat ai-message'}
          >
            <div className="profile_info">
                <div className="profile_img"></div>
                <p className="profile_name">{message.isUser ? '사용자이름' : '냥냥이(AI)'}</p>
            </div>
            <div className="chat_message"><span>{usermessage||message.text}</span></div>
            <div className="chat_time"><span>{message.id}</span></div>
          </div>
        )
      )}
    </div>
  );
  export default MessageList