import { useState,useEffect } from "react";
import axios from 'axios';
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
    const [endTyping, setEndTyping] = useState(false);
    const [date, setDate] = useState(()=> new Date());
    const [modal,setModal] = useState(false);
    const [isDilemma,setDilemma] = useState(false);
    const [isDisable, setIsDisable] = useState(false);
    const [scroll, setScroll] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    
    let aimsg = "";
    let aiTime = "";
    let userTime = "";
    let userInit;
    
    // let aidelay =  true;

    const userInfo = {
      name:"이하늘"
    } 
    // const changeMessage = useCallback((e) => {
    //   setUserInputMsg(e.target.value);
    //   setSend(false);
    // }, []);
    const chatReset =() =>{
      setMessages([]);
      setMessage("");
      setUserTime("");
      setCurrentTypingId(null);
      setTyping(false);
      setEndTyping(false);
      setDate(()=> new Date());
      setModal(false);
      setDilemma(false);
      setIsDisable(false);
      setScroll(false);
    }
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
        <div className="profile_info">
                <div className="profile_img"></div>
                <p className="profile_name">냥냥이(AI)</p>
        </div>
        <div className="chat_item answer_chat ai-message">
          <div className='chat_item_content'>
            <div className="chat_message">
            <span>
              만나서 반가워요!<br/>
              여러분의 고민을 들어주는 AI냥냥이이에요.<br/>
              어떤 일이 있어서 찾아왔나요?<br/>
            </span>
            <button className="dilemma_button" onClick={()=>{modal ? setModal(false):setModal(true)}} disabled={isDisable}>고민 선택하기</button>
            </div>
          </div>
        </div>
      </div>
      )
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

    const handleSendMessage = async (userMessage) => {
      console.log("isTyping:"+isTyping);
      console.log("message:",userMessage);
      let message="";
      userTime = new Date(Date.now()).toString();
      setUserTime(userTime);
      if (Array.isArray(userMessage)) {

        console.log('배열입니다.');
        setIsDisable(true);
        userMessage.forEach(e => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: e, isUser: true, id: userTime }
    
          ]);
        });
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "냥냥이(AI)가 열심히 답변을 찾고 있습니다.", isUser: false, isTyping: false, id: userTime }
        ]);
        message = userMessage[0]+" "+userMessage[1];

        
        
      } else {
        message = userMessage;
        console.log('배열이 아닙니다.');
        setMessage(message);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: message, isUser: true, id: userTime },
          { text: "냥냥이(AI)가 열심히 답변을 찾고 있습니다.", isUser: false, isTyping: false, id: userTime }
        ]);
        
      }
      // setMessages((prevMessages) => [
      //   ...prevMessages,
      //   { text: message, isUser: true, id: isuserTime }

      // ]);
      if(isTyping == false){
        if(message.includes("안녕")){
          setTimeout(() =>{},50000);
          aimsg = "안녕하세요~!";
          aiTime = new Date(Date.now()).toString();
        }else{
          // aiChatapi(message);
          console.log("aiChatapi");
          
          await delay(5000);
          aimsg = await sendToOpenAI(message);
          aiTime = new Date(Date.now()).toString();
          console.log("innner aimsg",aimsg);
          console.log("out aimsg",aimsg);
          console.log("out aiTime",aiTime);
        }
        setMessages((prevMessages) => 
          prevMessages.map((msg) =>
            msg.id === userTime&&!msg.isUser ? { ...msg,text:aimsg,isTyping:true,id:aiTime  } : msg
          )
        );
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
      setEndTyping(true);
    };
    
    useEffect(() => {
      // console.log("isTyping:"+isTyping);
      const chatContent = document.getElementById('chat_content');
      console.log("chatContent.scrollHeight:",chatContent.scrollHeight);
      chatContent.scrollTo({
        top: chatContent.scrollHeight,
        behavior: 'smooth'
      });
      if (currentTypingId === null) {
        console.log("currentTypingId:",currentTypingId);
        console.log("messages:",messages);
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
    useEffect(() => {
      const chatContent = document.getElementById('chat_content');
      chatContent.addEventListener('wheel', handleScroll);
      return () =>{
        chatContent.removeEventListener('wheel',handleScroll);
      }
    },[]);

    const handleScroll = (e) => {
      console.log("chat_content.deltaY:",e.deltaY);
      const chatContent = document.getElementById('chat_content');
      console.log("chat_content.scrollHeight:",e.target.scrollHeight);
      console.log("chat_content:",e.target);
      if(e.deltaY < 0){
        setScroll(true);
        chatContent.scrollTo({
          top:e.target.scrollHeight+100,
          behavior: 'smooth'
        })
        console.log("위");
      }else{
        console.log("아래");
        // chatContent.scrollTo({
        //   top:0,
        //   behavior: 'smooth'
        // })
      }

      // 스크롤이 Top에서 50px 이상 내려오면 true값을 useState에 넣어줌
      // if(window.scrollY >= 50){
      //   setScroll(true);
      //   console.log(scroll)
      // }else{
      // // 스크롤이 50px 미만일경우 false를 넣어줌
      //   setScroll(false);
      // }
    
    };
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
            <div className="chatRest" onClick={chatReset}>리셋</div>
        </div>
        <div className="chat_area">
          <div className="chat_content" id="chat_content">
            {chatInit}
            {/* {isDilemma?
              userInit
              // <>
              //   <div
              //         className='chat_item question_chat user-message'
              //     >
              //         <div className="chat_message"><span>{message}</span></div>
              //   </div>
              //   <div
              //         className='chat_item question_chat user-message'
              //     >
              //         <div className="chat_message"><span>{message}</span></div>
              //         <div className="chat_time"><span>{message.id}</span></div>
              //   </div>
              // </>
              :null} */}
            <MessageList
              messages={messages}
              isai={isTyping}
              currentTypingId={currentTypingId}
              onEndTyping={handleEndTyping}
              endTyping={endTyping}
            />
            
          </div>
          <div className="chat_inputBox">
            <MessageForm onSendMessage={handleSendMessage} isTyping={isTyping} setTyping={setTyping} isDilemma={isDilemma}/>
          </div>
        </div>
      </div>
      {modal ? <Dilemma onSendMessage={handleSendMessage} onModal={setModal} setTyping={setTyping} setDilemma={setDilemma}/> :null}
        
      </>
    )
  }
  
  export default Chat