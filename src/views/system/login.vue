<template>
  <div class="container">
    <div class="box">
      <div class="login-content-left">
        <img :src="loginLeftPng" />
        <div class="login-content-left-mask">
          <div>{{ $t(systemTitle) }}</div>
          <div v-html="$t(systemSubTitle)"></div>
        </div>
      </div>

      <div class="box-inner">
        <h1>{{ $t("message.system.welcome") }}</h1>
        <el-form class="form" label-suffix="：" size="large" label-width="80">
          <el-form-item label="账号">
            <el-input
              size="large"
              v-model="formData.account"
              placeholder="请输入账号"
              type="text"
              maxlength="50"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input
              size="large"
              ref="password"
              v-model="formData.password"
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              maxlength="50"
              @keypress.enter="onSubmit"
            >
              <!-- <template #append>
                <i
                  class="sfont password-icon"
                  :class="passwordType ? 'system-yanjing-guan' : 'system-yanjing'"
                  @click="passwordTypeChange"
                ></i>
              </template> -->
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              :loading="state.loading"
              @click="onSubmit"
              style="width: 100%"
              size="medium"
              @keypress.enter="onSubmit"
            >
              {{ $t("message.system.login") }}
            </el-button>
          </el-form-item>
        </el-form>
        <div class="fixed-top-right">
          <select-lang />
        </div>
      </div>
    </div>

    <el-card style="background-color: transparent">
      时光荏苒人易老，往事如烟梦已遐。 莫叹浮生多苦短，且将旅行趁年华。
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { systemTitle, systemSubTitle } from "@/config";
import { defineComponent, ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import type { RouteLocationRaw } from "vue-router";
import { ElMessage } from "element-plus";
import selectLang from "@/layout/components/functionList/word.vue";
import loginLeftPng from "@/assets/login/left.jpg";
import { isMobile } from "@/utils";

const store = useStore();
const router = useRouter();
const route = useRoute();
const formData = reactive({
  account: "userX",
  password: "123456",
  identity: "internal_operator",
});

const state = reactive<{
  loading: boolean;
}>({
  loading: false,
});

const passwordType = ref("password");
const checkForm = () => {
  return new Promise((resolve, reject) => {
    if (formData.account === "") {
      ElMessage.warning({
        message: "用户名不能为空",
        type: "warning",
      });
      return;
    }
    if (formData.password === "") {
      ElMessage.warning({
        message: "密码不能为空",
        type: "warning",
      });
      return;
    }
    resolve(true);
  });
};
const onSubmit = () => {
  checkForm().then(() => {
    state.loading = true;
    let params = {
      account: formData.account,
      password: formData.password,
      identity: formData.identity,
    };
    store
      .dispatch("user/login", params)
      .then(async () => {
        ElMessage.success({
          message: "登录成功",
          type: "success",
          showClose: true,
          duration: 1000,
        });
        // location.reload();
        // await getAuthRoutes()
        // await router.push(route.query.redirect as RouteLocationRaw || '/')

        goToHome();
      })
      .finally(() => {
        state.loading = false;
      });
  });
};

function goToHome() {
  // if (!isMobile()) {
  return setTimeout(() => {
    router.push((route.query.redirect as RouteLocationRaw) || "/");
  }, 500);
  // }
  // return setTimeout(() => {
  //     router.push({
  //       path: "/mobile/index"
  //     });
  //   }, 500);
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #fff url("@/assets/login/bg.png") no-repeat center;
  overflow: hidden;
  background-size: cover;
  cursor: pointer;
  user-select: none;

  .box {
    width: 1160px;
    display: flex;
    position: absolute;
    left: 50%;
    top: 50%;
    background: white;
    border-radius: 8px;
    transform: translate(-50%, -50%);
    height: 440px;
    overflow: hidden;
    box-shadow: 0 6px 20px 5px rgba(152, 152, 152, 0.1),
      0 16px 24px 2px rgba(117, 117, 117, 0.14);

    .login-content-left {
      position: relative;

      img {
        height: 440px;
      }

      .login-content-left-mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(
          rgba(0, 204, 222, 0.8),
          rgba(51, 132, 224, 0.8)
        );
        text-align: center;
        color: #fff;
        font-size: 1.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        letter-spacing: 2px;

        div:nth-child(1) {
          font-size: 3.5rem;
          margin-bottom: 1em;
        }
      }
    }

    .box-inner {
      width: 500px;

      h1 {
        margin-top: 80px;
        text-align: center;
      }

      .form {
        width: 80%;
        margin: 50px auto 15px;

        .el-input {
          margin-bottom: 20px;
        }

        .password-icon {
          cursor: pointer;
          color: #409eff;
        }
      }

      .fixed-top-right {
        position: absolute;
        top: 10px;
        right: 10px;
      }
    }
  }
}

@media screen and (max-width: 1260px) {
  .login-content-left {
    display: none;
  }
  .box {
    width: 500px !important;
  }
}

@media screen and (max-width: 750px) {
  .container .box,
  .container .box-inner {
    width: 100vw !important;
    height: 100vh;
    box-shadow: none;
    left: 0;
    top: 0;
    transform: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
      margin-top: 0;
    }

    .form {
    }
  }
}
</style>
