import Typewriter from 'react-ts-typewriter';

const MessageList = ({ messages,isai, currentTypingId, onEndTyping }) => (
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
        ) : (isai?(
            <div
            key={message.isUser ? index:index+'ai'}
            className={message.isUser ? 'chat_item question_chat user-message' : 'chat_item answer_chat ai-message'}
          >
            <div className="profile_info">
                <div className="profile_img"></div>
                <p className="profile_name">{message.isUser ? '사용자이름' : '냥냥이(AI)'}</p>
            </div>
            <div className="chat_message"><span>{message.text}</span></div>
            <div className="chat_time"><span>{message.id}</span></div>
          </div>
        ) :
            <>
                <div
                    key={index}
                    className='chat_item question_chat user-message'
                >
                    <div className="profile_info">
                        <div className="profile_img"></div>
                        <p className="profile_name">사용자이름</p>
                    </div>
                    <div className="chat_message"><span>{message.text}</span></div>
                    <div className="chat_time"><span>{message.id}</span></div>
                </div>
                {isai ?(""):(
                    <div
                    key={index+'ai'}
                    className='chat_item answer_chat ai-message'
                    >
                    <div className="profile_info">
                        <div className="profile_img"></div>
                        <p className="profile_name">냥냥이(AI)</p>
                    </div>
                    <div className="chat_message"><span>냥냥이(AI)가 열심히 답변을 찾고 있습니다.</span></div>
                    <div className="chat_time"><span>{message.id}</span></div>
                    </div>
                )}

                
                
            </>
        )
      )}
    </div>
  );
  export default MessageList