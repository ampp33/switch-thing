<template>
    <div class="flex justify-center">
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
    </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useAuthStore } from '../../stores/auth-store'

export default {
    data() {
        return {
            email: null,
            password: null,
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
        }
    }
}
</script>

<style>
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