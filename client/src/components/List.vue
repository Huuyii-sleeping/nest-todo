<template>
  <div>待做事项</div>
  <el-form :model="form">
    <el-form-item label="标题">
      <el-input v-model="form.title"></el-input>
    </el-form-item>
    <el-form-item label="内容">
      <el-input v-model="form.content"></el-input>
    </el-form-item>
    <el-form-item label="封面">
      <el-input
        v-model="image"
        type="file"
        id="fileInput"
        accept="image/*"
      ></el-input>
    </el-form-item>
    <el-button @click="upload">提交图片</el-button>
  </el-form>
  <el-button type="primary" @click="logout">退出登录</el-button>
  <el-button type="primary" @click="addTask">添加代办</el-button>
  <el-card
    v-for="(item, index) in list"
    :key="index"
    style="padding: 10px; margin: 10px 0px"
  >
    <template #header>
      <div>{{ item.title }}</div>
    </template>
    <template #default>
      {{ item.content }}
    </template>
    <template #footer>
      <el-button @click="remove(item)">删除</el-button>
    </template>
  </el-card>
  <el-card class="chat-room">
    <template #header> 聊天室 在线人数:{{ onlineUsers }}人 </template>
    <template #default>
      <div
        ref="chatContainer"
        style="
          height: 200px;
          overflow-y: auto;
          padding: 10px;
          border: 1px solid #eee;
          background: #f9f9f9;
        "
      >
        <div
          v-for="(msg, index) in chatMessages"
          :key="index"
          style="margin-bottom: 8px; padding: 4px 0"
        >
          <small style="color: #999">[{{ msg.time }}]</small>
          <span>{{ msg.data }}</span>
        </div>
      </div>
    </template>
    <template #footer>
      <div style="display: flex">
        <el-input
          v-model="chatMessage"
          placeholder="请输入消息"
          @keyup.enter="sendChatMessage"
          style="flex: 1"
        ></el-input>
        <el-button
          type="primary"
          style="margin-left: 5px"
          @click="sendChatMessage"
          >发送</el-button
        >
      </div>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { addtodoAsync, deletetodoAsync, getAlltodoAsync } from "../api/task";
import { ElMessage } from "element-plus";
import { imagePostAsync } from "../api/uploads";
import { io, type Socket } from "socket.io-client";

const router = useRouter();
const form = reactive({
  title: "",
  content: "",
});
const image = ref("");
// socket
const chatMessage = ref("");
const chatMessages = ref<{ time: string; data: string }[]>([]);
const onlineUsers = ref(0);
let socket: Socket;

// 发送聊天消息
const sendChatMessage = () => {
  if (!chatMessage.value.trim()) return;
  if (socket) {
    socket.emit("msgToServer", chatMessage.value);
    chatMessage.value = "";
  }
};

const logout = () => {
  console.log("logout");
  localStorage.removeItem("token");
  router.push("/login");
};
const upload = async () => {
  const fileInput = document.getElementById("fileInput") as any;
  const file = fileInput.files[0];
  if (!file) {
    return alert("请选择文件");
  }
  const formData = new FormData();
  formData.append("file", file);
  try {
    const result = await imagePostAsync(formData);
    const { data } = result;
    let { url } = data;
    url = "/server" + url;
    document.body.innerHTML += `<img src="${url}" width="200" />`;
  } catch (error) {
    console.warn("上传失败:", error);
  }
};
const addTask = async () => {
  console.log("addTask");
  const response = await addtodoAsync(form);
  if (response.status === 200 || response.status === 201) {
    ElMessage({
      type: "success",
      message: "添加成功",
    });
    const response = await getAlltodoAsync();
    if (response.status === 200) {
      list.value = response.data;
    }
  } else {
    ElMessage({
      type: "error",
      message: "添加失败",
    });
  }
};
const remove = async (item: any) => {
  console.log("deleteTask");
  const { id } = item;
  const params = {
    id: id,
  };
  const response = await deletetodoAsync(params);
  if (response.status === 200 || response.status === 201) {
    ElMessage({
      message: "删除成功",
      type: "success",
    });
    const response = await getAlltodoAsync();
    if (response.status === 200) {
      list.value = response.data;
    }
  } else {
    ElMessage({
      message: "删除失败",
      type: "error",
    });
  }
};
const list = ref<any[]>([]);
onMounted(async () => {
  const response = await getAlltodoAsync();
  if (response.status === 200) {
    list.value = response.data;
  }

  // 连接聊天室
  const SOCKET_URL = "http://localhost:3000";
  socket = io(`${SOCKET_URL}/chat`, {
    // 这里可以添加token认证
  });
  socket.on("msgToClient", (message) => {
    chatMessages.value.push(message);
  });
  socket.on("users", (count) => {
    onlineUsers.value = count;
  });
  // error
  socket.on("connect_error", (err) => {
    console.log("Websocket 连接失败", err);
    ElMessage.error("聊天室连接失败");
  });
});
</script>

<style scoped>
.chat-room {
  position: fixed;
  right: 10px;
  bottom: 10px;
}
</style>
