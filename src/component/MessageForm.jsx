import { useState} from "react";
const MessageForm = ({ onSendMessage ,isTyping ,setTyping ,isDilemma}) => {
    const [message, setMessage] = useState('');
  
    const handleSubmit = (event) => {
      event.preventDefault();
      console.log("isTyping:"+isTyping);
      if(isDilemma!=false){
        if(isTyping==false){
          setTyping(true);
          onSendMessage(message);
          setMessage('');
        }else{
          alert("냥냥이가 대답을 찾고 있습니다.");
        }
      }else{
        alert("고민 선택을 하고 채팅이 가능합니다.");
      }
    };
  
    return (
      <form className="message_form" onSubmit={handleSubmit}>
        <div className="message_form_wrapper">
          <input
            type="text"
            className="chat_input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="chat_submit" type="submit">
            Send
          </button>
        </div>
      </form>
    );
  };
  export default MessageForm