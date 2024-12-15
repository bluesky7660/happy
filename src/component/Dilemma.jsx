import { useState} from "react";
function Dilemma() {
    const [isSelected, setSelected] = useState("항목 선택");
    const selectedClick = (e) => {
        e.target.classList.toggle("active");
        document.getElementById("select_options").classList.toggle("collapse");
    }
    const optionSelected = (e) => {
        // console.log(e.target.className);
        // console.log(e.currentTarget.classList);
        // console.log(document.querySelectorAll(".select_option").className);
        document.querySelectorAll(".select_option").forEach(e => 
            e.classList.remove("active")
        );
        
        e.target.classList.toggle("active");
        
        setSelected(e.target.textContent);
    }
    return (
      <>
        <div id="dilemma" className="dilemma modal">
            <div className="dilemma_wrapper">
                <div className="title">
                    <h3>고민 주제 선택하기</h3>
                </div>
                <div className="select_wrapper">
                    <div className="sub_title" >고민 주제</div>
                    <div className="select_selected" onClick={selectedClick}>
                        <div className="selected_text">{isSelected}</div>
                        <div>▼</div>
                        {/* <div>{?▼:▲}</div> */}
                    </div>
                    <div id="select_options" className="select_options">
                        <div className="select_options_wrapper">
                            <div className="select_option" onClick={optionSelected}>학업진로</div>
                            <div className="select_option" onClick={optionSelected}>대인관계</div>
                            <div className="select_option" onClick={optionSelected}>인터넷-스마트폰 중독</div>
                            <div className="select_option" onClick={optionSelected}>가족</div>
                        </div>
                    </div>
                </div>
                <div className="textarea_wrapper">
                    <div className="sub_title">고민 내용</div>
                    <div>
                        <textarea name="dilemma_text" id="dilemma_text" className="dilemma_text" autoFocus placeholder="내용을 적어주세요" ></textarea>
                    </div>
                </div>
                <div className="submit_button">
                    <button>확인</button>
                </div>
            </div>
        </div>
      </>
    )
}
  
export default Dilemma