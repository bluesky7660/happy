import { useState,useCallback,useEffect } from "react";
import axios from 'axios';
import RecieveChatCard from "../component/RecieveChatCard";
import SeneChatCard from "../component/SeneChatCard";
// import Typewriter from 'typewriter-effect';
import MessageList from "../component/MessageList";
import MessageForm from "../component/MessageForm";
import Dilemma from "../component/Dilemma";

function Chat() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [isuserTime, setUserTime] = useState("");
    const [currentTypingId, setCurrentTypingId] = useState(null);
    const [isTyping, setTyping] = useState(false);
    const [date, setDate] = useState(()=> new Date());
    const [modal,setmodal] = useState(false);
    
    let aimsg = "";
    let aiTime = "";
    // let aidelay =  true;

    const userInfo = {
      name:"이하늘"
    } 
    // const changeMessage = useCallback((e) => {
    //   setUserInputMsg(e.target.value);
    //   setSend(false);
    // }, []);

    const tick =() =>{
      setDate(new Date())
    }
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  
    useEffect(()=>{
      const timeId = setInterval(()=>tick(),1000)
      // console.log('setInteval')
      
      return() =>{
        clearInterval(timeId)
        // console.log('clearInterval')
  
      }
    })
    let chatInit = (
        <div>
          <p>테스트중임</p>
          <button onClick={()=>{modal ? setmodal(false):setmodal(true)}}>고민 선택하기</button>
        </div>
      )
    

    const handleSendMessage = async (message) => {
      console.log("isTyping:"+isTyping);
      setMessage(message);
      let userTime = new Date(Date.now()).toString();
      setUserTime(userTime);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, isUser: true, id: isuserTime }

      ]);
      if(isTyping == false){
        if(message.includes("안녕")){
          setTimeout(() =>{},50000);
          aimsg = "안녕하세요~!";
          aiTime = new Date(Date.now()).toString();
        }else{
          // aiChatapi(message);
          console.log("aiChatapi");
          const sendToOpenAI = async (userInputMsg) => {
            try {
              console.log("sendToOpenAI:",import.meta.env.VITE_OPENAI_API_KEY);
              const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                  model: 'gpt-3.5-turbo',
                  messages: [
                    { role: 'user', content:"짧게 대답해주세요."+ userInputMsg }
                  ],
                  max_tokens: 90
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
                  }
                }
              );
              console.log("ai:"+response.data.choices[0].message.content);
              /*대기중끝 */
              console.log("대기중끝");
              return response.data.choices[0].message.content;
      
            } catch (error) {
              if (axios.isAxiosError(error)) {
                if (error.response?.status === 429) {
                  // 호출 제한 초과 시 대기 후 재시도
                  console.warn("API 호출 제한 초과. 5초 후 재시도합니다.");
                  await delay(5000); // 5초 대기
                  return sendToOpenAI(userInputMsg); // 재시도 호출
                }
                // 네트워크 오류 처리
                console.error("OpenAI API 호출 중 네트워크 오류 발생:", error.message);
                alert("AI 응답을 가져오는 중 오류가 발생했습니다. 다시 시도해 주세요.");
              } else {
                // 예상치 못한 오류 처리
                console.error("예상치 못한 오류 발생:", error);
              }
            }
          }
          await delay(5000);
          aimsg = await sendToOpenAI(message);
          aiTime = new Date(Date.now()).toString();
          console.log("innner aimsg",aimsg);
          console.log("out aimsg",aimsg);
          console.log("out aiTime",aiTime);
        }
        setMessages((prevMessages) => [
          ...prevMessages,
          // { text: message, isUser: true, id: userTime },
          // { text: `Your message is: "${message}"`, isUser: false, isTyping: true, id: new Date(Date.now()).toString() },
          { text: aimsg, isUser: false, isTyping: true, id: aiTime },

        ]);
        setTyping(true);
      }else{

      }

    };

    const handleEndTyping = (id) => {
      console.log("handleEndTyping");
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === id ? { ...msg, isTyping: false } : msg
        )
      );
      setCurrentTypingId(null);
      setTyping(false);
    };
    
    useEffect(() => {
      // console.log("isTyping:"+isTyping);
      if (currentTypingId === null) {
        console.log("currentTypingId:",currentTypingId);
        const nextTypingMessage = messages.find(
          (msg) => !msg.isUser && msg.isTyping
        );
        if (nextTypingMessage) {
          console.log("nextTypingMessage:",nextTypingMessage);
          setCurrentTypingId(nextTypingMessage.id);
        }else{
          
          if(message!=""){
            console.log("inner message:",message);
          }
          console.log("message:",message);
        }
        console.log("useEffect:");
      }
    }, [messages,isTyping]);

    // useEffect(() => {
    //   if(message!=""){
    //     console.log("message:",message);
    //     setMessages((prevMessages) => [
    //       ...prevMessages,
    //       { text: message, isUser: true, id: isuserTime }

    //     ]);
    //   }
      
    // }, [message,isTyping]);
  
    
    return (
      <>
      <div id="chat" className="chat">
        <div className="page_title">
            <h1>Chat</h1>
            <p>시간 : {date.toLocaleTimeString()}</p>
        </div>
        <div className="chat_area">
          <div className="chat_content">
            {/* <MessageList
              messages={messages}
              isai={isTyping}
              currentTypingId={currentTypingId}
              onEndTyping={handleEndTyping}
              
            /> */}
            {chatInit}
          </div>
          <div className="chat_inputBox">
            <MessageForm onSendMessage={handleSendMessage} isTyping={isTyping} setTyping={setTyping}/>
            {/* <input 
                type="text" 
                name="" 
                id="chat_input" 
                className="chat_input" 
                placeholder="냥냥이와 이야기를 나눠보세요!"
                value={messages}
                onChange={changeMessage}
                onKeyDown={(event) => {
                  event.key === "Enter" && handleSendMessage(messages);
                }}   
                />
            <button onClick={handleSendMessage(messages)} className="chat_submit">전송</button> */}
          </div>
        </div>
      </div>
      {modal ? <Dilemma /> :null}
        
      </>
    )
  }
  
  export default Chat