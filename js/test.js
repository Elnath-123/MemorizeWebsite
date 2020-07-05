$('.start-button').on("click", function(){
    /* ajax 提交表单，获取本次需要背诵的词库 */
    
    console.log(words);
});

$(document).ready(function(){
    /* ajax 提交表单 */
    var words = {
        select_vocab: true,
        test_num: 5,
        test_word: [
            {
                id: 18,
                word: "apple",
                pron: "[ˈæpl]",
                correct: "n.苹果",
                options: ["n.葡萄", "n.苹果", "n.猕猴桃", "n.香蕉"]
            },
            {
                id: 19,
                word: "banana",
                pron: "[bəˈnɑːnə]",
                correct: "n.香蕉",
                options: ["n.香蕉", "n.葡萄", "n.猕猴桃", "n.苹果"]
            },
            {
                id: 20,
                word: "grape",
                pron: "[ɡreɪp]",
                correct: "n.葡萄",
                options: ["n.苹果", "n.猕猴桃", "n.香蕉", "n.葡萄"]
            }
        ]
    }
    if(!words.select_vocab){
        alert("您还没有选择词库，请选择词库后再进行测验");
        location.href = "setting.html";
    }
    localStorage.setItem("words", JSON.stringify(words));
});
