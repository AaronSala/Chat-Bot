"use strict";
const chatInput = document.querySelector(".chat-input textarea");
const sendChatbtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "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";

const createChatli = (message, className) => {
  //create an li element with passed message and classname
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatInput.value = "";
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

const generateResponse = (incomingChatLi) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const mesageElement = incomingChatLi.querySelector("p");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    }),
  };
  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      mesageElement.textContent = data.choices[0].message.content;
    })
      .catch((error) => {
        mesageElement.classList.add("error")
      mesageElement.textContent = "Oops! somthing went wrong please try again";
    })
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  //append the users message to the chatbox
  chatbox.appendChild(createChatli(userMessage, "outgoing"));
  setTimeout(() => {
    //display thinking while waiting for response
    const incomingChatLi = createChatli("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    generateResponse(incomingChatLi);
  }, 600);
};

chatbotToggler.addEventListener("click", () => {
  document.body.classList.toggle("show-chatbot");
});
chatbotCloseBtn.addEventListener("click", () => {
  document.body.classList.remove("show-chatbot");
});


sendChatbtn.addEventListener("click", handleChat);
