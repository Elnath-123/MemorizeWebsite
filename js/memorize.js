
/* 中英互译转换 */
$(".switch-btn").on("click", function(){
    var current_mode = $(".b-translate > p:first");
    var current_mode_textarea = $(".b-translate > textarea:first");

    var translate_to = $(".a-translate > p:first");
    var translate_to_textarea = $(".a-translate > textarea:first");

    if(current_mode.html() == "中文"){
        current_mode.html("英文");
        translate_to.html("中文");
        current_mode_textarea.attr("placeholder", "Please enter the English to be translated");
    }else{
        current_mode.html("中文");
        translate_to.html("英文");
        current_mode_textarea.attr("placeholder", "请输入需要翻译的中文");
    }
    /* ajax提交表单 */
});


$('.outer-memorize-in').on("click", function(){
    /* ajax 提交表单，获取本次需要背诵的词库 */
    
    console.log(words);
});

$(document).ready(function(){
    /* ajax 提交表单，获取本次需要背诵的单词 */

    /* 前端逻辑处理 */
    var words = {
        vocab_type: "六级词汇",
        review_num: 3,
        recite_num: 2,
        review: [
            {
                id: 18,
                word: "apple",
                pron: "[ˈæpl]",
                correct: "n.苹果",
                index: 0
            },
            {
                id: 19,
                word: "banana",
                pron: "[bəˈnɑːnə]",
                correct: "n.香蕉",
                index: 0
            },
            {
                id: 20,
                word: "grape",
                pron: "[ɡreɪp]",
                correct: "n.葡萄",
                index: 0
            }
        ],
        recite:[
            {
                id: 4,
                word: "JavaScript",
                pron: "[----]",
                correct: "n.一种编程语言",
                index: 0
            },
            {
                id: 8,
                word: "PHP",
                pron: "[pieichipi]",
                correct: "世界上最好的编程语言",
                index: 0
            }
        ]
    }
    var seq = 0;
    var recite_queue = words["recite"];
    var review_queue = words["review"];
    var recite_review_queue = [];
    localStorage.setItem("recite_review_queue", JSON.stringify(recite_review_queue));
    localStorage.setItem("recite_queue", JSON.stringify(recite_queue));
    localStorage.setItem("review_queue", JSON.stringify(review_queue));
    localStorage.setItem("words", JSON.stringify(words));
    localStorage.setItem("seq", seq);
    localStorage.setItem("mode", "review")
    vocab_type = words["vocab_type"];
    $(".current-vocab").html("<p>当前词库：<font color='blue'>" + vocab_type + "</font></p>")    
    var mode = getCurrentMode();
    render_html(words, seq, mode);
    localStorage.setItem("seq", seq + 1);
})

function render_html(words, seq, mode){
    console.log(mode);
    if(mode == "review"){
        review = getReviewQueue();
        review_num = words["review_num"];
        var word = review[seq];
        var word_pron = word["pron"];
        var word_spell = word["word"];
        $(".memory-progress").html("<p>进度：<font color='red'>" + (seq + 1) + "</font>/" + review_num + "</p>");
        $(".word").html(word_spell + ' ' + word_pron);
        $(".current-mode > p:first").html("<p>当前您正在：<font color='red'>复习</font></p>")
    }
    else if(mode == "recite"){
        recite = getReciteQueue();
        recite_num = words["recite_num"];
        var word = recite[seq];
        var word_pron = word["pron"];
        var word_spell = word["word"];
        $(".memory-progress").html("<p>进度：<font color='red'>" + (seq + 1) + "</font>/" + recite_num + "</p>");
        $(".word").html(word_spell + ' ' + word_pron);
        $(".current-mode > p:first").html("<p>当前您正在：<font color='red'>背诵</font></p>")
    }else{
        recite = getReciteReviewQueue();
        //console.log(recite.length);
        //console.log(recite[0]);
        if(!recite.length) return;
        var word = recite.shift();
        var word_pron = word["pron"];
        var word_spell = word["word"];
        /* 复习刚背诵的单词时， 隐藏进度 */
        $(".memory-progress").hide();
        $(".word").html(word_spell + ' ' + word_pron);
        $(".current-mode > p:first").html("<p>当前您正在：<font color='red'>复习背诵的新单词</font></p>")
    }
    
}

$("#not-familiar, #not-determined, #familiar").on("click", function(){
    words = getWords();
    var mode = getCurrentMode();
    //console.log(mode);
    seq = getCurrentSequence();

    select_content = this.innerHTML;
    updateIndex(select_content, seq - 1, mode);
    /* 判断是否背诵结束 */
    if(judgeExit(words, seq + 1, mode))
        return true;

    render_html(words, seq, mode);
    localStorage.setItem('seq', seq + 1);
})
/*
function render_button_html(mode, seq, max_seq, type){
    if(mode == "review"){
        var review = getReviewQueue();
        if(type == "left-button"){
            if(seq == 0) $("#left-btn").attr("src", "img/left-arrow-invalid.png");
            else $("#left-btn").attr("src", "img/left-arrow-valid.png");
        }else if(type == "right-button"){
            if(seq == review.length) $("#right-btn").attr("src", "img/right-arrow-invalid.png");
            else $("#left-btn").attr("src", "img/right-arrow-valid.png");
        }
    }else if(mode == "recite"){
        var recite = getReciteQueue();
        if(type == "left-button"){

        }else if(type == "right-button"){

        }
    
    }
}

$(".left-button").on("click", function(){
    var mode = getCurrentMode();
    var seq = getCurrentSequence();
    var type = this.attr("class");
    localStorage.setItem("curr_seq", seq);
    setSequence(seq - 1);
    var curr_seq = localStorage.getItem("curr_seq");
    render_button_html(mode, seq, seq + 1, type);
});
*/
$(".right-button").on("click", function(){
    var mode = getCurrentMode();
    var seq = getCurrentSequence();
    var type = this.attr("class");
    setSequence(seq + 1);
    render_button_html(mode, seq, type);
});

function updateIndex(select_content, seq, mode){

    if(mode == 'review'){
        if(select_content == "认识"){
            decIndex(2, seq);
        }else if(select_content == "模糊"){
            decIndex(1, seq)
        }else{
            /* 复习时不认识： 则不做任何操作 */
        }
    }else if(mode == "recite"){
        if(select_content == "认识"){
            /* 背诵时认识， 不做任何操作 */
        }else if(select_content == "模糊"){
            incIndex(1, seq);
        }else{
            incIndex(2, seq);
        }
    }else{
        /* 复习所背诵的新单词，不更新指数，只将不认识/模糊，重新入队 */
        if(select_content == "认识"){
            /* 复习新单词时认识， 不做任何操作 */
        }else{
            recite_review_queue = getReciteReviewQueue();
            appendAgain(recite_review_queue[0]);
            console.log("queue length:" + recite_review_queue);
        }
        popFromReviewQueue();
    }
}

function judgeExit(words, seq, mode){
    if(mode == "review"){
        var review_max_seq = words["review_num"];
        if(seq > review_max_seq){
            alert("本次复习已完成！");
            /* ajax提交表单 */
            
            /* 后续处理，开始背诵新单词 */
            render_html(words, 0, "recite");
            setMode("recite");
            setSequence(1);
            return true;
        }
    }else if(mode == "recite"){
        var recite_max_seq = words["recite_num"];
        if(seq > recite_max_seq){
            alert("本次背诵新单词已完成，请再次背诵不熟悉的单词");
            /* ajax提交表单 */

            review = JSON.stringify(getReviewQueue());
            recite = JSON.stringify(getReciteQueue());
            console.log(review);
            console.log(recite);
            /* 后续处理， 返回主页面 */
            recite_review = getReciteReviewQueue();
            if(!recite_review.length){
                /* 背诵结束 */
                reciteEnd();
                return true;
            }
            console.log("now-" + JSON.stringify(getReciteReviewQueue()));
            render_html(words, 0, "recite_review");
            setMode("recite_review");
            return true;
        }
    }else{
        /* recite_review */
        recite_review = getReciteReviewQueue();
        if(!recite_review.length){
            /* 背诵结束 */
            console.log("END!!!!!!!!!!!")
            reciteEnd();
            return true;
        }
    }
}

function reciteEnd(){
    alert("背诵结束");
    location.href = "app.html"
}

function decIndex(num, seq=0){
    review = getReviewQueue();
    review[seq]["index"] -= num;
    setReviewQueue(review);
}

function incIndex(num, seq=-1){
    if(getCurrentMode() == "recite"){
        recite = getReciteQueue();
        recite[seq]["index"] += num;
        setReciteQueue(recite);
        appendToReviewQueue(recite, seq);
    }
}

function appendToReviewQueue(recite, seq){
    recite_review_queue = JSON.parse(localStorage.getItem("recite_review_queue"));
    recite_review_queue.push(recite[seq]);
    recite_review_queue = localStorage.setItem("recite_review_queue", JSON.stringify(recite_review_queue));
}

function appendAgain(word){
    recite_review_queue = JSON.parse(localStorage.getItem("recite_review_queue"));
    recite_review_queue.push(word);
    console.log(recite_review_queue);
    recite_review_queue = localStorage.setItem("recite_review_queue", JSON.stringify(recite_review_queue));
}

function popFromReviewQueue(){
    recite_review_queue = JSON.parse(localStorage.getItem("recite_review_queue"));
    recite_review_queue.shift();
    localStorage.setItem("recite_review_queue", JSON.stringify(recite_review_queue));
}

function getReciteReviewQueue(){
    return JSON.parse(localStorage.getItem("recite_review_queue"));
}


function getWords(){
    return JSON.parse(localStorage.getItem("words"));
}

function setReviewQueue(new_review_queue){
    localStorage.setItem("review_queue", JSON.stringify(new_review_queue));
}

function setReciteQueue(new_recite_queue){
    localStorage.setItem("recite_queue", JSON.stringify(new_recite_queue));
}

function getReviewQueue(){
    return JSON.parse(localStorage.getItem("review_queue"));
}

function getReciteQueue(){
    return JSON.parse(localStorage.getItem("recite_queue"));
}

function setWords(words){
    localStorage.setItem("words", JSON.stringify(words));
}

function getCurrentSequence(){
    return parseInt(localStorage.getItem("seq"));
}

function getCurrentMode(){
    return localStorage.getItem("mode");
}

function setSequence(new_seq){
    localStorage.setItem("seq", new_seq);
}

function setMode(new_mode){
    localStorage.setItem("mode", new_mode);
    return true;
}

function getCorrectWord(seq, mode){
    words = getWords();
    if(mode == "review"){
        review = words["review"];
        return review[seq]["correct"]; 
    }else if (mode == "recite"){
        recite = words["recite"];
        return recite[seq]["correct"];
    }
}

$("body").not(".selection").click( function() {
    seq = getCurrentSequence();
    mode = getCurrentMode();
    
    if(mode == "recite_review")
        correct = getReciteReviewQueue()[0]["correct"];
    else
        correct = getCorrectWord(seq - 1, mode);
    $(".correct-answer").html("<h3 class='correct-answer'><font color='green'>" + correct + "</font></h3>")
    var correct = $(".correct-answer").toggle();

});

$('.selection').click(function(e){
    // 阻止按键事件冒泡
    if(e.stopPropagation){
      e.stopPropagation();
    }
});
