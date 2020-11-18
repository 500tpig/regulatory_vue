<template>
  <div>
    <div class="Login">
      <div class="main">
        <!-- 登录 -->
        <div class="container a-container" id="a-container">
          <form class="form" id="b-form" method="" action="">
            <h2 class="form_title title">登录</h2>
            <!-- <div class="form__icons"><img class="form__icon" src="img/3.svg"></div><span class="form__span">or use your email account</span> -->
            <div class="form__input">
              <q-input
                style="font-size:16px"
                rounded
                standout="bg-primary text-white"
                bottom-slots
                label="UserName"
                clearable
                clear-icon="close"
                v-model="user.userName"
                ref="login_username"
                :rules="[val => (val && val.length > 0) || '请输入用户名']"
              >
                <template v-slot:prepend>
                  <q-icon name="icon-user" />
                </template>
              </q-input>
            </div>
            <div class="form__input">
              <q-input
                style="font-size:16px"
                rounded
                standout="bg-primary text-white"
                bottom-slots
                label="Password"
                :type="isPwd ? 'password' : 'text'"
                v-model="user.password"
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
              class="form__button button submit"
              :loading="submitting"
              color="secondary"
              @click="simulateProgress"
              label="登录"
            />
            <span class="forgetPassword">忘记密码？</span>
          </form>
        </div>
        <!-- 登录 -->
        <!-- 注册 -->
        <div class="container b-container" id="b-container">
          <form class="form" id="a-form" method="" action="">
            <h2 class="form_title title">注册</h2>
            <!-- <div class="form__icons"><img class="form__icon" src="img/1.svg" alt=""><img class="form__icon" src="img/2.svg"></div> -->
            <!-- <span class="form__span">or use email for registration</span> -->
            <div class="form__input">
              <q-input
                style="font-size:16px"
                rounded
                standout="bg-primary text-white"
                bottom-slots
                label="UserName"
                clearable
                clear-icon="close"
                v-model="register.userName"
                ref="register_username"
                :rules="[val => (val && val.length > 0) || '请输入用户名']"
              >
                <template v-slot:prepend>
                  <q-icon name="icon-user" />
                </template>
              </q-input>
            </div>
            <div class="form__input">
              <q-input
                style="font-size:16px"
                rounded
                standout="bg-primary text-white"
                bottom-slots
                label="Email"
                clearable
                clear-icon="close"
                v-model="register.email"
                type="email"
                ref="register_email"
                :rules="[val => (val && val.length > 0) || '请输入邮箱']"
              >
                <template v-slot:prepend>
                  <q-icon name="icon-emailFilled" />
                </template>
              </q-input>
            </div>
            <div class="form__input">
              <q-input
                style="font-size:16px"
                rounded
                standout="bg-primary text-white"
                bottom-slots
                label="Password"
                :type="isPwd ? 'password' : 'text'"
                v-model="register.password"
                ref="register_password"
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
            <button class="form__button button submit">注册</button>
          </form>
        </div>
        <!-- 注册 -->
        <!-- 切换按钮 -->
        <div class="switch" id="switch-cnt">
          <div class="switch__circle"></div>
          <div class="switch__circle switch__circle--t"></div>
          <div class="switch__container" id="switch-c1">
            <h2 class="switch__title">面向医院端的医保基金监管系统</h2>
            <p class="switch__description description">
              Enter your personal details and start journey with us
            </p>
            <q-btn
              @click="onReset"
              class="switch__button button switch-btn"
              :ripple="{ center: true }"
              color="accent"
              label="注册"
              no-caps
            />
          </div>
          <div class="switch__container is-hidden" id="switch-c2">
            <h2 class="switch__title">已有账号？</h2>
            <p class="switch__description description">
              To keep connected with us please login with your personal info
            </p>
            <q-btn
              @click="onReset"
              class="switch__button button switch-btn"
              :ripple="{ center: true }"
              color="accent"
              label="登录"
              no-caps
            />
          </div>
        </div>
        <!-- 切换按钮 -->
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
  name: "Login",
  components: { verifySlider },
  data() {
    return {
      submitting: false,
      isPwd: true,
      isPassing: true,
      user: {
        userName: "admin",
        password: "Zstp@123456",
        email: ""
      },
      register: {
        userName: "",
        password: "",
        email: ""
      },
      verifyForm: false
    };
  },
  methods: {
    verified(number) {
      let that = this;
      this.submitting = true;
      this.verifyForm = false;
      // we set loading state
      this[`loading${number}`] = true;
      this.$http
        .post("/user/login", this.user)
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
              this.$router.push("/home");
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
    },
    onReset() {
      setTimeout(() => {
        this.user.userName = null;
        this.user.password = null;
      }, 500);

      this.$refs.login_username.resetValidation();
      this.$refs.login_password.resetValidation();
    }
  },
  mounted() {
    const switchCtn = document.querySelector("#switch-cnt");
    const switchC1 = document.querySelector("#switch-c1");
    const switchC2 = document.querySelector("#switch-c2");
    const switchCircle = document.querySelectorAll(".switch__circle");
    const switchBtn = document.querySelectorAll(".switch-btn");
    const aContainer = document.querySelector("#a-container");
    const bContainer = document.querySelector("#b-container");
    const allButtons = document.querySelectorAll(".submit");
    const getButtons = e => e.preventDefault();
    const changeForm = e => {
      switchCtn.classList.add("is-gx");
      setTimeout(function() {
        switchCtn.classList.remove("is-gx");
      }, 1500);
      switchCtn.classList.toggle("is-txr");
      switchCircle[0].classList.toggle("is-txr");
      switchCircle[1].classList.toggle("is-txr");
      switchC1.classList.toggle("is-hidden");
      switchC2.classList.toggle("is-hidden");
      aContainer.classList.toggle("is-txl");
      bContainer.classList.toggle("is-txl");
      bContainer.classList.toggle("is-z200");
    };
    const mainF = e => {
      for (let i = 0; i < allButtons.length; i++) {
        allButtons[i].addEventListener("click", getButtons);
      }
      for (let i = 0; i < switchBtn.length; i++) {
        switchBtn[i].addEventListener("click", changeForm);
      }
    };
    window.addEventListener("load", mainF);
  }
};
</script>

<style scoped>
*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
}

/* Generic */
.Login {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Montserrat", sans-serif;
  font-size: 12px;
  background-color: #ecf0f3;
  color: #a0a5a8;
}

/**/
.main {
  position: relative;
  width: 1000px;
  min-width: 1000px;
  min-height: 600px;
  height: 600px;
  padding: 25px;
  background-color: #ecf0f3;
  box-shadow: 10px 10px 10px #d1d9e6, -10px -10px 10px #f9f9f9;
  border-radius: 12px;
  overflow: hidden;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  width: 600px;
  height: 100%;
  padding: 25px;
  background-color: #ecf0f3;
  transition: 1.25s;
}

.form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.form__icon {
  object-fit: contain;
  width: 30px;
  margin: 0 5px;
  opacity: 0.5;
  transition: 0.15s;
}

.form__icon:hover {
  opacity: 1;
  transition: 0.15s;
  cursor: pointer;
}
.form__input {
  width: 350px;
  margin: 14px 0;
  font-size: 16px;
}
/* .form__input {
  width: 350px;
  height: 40px;
  margin: 10px 0;
  padding-left: 25px;
  font-size: 13px;
  letter-spacing: 0.15px;
  border: none;
  outline: none;
  font-family: "Montserrat", sans-serif;
  background-color: #ecf0f3;
  transition: 0.25s ease;
  border-radius: 8px;
  box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9;
} */

.form__input:focus {
  box-shadow: inset 4px 4px 4px #d1d9e6, inset -4px -4px 4px #f9f9f9;
}

.form__span {
  margin-top: 30px;
  margin-bottom: 12px;
}

.form__link {
  color: #181818;
  font-size: 15px;
  margin-top: 25px;
  border-bottom: 1px solid #a0a5a8;
  line-height: 2;
}

.switch__title {
  font-size: 20px;
  font-weight: 700;
  line-height: 3;
  color: #181818;
}

.title {
  font-size: 34px;
  font-weight: 700;
  line-height: 3;
  color: #181818;
}

.description {
  font-size: 14px;
  letter-spacing: 0.25px;
  text-align: center;
  line-height: 1.6;
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
.forgetPassword {
  margin-top: 20px;
  text-decoration: underline;
  font-size: 14px;
}
/**/
.a-container {
  z-index: 100;
  left: calc(100% - 600px);
}

.b-container {
  left: calc(100% - 600px);
  z-index: 0;
}

.switch {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 400px;
  padding: 50px;
  z-index: 200;
  transition: 1.25s;
  background-color: #ecf0f3;
  overflow: hidden;
  box-shadow: 4px 4px 10px #d1d9e6, -4px -4px 10px #f9f9f9;
}

.switch__circle {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background-color: #ecf0f3;
  box-shadow: inset 8px 8px 12px #d1d9e6, inset -8px -8px 12px #f9f9f9;
  bottom: -60%;
  left: -60%;
  transition: 1.25s;
}

.switch__circle--t {
  top: -30%;
  left: 60%;
  width: 300px;
  height: 300px;
}

.switch__container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: absolute;
  width: 400px;
  padding: 50px 55px;
  transition: 1.25s;
}

.switch__button {
  cursor: pointer;
}

.switch__button:hover {
  box-shadow: 6px 6px 10px #d1d9e6, -6px -6px 10px #f9f9f9;
  transform: scale(0.985);
  transition: 0.25s;
}

.switch__button:active,
.switch__button:focus {
  box-shadow: 2px 2px 6px #d1d9e6, -2px -2px 6px #f9f9f9;
  transform: scale(0.97);
  transition: 0.25s;
}

/**/
.is-txr {
  left: calc(100% - 400px);
  transition: 1.25s;
  transform-origin: left;
}

.is-txl {
  left: 0;
  transition: 1.25s;
  transform-origin: right;
}

.is-z200 {
  z-index: 200;
  transition: 1.25s;
}

.is-hidden {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  transition: 1s;
}

.is-gx {
  animation: is-gx 1.25s;
}

@keyframes is-gx {
  0%,
  10%,
  100% {
    width: 400px;
  }

  30%,
  50% {
    width: 500px;
  }
}
</style>
