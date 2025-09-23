<template>
  <div class="chat-container">
    <!-- Header -->
    <header class="chat-header">
      <h2 class="chat-title">💬 Chat</h2>
    </header>

    <!-- Chat Messages -->
    <div class="chat-messages" ref="chatMessages">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="message"
        :class="{ 'my-message': message.userId === userId, 'other-message': message.userId !== userId }"
      >
        <el-card class="message-card" :class="{ 'my-card': message.userId === userId, 'other-card': message.userId !== userId }" shadow="hover">
          <div>
          <strong v-if="message.userId !== userId" class="message-user">User {{ message.userId }}  :</strong>
          <span class="message-text" :class="{ 'my-text': message.userId === userId, 'other-text': message.userId !== userId }" > &nbsp; {{ message.text }}</span>
          </div>
          <small class="message-timestamp" :class="{ 'my-timestamp': message.userId === userId, 'other-timestamp': message.userId !== userId }" >({{ formatDate(message.timestamp) }})</small>
        </el-card>
      </div>
    </div>

    <!-- Input Section -->
    <footer class="chat-input">
      <el-input
        v-model="newMessage"
        placeholder="메시징"
        @keyup.enter="sendMessage"
        clearable
      ></el-input>
      <el-button type="primary" @click="sendMessage">전송</el-button>
    </footer>
  </div>
</template>



<script setup>
import { ref, onMounted, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { ref as firebaseRef, onValue, push } from "firebase/database";
import { database } from "@/firebase";



// 세션 스토리지에서 userId 가져오기 또는 새로 생성
let userId = sessionStorage.getItem("userId");

if (!userId) {
  // 세션 ID가 없으면 새로운 userId 생성
  userId = Math.floor(Math.random() * 998) + 1;
  sessionStorage.setItem("userId", userId); // 세션에 저장
}

console.log("User ID:", userId); // 디버깅용

const newMessage = ref(""); 
const messages = ref([]); 
const chatMessages = ref(null); 

const sendMessage = () => {
  if (newMessage.value.trim() === "") {
    ElMessage.warning("메시지점 적어라");
    return;
  }

  const messageRef = firebaseRef(database, "messages");
  push(messageRef, {
    userId: userId,
    text: newMessage.value,
    timestamp: new Date().toISOString(),
  });

  newMessage.value = ""; // Clear input
  scrollToBottom(); // Scroll to bottom
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatMessages.value && chatMessages.value.scrollHeight) {

      chatMessages.value.scrollTop = chatMessages.value.scrollHeight;

    } 

  });
};

onMounted(() => {
  console.log("왜 안됨 ???");

  const messageRef = firebaseRef(database, "messages");
  onValue(messageRef, (snapshot) => {

    const data = snapshot.val();
    if (data) {

      messages.value = Object.values(data)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .slice(-300); // Limit to 300 messages

      nextTick(() => {
        scrollToBottom();
      });
    } else {
      messages.value = [];
    }
  });


});
</script>





<style scoped>

.chat-container {
  max-width: 450px !important;
  height: 75vh !important;
  margin: auto !important;
  display: flex !important;
  flex-direction: column !important;
  border: 1px solid var(--color-border) !important;
  border-radius: var(--radius-lg) !important;
  overflow: hidden !important;
  background: var(--color-surface-1) !important;
  color: var(--text-primary) !important;
  backdrop-filter: var(--blur-md) !important;
  box-shadow: var(--shadow-lg) !important;
}

.chat-header {
  background: var(--color-surface-2) !important;
  color: var(--text-primary) !important;
  padding: var(--space-2) var(--space-3) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 1.2em !important;
  font-weight: bold !important;
  height: 50px !important;
  border-bottom: 1px solid var(--color-divider) !important;
}

.chat-title {
  background: var(--color-secondary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-height: 100%;
}

.message {
  display: flex;
  align-items: flex-start;
  max-width: 70%;
}

.message.my-message {
  justify-content: flex-end;
  margin-left: auto;
}

.message.other-message {
  justify-content: flex-start;
}

.message-card {
  border-radius: var(--radius-lg);
  padding: var(--space-3);
  box-shadow: var(--shadow-sm);
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  max-width: 100%;
  backdrop-filter: var(--blur-sm);
  border: 1px solid var(--color-border);
}

/* 본인 메시지 스타일 */
.message.my-message .message-card {
  background: var(--color-primary);
  color: var(--text-primary);
  border: 1px solid var(--color-border-focus);
}

.message.my-message .message-timestamp {
  color: var(--text-secondary);
  font-size: 0.8em;
}

/* 상대방 메시지 스타일 */
.message.other-message .message-card {
  background: var(--color-surface-3);
  color: var(--text-primary);
  border: 1px solid var(--color-border);
}

.message.other-message .message-timestamp {
  color: var(--text-muted);
  font-size: 0.8em;
}

.message-user {
  font-weight: bold;
  color: var(--color-accent-solid);
  background: var(--color-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.chat-input {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-surface-2);
  border-top: 1px solid var(--color-divider);
}

.el-input__inner {
  flex: 1;
  border-radius: var(--radius-md);
  padding: var(--space-3);
  background: var(--color-surface-3);
  border: 1px solid var(--color-border);
  color: var(--text-primary);
}

.el-input__inner::placeholder {
  color: var(--text-muted);
}

.el-button {
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-5);
  font-weight: bold;
  background: var(--color-primary);
  color: var(--text-primary);
  border: none;
  transition: all var(--ease-fluid) 0.3s;
}

.el-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md), var(--shadow-glow);
}
</style>