<template>
  <div class="login-register">
    <div class="contain">
      <div class="big-box" :class="{ active: isLogin }">
        <!-- 登录 -->
        <div class="big-contain" v-if="isLogin">
          <div class="btitle">账户登录</div>
          <div class="bform">
            <q-input
              class="inputs"
              rounded
              standout="bg-primary text-white"
              bottom-slots
              label="UserName"
              clearable
              clear-icon="close"
              v-model="form.userName"
              ref="login_username"
              :rules="[val => !!val || '请输入用户名']"
            >
              <template v-slot:prepend>
                <q-icon name="icon-user" />
              </template>
            </q-input>
            <q-input
              class="inputs"
              rounded
              standout="bg-primary text-white"
              bottom-slots
              label="Password"
              :type="isPwd ? 'password' : 'text'"
              v-model="form.password"
              ref="login_password"
              :rules="[val => (val && val.length > 0) || '请输入密码']"
            >
              <template v-slot:prepend>
                <q-icon name="icon-password" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>
          <q-btn
            class="button "
            :loading="submitting"
            color="secondary"
            @click="simulateProgress"
            label="登录"
          />
        </div>
        <!-- 注册 -->
        <div class="big-contain" v-else>
          <div class="btitle">注册</div>
          <div class="bform">
            <q-input
              class="inputs"
              rounded
              standout="bg-primary text-white"
              bottom-slots
              label="UserName"
              clearable
              clear-icon="close"
              v-model="registerForm.userName"
              ref="register_username"
              :rules="[val => !!val || '请输入用户名']"
            >
              <template v-slot:prepend>
                <q-icon name="icon-user" />
              </template>
            </q-input>
            <q-input
              class="inputs"
              rounded
              standout="bg-primary text-white"
              bottom-slots
              label="Email"
              clearable
              clear-icon="close"
              v-model="registerForm.email"
              type="email"
              ref="register_email"
              :rules="[val => !!val || '请输入邮箱']"
            >
              <template v-slot:prepend>
                <q-icon name="icon-emailFilled" />
              </template>
            </q-input>
            <q-input
              class="inputs"
              rounded
              standout="bg-primary text-white"
              bottom-slots
              label="Password"
              :type="isPwd ? 'password' : 'text'"
              v-model="registerForm.password"
              ref="register_password"
              :rules="[val => !!val || '请输入密码']"
            >
              <template v-slot:prepend>
                <q-icon name="icon-password" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>
          <button class="bbutton">注册</button>
        </div>
      </div>
      <div class="small-box" :class="{ active: isLogin }">
        <div class="small-contain" v-if="isLogin">
          <div class="stitle">你好，朋友!</div>
          <p class="scontent">开始注册，和我们一起旅行</p>
          <button class="sbutton" @click="changeType('register')">注册</button>
        </div>
        <div class="small-contain" v-else>
          <div class="stitle">欢迎回来!</div>
          <p class="scontent">与我们保持联系，请登录你的账户</p>
          <button class="sbutton" @click="changeType('login')">登录</button>
        </div>
      </div>
    </div>
    <q-dialog v-model="verifyForm">
      <q-card style="padding:15px;" class="">
        <q-card-section class="row items-center">
          <div class="text-h6">滑动验证</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <verifySlider @callback="verified(1)"></verifySlider
        ></q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import verifySlider from "components/utils/Verify.vue";
export default {
  name: "login-register",
  components: { verifySlider },
  data() {
    return {
      isLogin: true,
      registerForm: {
        userName: "",
        password: "",
        email: ""
      },
      form: {
        userName: "admin",
        password: "Zstp@123456",
        email: ""
      },
      isPwd: true,
      isEmail: true,
      submitting: false,
      verifyForm: false
    };
  },
  methods: {
    changeType(obj) {
      this.isLogin = !this.isLogin;
      for (let key in this.form) {
        this.form[key] = null;
      }
      for (let key in this.registerForm) {
        this.registerForm[key] = null;
      }
      console.log(obj);
      if (obj === "register") {
        this.$refs.login_username.resetValidation();
        this.$refs.login_password.resetValidation();
      } else {
        this.$refs.register_username.resetValidation();
        this.$refs.register_email.resetValidation();
        this.$refs.register_password.resetValidation();
      }
    },
    verified(number) {
      let that = this;
      this.submitting = true;
      this.verifyForm = false;
      // we set loading state
      this[`loading${number}`] = true;
      this.$http
        .post("/user/login", this.form)
        .then(async res => {
          if (res.status === 200) {
            this.$store.dispatch("user/asyncSetUserInfo", res.data.data);
            setTimeout(() => {
              // we're done, we reset loading state
              this[`loading${number}`] = false;
              this.submitting = false;
              this.$q.notify({
                message: "登录成功！"
              });
              this.$router.replace("/home");
            }, 1500);
          } else {
            this.submitting = false;
            this[`loading${number}`] = false;
          }
        })
        .catch(() => {
          this[`loading${number}`] = false;
          this.submitting = false;
        });
    },
    simulateProgress(number) {
      let that = this;
      this.$refs.login_username.validate();
      this.$refs.login_password.validate();

      if (
        this.$refs.login_username.hasError ||
        this.$refs.login_password.hasError
      ) {
        this.formHasError = true;
      } else {
        this.verifyForm = true;
      }
    }
  }
};
</script>

<style scoped="scoped" lang="scss">
.login-register {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .contain {
    width: 60%;
    height: 60%;
    position: relative;
    top: 25%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 0 0 3px #f0f0f0, 0 0 6px #f0f0f0;
  }
  .big-box {
    width: 70%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 30%;
    transform: translateX(0%);
    transition: all 1s;
    .big-contain {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .btitle {
        font-size: 1.5em;
        font-weight: bold;
        color: rgb(57, 167, 176);
      }
      .bform {
        width: 100%;
        height: 40%;
        padding: 2em 0;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        .inputs {
          margin-top: 10px;
          width: 50%;
          font-size: 16px;
          // height: 30px;
          // border: none;
          // outline: none;
          // border-radius: 10px;
          // padding-left: 2em;
          // background-color: #f0f0f0;
        }
      }
      .button {
        width: 180px;
        height: 50px;
        border-radius: 25px;
        margin-top: 10px;
        font-weight: 700;
        font-size: 14px;
        letter-spacing: 1.15px;
        background-color: #4b70e2;
        color: #f9f9f9;
        box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;
        border: none;
        outline: none;
      }
    }
  }
  .small-box {
    width: 30%;
    height: 100%;
    background: linear-gradient(135deg, rgb(57, 167, 176), rgb(56, 183, 145));
    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(0%);
    transition: all 1s;
    border-top-left-radius: inherit;
    border-bottom-left-radius: inherit;
    .small-contain {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .stitle {
        font-size: 1.5em;
        font-weight: bold;
        color: #fff;
      }
      .scontent {
        font-size: 0.8em;
        color: #fff;
        text-align: center;
        padding: 2em 4em;
        line-height: 1.7em;
      }
      .sbutton {
        width: 60%;
        height: 40px;
        border-radius: 24px;
        border: 1px solid #fff;
        outline: none;
        background-color: transparent;
        color: #fff;
        font-size: 0.9em;
        cursor: pointer;
      }
    }
  }
  .big-box.active {
    left: 0;
    transition: all 0.5s;
  }
  .small-box.active {
    left: 100%;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: inherit;
    border-bottom-right-radius: inherit;
    transform: translateX(-100%);
    transition: all 1s;
  }
}
.bbutton {
  width: 20%;
  height: 40px;
  border-radius: 24px;
  border: none;
  outline: none;
  background-color: rgb(57, 167, 176);
  color: #fff;
  font-size: 0.9em;
  cursor: pointer;
}
</style>
