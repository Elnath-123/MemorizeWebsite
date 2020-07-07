
/* 中英互译转换 */
$(".switch-btn").on("click", function(){
    var current_mode = $(".b-translate > p:first");
    var current_mode_textarea = $(".b-translate > textarea:first");
    current_mode_textarea.val("")
    var translate_to = $(".a-translate > p:first");
    var translate_to_textarea = $(".a-translate > textarea:first");
    translate_to_textarea.val("")
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

function truncate(q){
    var len = q.length;
    if(len<=20) return q;
    return q.substring(0, 10) + len + q.substring(len-10, len);
}

$("#start-trans").on("click", function(){
    var mapp = {"中文": "zh-CHS", "英文": "en"};
    var appKey = '40e850d8fa26e6cc';
    var key = 'S8Q6odlXu6FMsdRxdwLz6aZPOFkRP863';//注意：暴露appSecret，有被盗用造成损失的风险
    var salt = (new Date).getTime();
    var curTime = Math.round(new Date().getTime()/1000);
    var query = $(".translate-left").val();
    console.log(query)
    // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
    console.log($(".b-translate > p:first"))
    console.log($(".a-translate > p:first"))
    var from = mapp[$(".b-translate > p:first")];
    var to = mapp[$(".a-translate > p:first")];
    var str1 = appKey + truncate(query) + salt + curTime + key;
    console.log(str1);
    var sign = sha256(str1);
    $.ajax({
        url: 'http://openapi.youdao.com/api',
        type: 'post',
        dataType: 'jsonp',
        data: {
            q: query,
            appKey: appKey,
            salt: salt,
            from: from,
            to: to,
            sign: sign,
            signType: "v3",
            curtime: curTime,
        },
        success: function (data) {
            console.log(data);
            var translate_to_textarea = $(".a-translate > textarea:first");
            text = data["translation"]
            translate_to_textarea.val(text)
        } 
    });
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
