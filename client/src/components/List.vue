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
            <el-input v-model="image" type="file" id="fileInput" accept="image/*"></el-input>
        </el-form-item>
        <el-button @click="upload">提交图片</el-button>
    </el-form>
    <el-button type="primary" @click="logout">退出登录</el-button>
    <el-button type="primary" @click="addTask">添加代办</el-button>
    <el-card v-for="(item, index) in list" :key="index" style="padding: 10px;margin:10px 0px;">
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
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { addtodoAsync, deletetodoAsync, getAlltodoAsync } from '../api/task';
import { ElMessage } from 'element-plus';
import { imagePostAsync } from '../api/uploads';

const router = useRouter()
const form = reactive({
    title: '',
    content: '',
})
const image = ref('')
const logout = () => {
    console.log('logout')
    localStorage.removeItem('token')
    router.push('/login')
}
const upload = async () => {
    const fileInput = document.getElementById('fileInput') as any
    const file = fileInput.files[0]
    if (!file) {
        return alert('请选择文件')
    }
    const formData = new FormData()
    formData.append('file', file)
    try {
        const result = await imagePostAsync(formData)
        const { data } = result
        let { url } = data
        url = '/server' + url
        document.body.innerHTML += `<img src="${url}" width="200" />`;
    } catch (error) {
        console.warn('上传失败:',error)
    }
}
const addTask = async () => {
    console.log('addTask')
    const response = await addtodoAsync(form)
    if (response.status === 200 || response.status === 201) {
        ElMessage({
            type: 'success',
            message: '添加成功'
        })
        const response = await getAlltodoAsync()
        if (response.status === 200) {
            list.value = response.data
        }
    } else {
        ElMessage({
            type: 'error',
            message: '添加失败',
        })
    }
}
const remove = async (item: any) => {
    console.log('deleteTask')
    const { id } = item
    const params = {
        id: id
    }
    const response = await deletetodoAsync(params)
    if (response.status === 200 || response.status === 201) {
        ElMessage({
            message: '删除成功',
            type: 'success'
        })
        const response = await getAlltodoAsync()
        if (response.status === 200) {
            list.value = response.data
        }
    } else {
        ElMessage({
            message: '删除失败',
            type: 'error',
        })
    }
}
const list = ref<any[]>([])
onMounted(async () => {
    const response = await getAlltodoAsync()
    if (response.status === 200) {
        list.value = response.data
    }
})
</script>

<style scoped lang="scss"></style>