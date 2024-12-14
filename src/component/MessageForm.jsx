import { useState} from "react";
const MessageForm = ({ onSendMessage ,isTyping ,setTyping}) => {
    const [message, setMessage] = useState('');
  
    const handleSubmit = (event) => {
      event.preventDefault();
      console.log("isTyping:"+isTyping);
      if(isTyping==false){
        setTyping(true);
        onSendMessage(message);
        setMessage('');
      }else{
        
      }
      
    };
  
    return (
      <form className="message-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="send-button" type="submit">
          Send
        </button>
      </form>
    );
  };
  export default MessageForm