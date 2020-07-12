(function ($) {
    $(document).ready(function(){
        $.ajax({
            method: "post",
            url: "/admin_auth/",
            dataType: "json",
            data: {
            },
            success: function(result){
                result = result['result']
                if(result == -1){
                    alert("您没有权限进入此页面");
                    location.href = '/app'
                }
            },
            error : function(e) {
                alert("异常！");
            }
        });
    })
})(jQuery);