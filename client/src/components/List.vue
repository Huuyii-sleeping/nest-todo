<template>
    <div>待做事项</div>
    <el-button type="primary" @click="logout">退出登录</el-button>
    <el-button type="primary" @click="addTask">添加代办</el-button>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAllTaskAsync } from '../api/task';

const router = useRouter()
const logout = () => {
    console.log('logout')
    router.push('/login')
}
const addTask = () => {
    console.log('addTask')

}
onMounted(async () => {
    const response = await getAllTaskAsync()
    if (response.status) {

    }
})
</script>

<style scoped lang="scss"></style>