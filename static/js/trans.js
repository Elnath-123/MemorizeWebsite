
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

$("#function").on("click", function(){
    location.href = "/app#useita"
});

$("#main-page").on("click", function(){
    location.href = "/app"
});

$("#register").on("click", function(){

});

$("#login").on("click", function(){

});
