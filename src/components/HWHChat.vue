<template>
  <div class="chat-container">
    <h2>4444</h2>
    <div class="chat-messages" ref="chatMessages">
      <!-- 메시지를 반복 출력 -->
      <div v-for="(message, index) in messages" :key="index" class="message">
        <strong>사용자 {{message.userId }}:</strong>
        <span>{{ message.text }}</span>
        <small>({{ formatDate(message.timestamp) }})</small>
      </div>
    </div>
    <div class="chat-input">
      <input
        v-model="newMessage"
        type="text"
        placeholder="메시지를 입력하세요"
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">전송</button>
    </div>
  </div>
</template>

<script>
import { ref, onValue, push } from "firebase/database";
import { database } from "@/firebase";

export default {
  data() {
    return {
      userId: Math.floor(Math.random() * 998) + 1, // 고유 사용자 ID
      newMessage: "", // 입력 중인 메시지
      messages: [],   // 수신된 메시지 목록
    };
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim() === "") return; // 빈 메시지 무시

      const messageRef = ref(database, "messages");
      push(messageRef, {
        userId: this.userId,
        text: this.newMessage,
        timestamp: new Date().toISOString(),
      });

      this.newMessage = ""; // 입력 초기화
      this.scrollToBottom(); // 전송 후 스크롤 이동
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    },
    scrollToBottom() {
      // DOM 업데이트 이후 스크롤을 맨 아래로 이동
      this.$nextTick(() => {
        const chatMessages = this.$refs.chatMessages;
        if (chatMessages) {
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }
      });
    },
  },
  created() {
    const messageRef = ref(database, "messages");
    onValue(messageRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // 최신 메시지 목록 갱신
        this.messages = Object.values(data)
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          .slice(-300); // 최대 300개 유지

        // 메시지 수신 후 스크롤 이동
        this.scrollToBottom();
      } else {
        this.messages = [];
      }
    });
  },
};
</script>

<style scoped>
.chat-container {
  max-width: 500px;
  margin: auto;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.chat-messages {
  max-height: 300px;
  overflow-y: auto;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
  padding: 10px;
}
.message {
  margin-bottom: 10px;
}
.chat-input {
  display: flex;
  gap: 10px;
}
input {
  flex: 1;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 3px;
}
button {
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 3px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>
