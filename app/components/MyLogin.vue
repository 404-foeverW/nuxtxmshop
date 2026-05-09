<template>
    <div id="myLogin">
        <el-dialog title="登录" width="300px" align-center v-model="isLogin">
            <el-form :model="LoginUser" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                <el-form-item prop="name">
                    <el-input 
                        :prefix-icon="UserFilled" 
                        placeholder="请输入账号" 
                        v-model="LoginUser.name"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item prop="pass">
                    <el-input
                        :prefix-icon="View"
                        type="password"
                        placeholder="请输入密码"
                        clearable
                        passwordVisible
                        v-model="LoginUser.pass"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="default" type="primary" @click="Login" style="width:100%;">登录</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script setup>
import { UserFilled, View } from '@element-plus/icons-vue';
import { userStore } from '~/store/user';
import { request } from '~/utils/request';

const net = request();
const ruleForm = ref(null);
const LoginUser = ref({
    name: "",
    pass: ""
});
const rules = ref({
    name: [{ validator: validateName, trigger: "blur" }],
    pass: [{ validator: validatePass, trigger: "blur" }]
})
const { getShowLogin, setShowLogin, setUser } = userStore();

const isLogin = computed({
    get() {
        return getShowLogin;
    },
    set(val) {
        ruleForm.value.resetFields();
        setShowLogin(val);
    }
})


function validateName(rule, value, callback) {
    if(!value) {
        return callback(new Error("请输入用户名"));
    }
    // 用户名以字母开头,长度在5-16之间,允许字母数字下划线
    const userNameRule = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/;
    if(userNameRule.test(value)) {
        ruleForm.value.validateField("checkPass");
        return callback();
    }else {
        return callback(new Error("字母开头,长度5-16之间,允许字母数字下划线"));
    }
}
function validatePass(rule, value, callback) {
    if(value === "") {
        return callback(new Error("请输入密码"));
    }
    const passwordRule = /^[a-zA-Z]\w{5,17}$/;
    if (passwordRule.test(value)) {
        ruleForm.value.validateField("checkPass");
        return callback();
    } else {
        return callback(
            new Error("字母开头,长度6-18之间,允许字母数字和下划线")
        );
    }
}

function Login() {
    ruleForm.value.validate(async (valid) => {
        if(!valid) return false;
        try {
            let res = await net("/api/users/login", {
                method: "post",
                body: {
                    userName: LoginUser.value.name,
                    password: LoginUser.value.pass
                }
            })
            console.log(res);
            if (res.data.code === "001") {
                // 隐藏登录组件
                isLogin.value = false;
                // 登录信息存到本地
                let user = JSON.stringify(res.data.user);
                localStorage.setItem("user", user);
                // 登录信息存到vuex
                setUser(res.data.user);
                // 弹出通知框提示登录成功信息
                ElNotification.success(res.data.msg);
            } else {
                // 清空输入框的校验状态
                ruleForm.value.resetFields();
                // 弹出通知框提示登录失败信息
                ElNotification.error(res.data.msg);
            }
        } catch (error) {
            console.log(error);
        }
    })
}
</script>
<style>
    
</style>