$(document).ready(() => {
  $.ajax({
    type: "GET",
    url: "http://spartacodingclub.shop/sparta_api/weather/tokyo",
    data: {},
    success: (response) => {
      let temperature = response.temp;
      let text = `Current Temperature at Tokyo: ${temperature}°C 🌞`;

      if (temperature > 30) {
        text = `Current Temperature at Tokyo: ${temperature}°C 🔥`;
      } else if (temperature < 15) {
        text = `Current Temperature at Tokyo: ${temperature}°C 🥶`;
      }

      $('#weather').text(text);
    }
  });

  showMessages();

});

const messageBox = $('#fans-message');
// Additional post Fan Message
function postMessage() {
  let message = $('#fanMessage').val();
  let nickname = $('#nickname').val();

  const sendBtn = $('#send-btn');
  const loadBtn = $('#loading-btn');
  const alertSuccess = $('.alert-success');

  const form = document.forms["message-form"]
  if (!message) {
    message = "No Comment xD"
  }

  if (!nickname.length) {
    nickname = "Anonymous";
  }

  sendBtn.hide();
  loadBtn.show();
  $.ajax({
    type: "POST",
    url: "/message",
    data: { "message": message, "nickname": nickname },
    success: (response) => {
      form.reset();
      loadBtn.hide();
      sendBtn.show();
      alertSuccess.html(`
        <strong>Thanks!</strong> ${response.msg}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `);
      alertSuccess.show();
      showMessages();
    }
  })

}

function showMessages() {

  messageBox.html("<p>Loading...</p>");
  $.ajax({
    type: "GET",
    url: "/message",
    data: {},
    success: (response) => {
      messageBox.empty();
      const messages = response.messages;
      if (messages.length) {
        messages.forEach(message => {
          const temp_html = `
          <div class="card">
            <div class="card-body">
              <blockquote class="blockquote mb-0">
              <p>${message.message}</p>
                <footer class="blockquote-footer">${message.nickname}</cite></footer>
              </blockquote>
              </div>
              </div>
              `
          messageBox.append(temp_html);
        });
      } else {
        messageBox.html("<p>No Message</p>");
      }
    }
  })
}