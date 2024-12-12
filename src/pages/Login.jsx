import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Login() {
    
  const [validation, setValidation] = useState(true);
  const [validText, setValidText] = useState("");
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [id, setId] = useState("sky76601@gmail.com");
  const [pw, setPw] = useState("123456abc@!");
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    id:"",
    validId: false,
    pw: "",
    validPw: false,
  });
  const submitRequirements =
    inputValue.id &&
    inputValue.validId &&
    inputValue.pw &&
    inputValue.validPw ;
  const inputRegExps = {
    idRegExp: /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/,
    pwRegExp: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[@#$%^&+=!])(?!.*\s).{6,}$/,
  }

  function handleChageId(e) {
    setId(e.target.value);
  }

  function handleChagePw(e) {
    setPw(e.target.value);
  }
  function onSubmit() {
    if(id&&pw){
        if(inputRegExps.idRegExp.test(id)&&inputRegExps.pwRegExp.test(pw)){
            
            axios.get("https://firestore.googleapis.com/v1/projects/kallaris-ee3c6/databases/(default)/documents/member")
            .then((response) => {
                const item = response.data.documents;
                if(item){
                    console.log("전체데이터:",item);

                    const user = item.find((item)=> item.fields.mmEmail?.stringValue === id && item.fields.mmPassword?.stringValue === pw);
                    if(user){
                        setValidText("");
                        console.log("로그인유저: ",user);
                        console.log("로그인유저이름: ",user.fields.mmName);
                        document.querySelector("#item_pw").classList.remove("invalid_input");
                        document.querySelector("#item_id").classList.remove("invalid_input");
                        setisLoggedIn(true);
                        setValidation(true);
                        alert(user.fields.mmName.stringValue+"님 환영합니다. !~!");
                        navigate(`home`);
                    }else{
                        console.log("유저 없음");
                        setValidText("아이디와 비밀번호가 알맞지 않습니다. \n 다시 정확히 입력해주세요.");
                        setisLoggedIn(false);
                        setValidation(false);
                        document.querySelector("#item_pw").classList.add("invalid_input");
                        document.querySelector("#item_id").classList.add("invalid_input");
                    }
                }else{
                    console.log("데이터 없음");
                }
            }).catch((err) => {
                console.error('에러 발생:', err);
            });
        }else{
            console.log(inputRegExps.idRegExp.test(id));
            console.log(inputRegExps.pwRegExp.test(pw));
            setValidText("아이디와 비밀번호의 형식이 알맞지 않습니다. \n 다시 정확히 입력해주세요.");
            setValidation(false);
            document.querySelector("#item_pw").classList.add("invalid_input");
            document.querySelector("#item_id").classList.add("invalid_input");
        }
    }else{
        setValidation(false);
        if(!id){
            setValidText("아이디를 입력해주세요.");
            document.querySelector("#item_id").classList.add("invalid_input");
            document.querySelector("#item_pw").classList.remove("invalid_input");
        }else if(!pw){
            setValidText("비밀번호를 입력해주세요.");
            document.querySelector("#item_id").classList.remove("invalid_input");
            document.querySelector("#item_pw").classList.add("invalid_input");
        }
    }
    
  }

  return (
    <>
      <div id='login' className='login'>
        <div className='loginContents'>
          <div>
            <div className='form_item'>
              <label htmlFor="item_id">아이디[이메일]</label>
              <input type="email" name='item_id' onChange={handleChageId} value={id} id='item_id' pattern="^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$" />
            </div>
            <div className='form_item'>
              <label htmlFor="item_pw">비밀번호</label>
              <input type="password" name='item_pw' onChange={handleChagePw} value={pw} id='item_pw' pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?!.*\s).{6,}$" />
            </div>
            <div className='validation_text'>{validText}</div>
          </div>
          <div>
            <button onClick={onSubmit}>로그인</button>
          </div>
        </div>
        
        {/* {data && (
          <textarea
            rows={7}
            value={JSON.stringify(data, null, 2)}
            readOnly={true}
          />
        )} */}
      </div>
    </>
  )
}

export default Login
