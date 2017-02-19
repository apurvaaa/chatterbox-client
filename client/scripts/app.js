var application = function(server) {
  this.server = server;  
  this.rooms = {};
  this.friends = new Set();
};

application.prototype.init = function() {
  var appContext = this;
  $(document).ready(function() {
    $('form').submit(function(event) {
      console.log(this);
      event.preventDefault();
      appContext.handleSubmit();
      appContext.fetch();

    });

    $('#roomSelect').change(function(event) {
      appContext.fetch(this.value);
    });

    $('#addRoom').on('click', function(event) {
      event.preventDefault();
      var room = document.getElementById('message').value;
      $('#message')[0].value = '';
      debugger;
      appContext.rooms[room] = true;
      appContext.renderRoom(appContext._escapeRegExp(room));
      $('#roomSelect').val(room).trigger('change');
      
    });
  });

  this.update();  
};

application.prototype.update = function() {
  var room = $('#roomSelect :selected').text();
  var appContext = this;
  this.fetch(room);
  setTimeout(function() {
    appContext.update();
  }, 2000);
};

application.prototype.send = function(msg) {
  var appContext = this;
  $('#message')[0].value = '';

  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    type: 'POST',
    data: JSON.stringify(msg),
    contentType: 'application/json',
    success: function (data) {
      appContext.fetch(msg.roomname);
      console.log('chatterbox: Message sent');
      
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });

};

//when i grow up i will learn to use where: {createdAt: {'$gt': '2017-02-19T00:17:59.432Z'}
application.prototype.fetch = function(room = 'lobby') {
  var appContext = this;
  var rooms = this.rooms;
  var removeEscape = this._escapeRegExp;
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    data: {order: '-createdAt', limit: 600},
    contentType: 'application/json',
    success: function (data) {
      console.log('fetch called');
      //find rooms
      appContext.clearMessages();
      data.results.forEach(m => {
        if (!rooms[m.roomname]) { 
          rooms[m.roomname] = true;
          appContext.renderRoom(m.roomname);
        }
        if (m.roomname === room) {
          m.text = removeEscape(m.text);
          m.username = removeEscape(m.username);
          appContext.renderMessage(m);
        }
      });
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
  var $msg = $('<div class = "text chat"></div>');
  var $username = $('<a class = "username" href="#" onclick="app.handleUsernameClick(this) "></a>');
  $username.html(message.username);
  var $messageBody = $('<div></div>');
  $messageBody.html(message.text);
  $msg.append($username);
  $msg.append($messageBody);
  if (this.friends.has(message.username)) {
    $msg.addClass('friend');
  }
  $('#chats').append($msg);
};

application.prototype.renderRoom = function(room, select = false) {
  var $option = $('<option></option>');
  $option.attr('value', room);
  if (select) {
    $option = $('<option value = ' + room + ' selected></option>');
  }
  $option.html(room);
  $('#roomSelect').append($option);
};

application.prototype.handleUsernameClick = function(username) {
  this.friends.add(username.innerHTML);
  $('.username').filter(function() { return this.innerHTML === username.innerHTML; })
   .parent().addClass('friend');
};


application.prototype.handleSubmit = function(form) {
  var tweet = (document.getElementById('message').value);
  var msg = {};
  msg.text = tweet;
  msg.username = window.location.search.slice(10);
  msg.roomname = document.getElementById('roomSelect').value;
  this.send(msg);
};


application.prototype._escapeRegExp = function (str) {
  if (str === undefined || str === '') {
    return '';
  }
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\\\^\$\|\<\>]/g, ' ');  
};

var app = new application('http://parse.sfm6.hackreactor.com/chatterbox/classes/messages');
app.init();

