var application = function(server) {
  this.server = server;  
  this.rooms = {};
  this.friends = new Set();
  //this.selectedRoom = 'lobby';
};

application.prototype.init = function() {
  var appContext = this;
  // this.fetch();

  //setInterval(this.fetch.bind(appContext), 2000);
 
  $(document).ready(function() {
    $('form').submit(function(event) {
      console.log(this);
      //debugger;
      event.preventDefault();
      appContext.handleSubmit();
      appContext.fetch();
    });

    $('#roomSelect').change(function(event) {
     // event.preventDefault();
     //debugger;
      appContext.fetch(this.value);

    });

    $('#addRoom').on('click', function(event) {
      event.preventDefault();
      var room = document.getElementById('message').value;
      appContext.rooms[room] = true;
      appContext.renderRoom(appContext._escapeRegExp(room));
    });
  });

  this.update();
  // debugger
  
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
  //debugger
  var appContext = this;

  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    type: 'POST',
    data: JSON.stringify(msg),
    contentType: 'application/json',
    success: function (data) {
      //debugger;
      appContext.fetch(msg.roomname);
      console.log('chatterbox: Message sent');
      
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });

  //$.post('http://parse.sfm6.hackreactor.com/api/users',data,callback);
};

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
        rooms[m.roomname] = true;
        //debugger;
        if (m.roomname === room) {
          m.text = removeEscape(m.text);
          m.username = removeEscape(m.username);
          appContext.renderMessage(m);
        }
        //console.log(m.roomname);

      });
      //debugger;
      appContext.populateRoomList(room);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

application.prototype.clearMessages = function() {
  $('#chats').html('');
  $('#roomSelect').html('');

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
  // debugger;
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
  // console.log(username.innerHTML);
  // debugger;
  this.friends.add(username.innerHTML);
  $('.username').filter(function() { return this.innerHTML === username.innerHTML; })
   .parent().addClass('friend');
};



application.prototype.handleSubmit = function(form) {
  // console.log(form);

  var tweet = (document.getElementById('message').value);
  var msg = {};
  msg.text = tweet;
  msg.username = window.location.search.slice(10);
  msg.roomname = document.getElementById('roomSelect').value;
  this.send(msg);
};

application.prototype.populateRoomList = function(selectedRoom) {
  //$('select').find('')
  for (var room in this.rooms) {
    if (room === selectedRoom) {
      this.renderRoom(room, true);
    } else {
      this.renderRoom(room);
    }
  }

};

application.prototype._escapeRegExp = function (str) {
  if (str === undefined || str === '') {
    return '';
  }
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\\\^\$\|\<\>]/g, ' ');
  
  // return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|\<\>]/g, '\\$&');
};

var app = new application('http://parse.sfm6.hackreactor.com/chatterbox/classes/messages');
app.init();

