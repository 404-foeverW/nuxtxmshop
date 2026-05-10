<template>
    <div id="register">
    <el-dialog title="注册" width="300px" center v-model="isRegister">
      <el-form
        :model="RegisterUser"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item prop="name">
          <el-input
            :prefix-icon="UserFilled"
            placeholder="请输入账号"
            v-model="RegisterUser.name"
          ></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            :prefix-icon="View"
            type="password"
            placeholder="请输入密码"
            v-model="RegisterUser.pass"
          ></el-input>
        </el-form-item>
        <el-form-item prop="confirmPass">
          <el-input
            :prefix-icon="View"
            type="password"
            placeholder="请再次输入密码"
            v-model="RegisterUser.confirmPass"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="default" type="primary" @click="toRegisterUser" style="width:100%;">注册</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script setup>
import { UserFilled, View } from '@element-plus/icons-vue';
import { request } from '~/utils/request';

const props = defineProps({
    register: {
        type: Boolean,
        default: false,
    }
})
watch(() => props.register, (newVal, oldVal) => {
    if (newVal) {
        isRegister.value = newVal;
    }
})
const emits = defineEmits(['fromChild']);
const net = request();
const ruleForm = ref(null);

const isRegister = ref(props.register);
watch(isRegister, (newVal, oldVal) => {
    if (!newVal) {
        ruleForm.value.resetFields();
        emits('fromChild', newVal);
    }
})
const RegisterUser = ref({
    name: '',
    pass: '',
    confirmPass: '',
});
const rules = ref({
    name: [{ validator: validateName, trigger: "blur" }],
    pass: [{ validator: validatePass, trigger: "blur" }],
    confirmPass: [{ validator: validateConfirmPass, trigger: "blur" }]
})

async function validateName(rule, value, callback) {
    if (!value) {
        return callback(new Error("请输入用户名"));
    }
    // 用户名以字母开头,长度在5-16之间,允许字母数字下划线
    const userNameRule = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/;
    if (userNameRule.test(value)) {
        //判断数据库中是否已经存在该用户名
        let res = await net('/api/users/findUserName', {
            method: 'POST',
            body: {
                userName: RegisterUser.value.name
            }
        })
        if (res.code == "001") {
            // await ruleForm.value.validateField("name");
            return callback();
        } else {
            return callback(new Error(res.msg));
        }
    } else {
        return callback(new Error("字母开头,长度5-16之间,允许字母数字下划线"));
    }
}
async function validatePass(rule, value, callback) {
    if (value === "") {
        return callback(new Error("请输入密码"));
    }
    // 密码以字母开头,长度在6-18之间,允许字母数字和下划线
    const passwordRule = /^[a-zA-Z]\w{5,17}$/;
    if (passwordRule.test(value)) {
        // await ruleForm.value.validateField("pass");
        return callback();
    } else {
        return callback(
            new Error("字母开头,长度6-18之间,允许字母数字和下划线")
        );
    }
}
async function validateConfirmPass(rule, value, callback) {
    if (value === "") {
        return callback(new Error("请输入确认密码"));
    }
    // 校验是否以密码一致
    if (RegisterUser.value.pass != "" && value === RegisterUser.value.pass) {
        // await ruleForm.value.validateField("confirmPass");
        return callback();
    } else {
        return callback(new Error("两次输入的密码不一致"));
    }
}

function toRegisterUser() {
    ruleForm.value.validate(async (valid) => {
        if (!valid) return false;
        let res = await net('/api/users/register', {
            method: 'POST',
            body: {
                userName: RegisterUser.value.name,
                password: RegisterUser.value.pass
            }
        })
        if (res.code == "001") {
            ElNotification.success(res.msg);
            isRegister.value = false;
        } else {
            ElNotification.error(res.msg);
        }
    })
}
</script>
<style>
    
</style>