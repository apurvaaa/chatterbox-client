var application = function() {
  this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';  
};

application.prototype.init = function() {

};

application.prototype.send = function(msg) {


  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    type: 'POST',
    data: JSON.stringify(msg),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });

  //$.post('http://parse.sfm6.hackreactor.com/api/users',data,callback);
};

application.prototype.fetch = function() {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

application.prototype.clearMessages = function() {
  $('#chats').html('');

};

application.prototype.renderMessage = function(message) {
  var $msg = $('<div class = "text"></div>');
  //pass the rooms later
  var $username = $('<a class = "username" href="#" onclick="app.handleUsernameClick(this) "></a>');
  $username.html(message.username);
  var $messageBody = $('<div></div>');
  $messageBody.html(message.text);
  $msg.append($username);
  $msg.append($messageBody);
  $('#chats').append($msg);
};

application.prototype.renderRoom = function(room) {
  var $option = $('<option value = ' + room + '></option>');
  $option.html(room);
  $('#roomSelect').append($option);
};

application.prototype.handleUsernameClick = function(username) {
  console.log(username.innerHTML);
};

application.prototype.handleSubmit = function(form) {
  // console.log(form);
  var a = form;
  console.log(document.getElementById('message').value);
  console.log(username);
};

var app = new application();

