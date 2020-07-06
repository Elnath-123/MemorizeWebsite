$('#test-start').on("click", function(){
    /* ajax 提交表单，获取本次需要背诵的词库 */
    
    location.href='/app/test_in/test'
});

$('#return-main').on("click", function(){
    location.href="/app"
});

$(document).ready(function(){
    /* ajax 提交表单 */
    var words = {
        select_vocab: true,
        test_num: 3,
        test_word: [
            {
                id: 20,
                word: "grape",
                pron: "[ɡreɪp]",
                correct: "n.葡萄",
                options: ["n.苹果", "n.猕猴桃", "n.香蕉", "n.葡萄"]
            },
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
            }
            
        ]
    }
    var seq = 0;
    var fault_num = 0;
    var fault = {};
    if(!words.select_vocab){
        alert("您还没有选择词库，请选择词库后再进行测验");
        location.href = "setting.html";
    }
    localStorage.setItem("fault_num", fault_num);
    localStorage.setItem("fault", JSON.stringify(fault));
    localStorage.setItem("seq", seq);
    localStorage.setItem("words", JSON.stringify(words));
    render_html(words, seq);
    
});

function render_html(words, seq){
    test_word = words.test_word; 
    test_num = words["test_num"];
    var word = test_word[seq];
    var word_pron = word["pron"];
    var word_spell = word["word"];
    $(".memory-progress").html("<p>进度：<font color='red'>" + (seq + 1) + "</font>/" + test_num + "</p>");
    $(".word").html(word_spell + ' ' + word_pron);
    $(".current-mode > p:first").html("<p>当前您正在：<font color='red'>单词测验</font></p>")

    var options = word["options"];
    for(var i = 1; i <= options.length; i++){
        $("#btn" + i).html(options[i - 1]);
    }
}

$("#btn1, #btn2, #btn3, #btn4").on("click", function(){
    var content = this.innerHTML;
    var seq = getCurrentSequence();
    var words = getWords();
    console.log(seq);
    var correct_word = words["test_word"][seq]["correct"];
    if(content != correct_word){
        var fault = JSON.parse(localStorage.getItem("fault"));
        var word = words["test_word"][seq]["word"];
        fault[word] = correct_word;
        localStorage.setItem("fault", JSON.stringify(fault)); 
        
        var fault_num = parseInt(localStorage.getItem("fault_num"));
        fault_num++;
        localStorage.setItem("fault_num", fault_num);
        console.log("yes!!!")
    }
    if(seq == words["test_num"] - 1){
        /*ajax submit form*/
        alert("单词测验结束。");
        $(".outer-test").hide();
        var fault_num = localStorage.getItem("fault_num");
        var fault = localStorage.getItem("fault");
        var acc = (words["test_num"] - fault_num) * 1.0 / words["test_num"];
        console.log((acc * 100).toFixed(2) + "%");
        console.log(fault)
        fault = JSON.parse(fault);
        $("body").append("<div>您本次测验的正确率为:<font color='red'> " + (acc * 100).toFixed(2) + "%<font/><div/>");
        $("body").append("您本次选错了以下单词:")
        for(var key in fault){
            $("body").append("<div>" + key + "  :  " + fault[key] + "<div/>");
        }
        $("#return-main").html("返回主页");
        return;
    }
    
    localStorage.setItem("seq", seq + 1);
    render_html(words, seq + 1)
    
})

function getCurrentSequence(){
    return parseInt(localStorage.getItem("seq"));
}

function getWords(){
    return JSON.parse(localStorage.getItem("words"));
}