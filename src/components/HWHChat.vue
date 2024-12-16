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
  max-width: 450px;
  height: 75vh;
  margin: auto;
  display: flex;
  flex-direction: column;
  border: 1px solid #444;
  border-radius: 8px;
  overflow: hidden;
  background-color: #1e1e2f; /* 전체 배경 어두운 색상 */
  color: #fff;
}

.chat-header {
  background-color: #3a4046;
  color: white;
  padding: 5px 10px; /* 패딩을 줄임: 상하 5px, 좌우 10px */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em; /* 폰트 크기를 줄임 */
  font-weight: bold;
  height: 50px; /* 명시적으로 높이 설정 */
}
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  max-width: 100%;
}

/* 본인 메시지 스타일 */
.message.my-message .message-card {
  background-color: #2b6cb0; /* 진한 파란색 */
  color: #f0f4f8; /* 밝은 글자 색 */
  border: none;
}

.message.my-message .message-timestamp {
  color: #cbd5e0; /* 타임스탬프 연한 파란색 */
  font-size: 0.8em;
}

/* 상대방 메시지 스타일 */
.message.other-message .message-card {
  background-color: #4a5568; /* 회색 톤 */
  color: #e2e8f0; /* 밝은 회색 글자 */
  border: none;
}

.message.other-message .message-timestamp {
  color: #a0aec0; /* 타임스탬프 연한 회색 */
  font-size: 0.8em;
}

.message-user {
  font-weight: bold;
  color: #90cdf4; /* 사용자 이름 - 밝은 파란색 */
}

.chat-input {
  display: flex;
  gap: 10px;
  padding: 10px;
  background-color: #2d3748; /* 입력창 배경색 */
  border-top: 1px solid #4a5568;
}

.el-input__inner {
  flex: 1;
  border-radius: 8px;
  padding: 10px;
  background-color: #4a5568;
  border: none;
  color: #f7fafc;
}

.el-input__inner::placeholder {
  color: #a0aec0;
}

.el-button {
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: bold;
  background-color: #3182ce; /* 버튼 파란색 */
  color: white;
}

.el-button:hover {
  background-color: #2b6cb0; /* 버튼 호버 색상 */
}
</style>