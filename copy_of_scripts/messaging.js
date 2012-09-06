$(document).ready(function(){

    // var client = new APE.Client();
    // client.load();

    // client.addEvent('load', function() {
    //     posted_by = prompt('Your name?');
    //     client.core.start({"name": posted_by});
    //     $("input[name='posted_by']").val(posted_by);
    // });

    // client.addEvent('ready', function() {
    //     //Once APE is ready, join the messages channel and wait for new messages
    //     client.core.join('messages');
    //     client.onRaw('postmsg', function(raw, pipe) {
    //         append_message(raw.data);
    //     });
    // });

    //Submit message functionality

    function vote(score)
    {
        $.ajax({
            type: "POST",
            url: "/vote/",
            data: "item_id=12345&vote=" + score + "&game=" + $('#gameID').attr('value'),
            success: function(res){
                $('.current-rating').width((res/5)*125);
                // $('.current-rating-result').html(res.status);
            }
        });
    }

    $('#inputMessage').keypress(function(e){
        if(e.which == 13){
            e.preventDefault();
            message = $(this).val();
            $(this).val("");
            $.ajax({
                type: "POST",
                url: "/send_message/",
                data: "message=" + message,
                success: function(res){
                    getMessages();
                }
            })
        }
    });

    getMessages = function()
    {
        $.ajax({
            type: "GET",
            url: "/get_messages/",
            success: function(messages){
                // msgObjs = jQuery.parseJSON(messages);
                $('#receivedMessages').empty();
                
                $.each(messages, function(i, message) { 
                    messageHTML = "<div class='messageInstance'><div id='messageUsername' class='" + message[2] + "'>" + message[1] + ': </div><div id="messageText">' + message[0] + "</div></div>";
                    $('#receivedMessages').prepend(messageHTML);
                });
            }
        });
    }

    setInterval(getMessages, 2000);
    window["getMessages"]();


    function append_message(data) {
        debugger;
        message_str = data.msg + '\nPosted by: <strong>'
                             + data.posted_by + '</strong> on: '
                             + data.timestamp;
        new_div = $('<div>').addClass('message').html(message_str);
        $('div#current_messages').append(new_div);
    }

    $('#msgform').submit(function() {
        $.post('/ajaxsubmit/',
            {posted_by: $("input[name='posted_by']").val(),
               message: $("textarea[name='message']").val()},
            append_message, 'json');
         //For brevity, we're just going to assume this always works
         $("textarea[name='message']").val('');
         return false;
    });

    $('#but2').click(function() {
        //Message clicked
    });
});