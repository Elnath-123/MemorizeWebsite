
(function ($) {
    "use strict";


     /*==================================================================
    [ Focus input ]*/
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })    
    })
  
  
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.register-validate-form').on('submit',function(){
        var check = true;
        for(var i=0; i<input.length; i++) {
            //console.log($(input[i]).val())
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check = false;
            }
        }   
        var pwd = $(input[1]).val();
        var confirm_pwd = $(input[2]).val();
        if ( pwd != confirm_pwd ){
            alert("两次输入密码不一致，请重新输入");
            $(input[1]).val("");
            $(input[2]).val("");
            $(input[1]).focus();
            check = false;
        }
        return check;
    });

    $('.login-validate-form').on('submit',function(){
        var check = true;
        for(var i=0; i<input.length; i++) {
            //console.log($(input[i]).val())
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check = false;
            }
        }
        var pwd = $(input[1]).val();
        var confirm_pwd = $(input[2]).val();
        return check;
    });

    $('.login-validate-form .input100 .register-validate-form').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    $('.login100-form-btn').on('click', function(){
        /*$.ajax({
            url: "login.json" ,
            type: "GET",
            dataType: "json",
            //data: {},
            success: function (res) {
                console.log(res);
            },
            error : function() {
                alert("error！");
            }
        });*/
        //location.href =
       // return false;
    })
    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }

    
})(jQuery);

