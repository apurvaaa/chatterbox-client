var application = function() {
  
};

application.prototype.init = function() {};

application.prototype.send = function(msg) {
  /*var form = document.createElement('form');
  form.setAttribute('type', 'hidden');
  form.setAttribute('method', 'POST');
  form.setAttribute('action', 'http://parse.sfm6.hackreactor.com');
*/
  var data = document.createElement('input');
 /* data.setAttribute('username', msg.userName);
  data.setAttribute('text', msg.text);
  data.setAttribute('roomname', msg.roomname);
  
  form.appendChild(data);
  form.submit();*/

/*
  $.ajax({
	type: "POST",
	url: url,
	data: data,
	success: success,
	dataType: dataType
  });*/

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

var app = new application();
