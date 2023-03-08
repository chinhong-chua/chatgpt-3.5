<template>
  <div
    class="bg-cyan-100 h-12 flex items-center justify-between p-3 text-blue-500 font-serif font-bold sticky top-0"
  >
    <h1 class="flex-1 text-center">
      ChatGPT 3.5 <small class="font-thin pl-2 pt-3">by Cruz</small>
    </h1>
    <button
      @click="clearChat"
      class="bg-green-700 text-white px-4 mb-1 py-2 rounded-xl hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
    >
      Clear
    </button>
  </div>

  <div class="bg-gray-100 min-h-screen">
    <div class="flex h-screen">
      <!-- <div class="w-64 border-r border-gray-300 px-4 py-8">
        <div class="flex items-center mb-4">
          <img
            src="https://via.placeholder.com/32"
            alt="User Avatar"
            class="w-8 h-8 rounded-full mr-2"
          />
          <h2 class="text-xl font-bold">John Doe</h2>
        </div>
        <div class="flex items-center mb-4">
          <img
            src="https://via.placeholder.com/32"
            alt="User Avatar"
            class="w-8 h-8 rounded-full mr-2"
          />
          <h2 class="text-xl font-bold">Jane Doe</h2>
        </div>
        <div class="flex items-center mb-4">
          <img
            src="https://via.placeholder.com/32"
            alt="User Avatar"
            class="w-8 h-8 rounded-full mr-2"
          />
          <h2 class="text-xl font-bold">Bob Smith</h2>
        </div>
      </div> -->
      <div class="flex-1 flex flex-col">
        <div class="flex-1 overflow-y-auto px-8 py-6">
          <div v-for="(message, index) in messageList" :key="index">
            <div
              class="flex items-start mb-4"
              v-if="message.role === 'assistant'"
            >
              <img
                src="./assets/bot.svg"
                alt="Assistant Avatar"
                class="w-8 h-8 rounded-full mr-2 bg-emerald-500"
              />
              <div
                class="bg-white px-4 py-2 rounded-lg"
                v-if="isLoading && index === messageList.length - 1"
              >
                <div class="w-10 pl-3 m-2">
                  <div class="dot-collision pl-3"></div>
                </div>
              </div>
              <div class="bg-white px-4 py-2 rounded-lg" v-else>
                <!-- <pre>{{ index }}</pre> -->
                <p class="font-medium">{{ message.content }}</p>
              </div>
            </div>
            <div
              class="flex items-end justify-end mb-4"
              v-else-if="message.role === 'user'"
            >
              <div class="bg-blue-500 px-4 py-2 rounded-lg">
                <p class="text-white font-medium">{{ message.content }}</p>
              </div>
              <img
                src="./assets/user.svg"
                alt="User Avatar"
                class="w-8 h-8 rounded-full ml-2 bg-indigo-500"
              />
            </div>
          </div>
        </div>
        <div class="bg-white px-8 py-4 flex items-center sticky bottom-0">
          <input
            type="text"
            placeholder="Type your message here"
            class="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="newUserMessage"
            @keyup.enter.prevent="sendMessage"
          />
          <button
            class="ml-3 bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="sendMessage"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { chat } from "./server/chatgpt";
import { ChatMessage } from "./types/ChatMessage";

const defaultMessage = ref<ChatMessage>({
  role: "assistant",
  content: "Hello, please ask me anything.",
});
// const newMessage = ref("");
// const items = reactive([
//   { role: "bot", message: "i am a bot" },
//   { role: "user", message: "i am cruz" },
//   { role: "bot", message: "how are you" },
//   { role: "user", message: "imma fine" },
// ]);

// const messageList: ChatMessage[] = reactive([
//   {
//     role: "user",
//     message: "Hello",
//   },
// ]);

const messageList = ref<ChatMessage[]>([]);
messageList.value.unshift(defaultMessage.value);

const newUserMessage = ref("");

const isLoading = ref(false);

const sendMessage = async () => {
  if (!newUserMessage.value) return false;

  const userMessage: ChatMessage = {
    role: "user",
    content: newUserMessage.value,
  };

  messageList.value.push(userMessage);
  newUserMessage.value = "";
  await loadMessage();
  // isLoading.value = false;
};

const loadMessage = async () => {
  //push empty item for loading
  const messageBot: ChatMessage = {
    role: "assistant",
    content: "",
  };
  messageList.value.push(messageBot);
  isLoading.value = true;

  const res = await chat(messageList.value);
  const lastIndex = messageList.value.length - 1;
  if (res) {
    messageList.value[lastIndex].content = res.content;
    console.log(messageList.value);
  } else {
    messageList.value[lastIndex].content = "Error occurred";
    // messageList.value.push({ role: "assistant", content: "Error occurred" });
  }
  isLoading.value = false;

  console.log("res from api: ", res);
  console.log("messageList.value: ", messageList.value);
};

const clearChat = () => {
  messageList.value = [defaultMessage.value];
};

// const { status, data, message } = await chat(messageList.value);

// chat()
// console.log(status)
// console.log(data)
// console.log(message)
</script>
