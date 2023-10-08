<template>
    <div class="flex justify-center">
        <transition name="login" mode="in-out">
            <div v-if="showLogin" class="flex pa5 login-back-panel">
                <div class="flex pa5 items-center w-50">
                    <div class="tc">
                        <div class="big-text">
                            Welcome Back!
                        </div>
                        <div class="normal-text ma4">
                            If you don't already have an account with us you can create one by clicking the button below
                        </div>
                        <div class="">
                            <button type="button" @click="setShowLogin(false)">Sign Up</button>
                        </div>
                    </div>
                </div>
                <div class="flex pa5 items-center input-panel tc w-50">
                    <div>
                        <img src="/src/assets/icon.png" width="150" />
                        <div @click="loginWithProvider('google')" class="ba b--silver flex items-center content-center justify-center pa3 pointer">
                            <img src="../../assets/auth-providers/google.png" height="30" class="mr2" />
                            Sign In With Google
                        </div>
                        <div v-if="oauthError" class="mb2 red">{{ oauthError }}</div>
                        <div class="separator ma3">or login with email</div>
                        <div class="">
                            <input type="email" placeholder="email" v-model="email" class="mb3" />
                            <input type="password" placeholder="password" v-model="password" class="mb3" />
                        </div>
                        <div v-if="signinError" class="mb2 red">{{ signinError }}</div>
                        <div class="">
                            <button type="button" @click="login">Sign In</button>
                        </div>
                        <div class="mt3">
                            <router-link to="/forgot-password"><div class="mb2">Forgot Your Password?</div></router-link>
                            <router-link to="/signup"><div>Sign Up</div></router-link>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="flex pa5 login-back-panel">
                <div class="flex pa5 items-center input-panel tc w-50">
                    <div>
                        <img src="/src/assets/icon.png" width="150" />
                        <div class="">
                            <input type="text" placeholder="user name" v-model="username" class="mb3" />
                            <input type="email" placeholder="email" v-model="email" class="mb3" />
                            <input type="password" placeholder="password" v-model="password" class="mb3" />
                            <input type="password" placeholder="confirm password" v-model="password2" class="mb3" />
                        </div>
                        <div v-if="signinError" class="mb2 red">{{ signinError }}</div>
                        <div class="">
                            <button type="button" @click="login">Sign Up</button>
                        </div>
                    </div>
                </div>
                <div class="flex pa5 items-center w-50">
                    <div class="tc">
                        <div class="big-text">
                            The Adventure Begins
                        </div>
                        <div class="normal-text ma4">
                            <div>
                                Enter your personal information to create your account!
                            </div>
                            <div class="mt4">
                                If you already have an account you can click the button below to use the login screen
                            </div>
                        </div>
                        <div class="">
                            <button type="button" @click="setShowLogin(true)">Sign In</button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <!-- <div class="flex justify-center">
            <div class="ma4 pa4 bg-near-white w-30">
                <div @click="loginWithProvider('google')" class="ba b--silver flex items-center content-center justify-center pa3 pointer">
                    <img src="../../assets/auth-providers/google.png" height="30" class="mr2" />
                    Sign In With Google
                </div>
                <div v-if="oauthError" class="mb2 red">{{ oauthError }}</div>
                <div class="separator ma3">or continue using</div>
                <div class="mb2">Email Address</div>
                <input id="email" name="email" v-model="email" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" />
                <div class="mb2">Password</div>
                <input id="password" name="password" v-model="password" class="input-reset ba b--black-20 pa2 mb3 db w-100" type="password" />
                <div v-if="signinError" class="mb2 red">{{ signinError }}</div>
                <div @click="login" class="white bg-light-red flex items-center content-center justify-center pa3 pointer mb2">
                    Sign In
                </div>
                <router-link to="/forgot-password"><div class="mb2">Forgot Your Password?</div></router-link>
                <router-link to="/signup"><div>Sign Up</div></router-link>
            </div>
        </div> -->
    </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useAuthStore } from '../../stores/auth-store'

export default {
    data() {
        return {
            showLogin: true,
            username: null,
            email: null,
            password: null,
            password2: null,
            oauthError: null,
            signinError: null
        }
    },
    computed: {
        ...mapStores(useAuthStore)
    },
    methods: {
        async loginWithProvider(provider) {
            this.oauthError = null
            const { error } = await this.authStore.loginWithSso(provider)
            if(error) {
                this.oauthError = error.message
            }
        },
        async login() {
            this.signinError = null
            const { error } = await this.authStore.login(this.email, this.password)
            if(error) {
                this.signinError = error.message
            } else {
                this.$router.push('/login-success')
            }
        },
        setShowLogin(showLogin) {
            this.showLogin = showLogin
        }
    }
}
</script>

<style scoped>
.login-enter-from,
.login-leave-to {
    opacity: 0;
}
.login-enter-to,
.login-leave-from {
    opacity: 1;
}
.login-enter-active {
    transition: all .7s ease-out;
}

.login-leave-active {
    transition: all .7s ease-in;
}

.login-back-panel {
    height: 800px;
    width: 80%;
    background: #2D2941;
    position: absolute;
}

.input-panel {
    background: #342F4B;
}

.big-text {
    font-size: 60px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    background: linear-gradient(100deg, #A7ADBF -6.45%, #A387FE 97.4%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.normal-text {
    color: #D2DBED;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
}

input {
    border: none;
    border-radius: 10px;
    color: #D2DBED;
    background: #312C47;
    padding: 15px;
}

button[type=button] {
    padding: 15px;
}

.login-form {
    display: flex;
}

.separator {
  display: flex;
  align-items: center;
  text-align: center;
  color: #ccc;
}

.separator::before,
.separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #ccc;
}

.separator:not(:empty)::before {
  margin-right: .25em;
}

.separator:not(:empty)::after {
  margin-left: .25em;
}
</style>