
(function ($) {

    let NOT_SELECT_VOCAB = 1;
    let MEM_IN_SUCCESS = 2;
    $("#start-memory").on("click", function(){
        /* ajax 提交表单，获取本次需要背诵的词库 */
        console.log("start-memory!")
        $.ajax({
            //几个参数需要注意
            type: "POST",//方法类型
            dataType: "json",//预期服务器返回的数据类型
            url: "/app/memorize_in/memorize_in_handler/" ,//url
            data: {
            },
            success: function (result) {
                result = result['memorize_in']
                console.log(typeof(result))
                if(result == NOT_SELECT_VOCAB){
                    alert("您还没有选择词库，请选择你想要背诵的词库和计划")
                    location.href = '/setting/'
                }else if(result == MEM_IN_SUCCESS){
                    alert("开始背诵")
                    location.href = '/app/memorize/'
                }
            },
            error : function(e) {
                alert("异常！");
            }
        });
    });
})(jQuery);
