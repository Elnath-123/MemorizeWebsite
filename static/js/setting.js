$(document).ready(function(){
    console.log("in setting")
    if($.cookie('username') && $.cookie('password')){
        console.log($.cookie('username'))
        console.log($.cookie('password'))
    }else{
        alert("您还没有登陆")
        location.href = '/login'
    }
});

$("#logout-item").on("click", function(){
    console.log("logout")
    $.removeCookie("username",{ path: '/'})
    $.removeCookie("password",{ path: '/'})
})