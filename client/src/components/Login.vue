<template>
    <el-form :model="form" label-width="auto" style="max-width: 600px;">
        <el-form-item label="用户名">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
    </el-form>
    <el-button type="primary" @click="login">登录</el-button>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { userLoginAsync } from '../api/login';
import { ElMessage } from 'element-plus';
const form = reactive({
    name: '',
    password: '',
})
const router = useRouter()
const login = async () => {
    try {
        const params = {
            username: form.name,
            password: form.password,
        }
        console.log(params)
        const { status } = await userLoginAsync(params)
        if (status) {
            ElMessage({
                type: 'success',
                message: "登录成功"
            })
            router.push('/')
        } else {
            ElMessage({
                message: "登录失败",
                type: 'error'
            })
        }
    } catch (error) {
        ElMessage({
            message: '登录失败' + error,
            type: 'error'
        })
    }
}
</script>

<style scoped lang="scss"></style>