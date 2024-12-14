import { useState,useCallback,useEffect } from "react";
import axios from 'axios';
import RecieveChatCard from "../component/RecieveChatCard";
import SeneChatCard from "../component/SeneChatCard";

function Chat() {
    const [isSend,setSend] = useState(false);
    // const [aidelay, setAidelay] = useState(true);
    let aidelay =  true;
    const [userInputMsg, setUserInputMsg] = useState("");
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [aiChat, setAiChat] = useState("");
    const [chatArr, setChatArr] = useState([]);
    const userInfo = {
      name:"이하늘"
    } 
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    function chatList() {
      axios.get("https://firestore.googleapis.com/v1/projects/kallaris-ee3c6/databases/(default)/documents/chatlogs")
      .then((response) => {
          const items = response.data.documents;
          console.log("items:",items);
          const newChatItems = [];
          if(items !=null){
            if(items.length > 1){
              for (const item of items) {
                newChatItems.push(item.fields);
              }
            }else{
              console.log("items.fields:",items[0].fields);
              newChatItems.push(items[0].fields);
            }
          }
          
          // console.log("newChatItems:",newChatItems);
          newChatItems.sort((a,b)=>{
            // console.log("a.created_at:",a.created_at.stringValue);
            return new Date(a.qu_created_at.stringValue) - new Date(b.qu_created_at.stringValue);
          })
          console.log("sort:",newChatItems);
          // 상태를 한 번만 업데이트
          setChatArr((prevChatArr) => [...prevChatArr, ...newChatItems]);
          // setChatArr((chatArr) => chatArr.concat(items));
          // console.log(items[0].fields);
          // console.log(items);
          setMessages(newChatItems);
      }).catch((err) => {
          console.error('에러 발생:', err);
      });
    }


    useEffect(() => {
      chatList();
    }, [isSend]);

    // function aiChatapi() {
    //   console.log("aiChatapi");
    //   if(userInputMsg.includes("안녕")){
    //     setAiChat("안녕하세요~!");
    //     return "안녕하세요~!";
    //   }else{
    //     console.log("NON");
    //     const sendToOpenAI = async (userInputMsg) => {
    //       try {
    //         console.log("sendToOpenAI");
    //         const response = await axios.post(
    //           'https://api.openai.com/v1/chat/completions',
    //           {
    //             model: 'gpt-3.5-turbo',
    //             messages: [
    //               { role: 'user', content:"짧게 대답해주세요."+ userInputMsg }
    //             ],
    //             max_tokens: 90
    //           },
    //           {
    //             headers: {
    //               'Content-Type': 'application/json',
    //               'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
    //             }
    //           }
    //         );
    //         console.log("ai:"+response.data.choices[0].message.content);
    //         return response.data.choices[0].message.content;
    
    //       } catch (error) {
    //         if (axios.isAxiosError(error)) {
    //           if (error.response?.status === 429) {
    //             // 호출 제한 초과 시 대기 후 재시도
    //             console.warn("API 호출 제한 초과. 5초 후 재시도합니다.");
    //             await delay(5000); // 5초 대기
    //             return sendToOpenAI(userInputMsg); // 재시도 호출
    //           }
    //           // 네트워크 오류 처리
    //           console.error("OpenAI API 호출 중 네트워크 오류 발생:", error.message);
    //           alert("AI 응답을 가져오는 중 오류가 발생했습니다. 다시 시도해 주세요.");
    //         } else {
    //           // 예상치 못한 오류 처리
    //           console.error("예상치 못한 오류 발생:", error);
    //         }
    //       }
    //     };
    //   }
    // }
    
    
    const sendMessageHandler = useCallback(async () => {
      // const today = new Date();
      // const year = today.getFullYear();
      // const month = (today.getMonth() + 1).toString().padStart(2,'0');
      // const day = today.getDate().toString().padStart(2,'0');
      // const nowdate = `${year}-${month}-${day}`;
      // aiChatapi();
      setMessage(userInputMsg);
      let userTime = new Date().toString();
      if(aidelay===true){
        setTimeout(() =>aidelay = true,30000);
        let aimsg = "";
        let aiTime = "";
        if(userInputMsg.includes("안녕")){
          setAiChat("안녕하세요~!");
          aimsg = "안녕하세요~!";
          await delay(10000);
          aiTime = new Date().toString();
        }else{
          console.log("NON");
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
          };
          await delay(10000); //10초
          aimsg = await sendToOpenAI(userInputMsg);
          aiTime = new Date().toString();
          console.log("innner aimsg",aimsg);
        }
        console.log("aimsg",aimsg);
        console.log("aiTime:",aiTime);
        console.log("탕미:",userTime);
        const data = {
          fields:{
            answer:{stringValue:aimsg,},
            an_created_at:{stringValue:aiTime,},
            question:{stringValue:userInputMsg,},
            qu_created_at:{stringValue:userTime,},
            
          }
        }
        // setChatArr((prevChatArr) => prevChatArr.concat(data));
        console.log(data);
        axios.post("https://firestore.googleapis.com/v1/projects/kallaris-ee3c6/databases/(default)/documents/chatlogs?key={AIzaSyDPoHHMIn0W5AK5wahwtbh-lzgeqZx2P7U}",
          data
        )
        .then(() => {
            setUserInputMsg("");
            setSend(true);
            aidelay = false;
            // setAidelay(false);
        }).catch((err) => {
            console.error('에러 발생:', err);
        });
      }else{
        alert("아직 30초가 안지났습니다");
      }
      
      // socket.emit("send message", {
      //   author: userInfo.name,
      //   message: userInputMsg,
      //   time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      // });
    }, [userInputMsg, userInfo.name,aiChat]);

    const changeMessage = useCallback((e) => {
      setUserInputMsg(e.target.value);
      setSend(false);
    }, []);
    // useEffect(() => {
    //   console.log("Updated chatArr:", chatArr);
    //   console.log("isSend"+isSend);
    //   console.log("messages:",messages);
    // }, [chatArr]);

    
    const [date, setDate] = useState(()=> new Date())
  
    useEffect(()=>{
      const timeId = setInterval(()=>tick(),1000)
      // console.log('setInteval')
  
      return() =>{
        clearInterval(timeId)
        // console.log('clearInterval')
  
      }
    })
    const tick =() =>{
      setDate(new Date())
    }
    return (
      <>
      <div id="chat" className="chat">
        <div className="page_title">
            <h1>Chat</h1>
            <p>시간 : {date.toLocaleTimeString()}</p>
        </div>
        <div className="chat_area">
          <div className="chat_content">
          {messages.map((messageContent,index) => {
              return (
                <div key={index}>
                  <div className="chat_item question_chat">
                    {/* <div className="profile_info">
                      <div className="profile_img"></div>
                      <p className="profile_name">사용자이름</p>
                    </div> */}
                    <div className="chat_message">{message||messageContent.question.stringValue}</div>
                    <div className="chat_time">{new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()||messageContent.qu_created_at.stringValue}</div>
                  </div>
                  <div className="chat_item answer_chat">
                    <div className="profile_info">
                      <div className="profile_img"></div>
                      <p className="profile_name">냥냥이(AI)</p>
                    </div>
                    <div className="chat_message">{messageContent.answer.stringValue}</div>
                    <div className="chat_time">{messageContent.an_created_at.stringValue}</div>
                  </div>
            {/* {chatArr.map((messageContent,index) => {
              return (
                <div key={index}>
                  <div className="chat_item question_chat">
                  {messageContent.question.stringValue}
                  </div>
                  <div className="chat_item answer_chat">
                    {messageContent.answer.stringValue}
                  </div> */}
                  
                  {/* <RecieveChatCard
                    massage={messageContent.answer}
                      time={messageContent.created_at}
                      // author={messageContent.author}
                    /> */}
                  {/* {userInfo.name === messageContent.author ? (
                    <SeneChatCard massage={messageContent.message} time={messageContent.time} />
                  ) : (
                    <RecieveChatCard
                      
                      massage={messageContent.answer}
                      time={messageContent.created_at}
                      // author={messageContent.author}
                    />
                  )} */}
                </div>
              );
            })}
          </div>
          <div className="chat_inputBox">
            <input 
                type="text" 
                name="" 
                id="chat_input" 
                className="chat_input" 
                placeholder="냥냥이와 이야기를 나눠보세요!"
                value={userInputMsg}
                onChange={changeMessage}
                onKeyDown={(event) => {
                  event.key === "Enter" && sendMessageHandler();
                }}   
                />
            <button onClick={sendMessageHandler} className="chat_submit">전송</button>
          </div>
        </div>
      </div>
        
        
      </>
    )
  }
  
  export default Chat