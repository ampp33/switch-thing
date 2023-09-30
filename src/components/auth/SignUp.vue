<template>
    <div class="flex justify-center">
        <div class="ma4 pa4 bg-near-white w-30">
            <h2>Create New Account</h2>
            <div class="mb2">Display Name</div>
            <input id="displayName" name="displayName" v-model="displayName" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" />
            <div class="mb2">Email Address</div>
            <input id="email" name="email" v-model="email" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" />
            <div class="mb2">Password</div>
            <input id="password" name="password" v-model="password" class="input-reset ba b--black-20 pa2 mb3 db w-100" type="password" />
            <div :class="!password || passwordTooShort ? 'invalid' : 'valid'" class="mb2 gray f6">Passwords must be at least 6 characters long</div>
            <div class="mb2">Re-Enter Password</div>
            <input id="password2" name="password2" v-model="password2" class="input-reset ba b--black-20 pa2 mb3 db w-100" type="password" />
            <div v-if="passwordsDontMatch" class="mb2 red">Passwords do not match</div>
            <div v-if="invalidFormData" class="mb2 red">Form has missing or incorrect information</div>
            <div v-if="signupError" class="mb2 red">{{ signupError }}</div>
            <div @click="callSignUp" class="white bg-light-red flex items-center content-center justify-center pa3 pointer mb2">
                Sign Up
            </div>
        </div>
    </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useAuthStore } from '../../stores/auth-store'

export default {
    data() {
        return {
            displayName: null,
            email: null,
            password: null,
            password2: null,
            signupError: null
        }
    },
    computed: {
        ...mapStores(useAuthStore),
        passwordsDontMatch() {
            return this.password && this.password2 && this.password != this.password2
        },
        passwordTooShort() {
            return this.password && this.password.length < 6 
        },
        invalidFormData() {
            return !this.displayName || !this.email || !this.password || !this.password2 || this.passwordsDontMatch
                        || this.passwordTooShort
                        || !this.isValidEmailFormat()
        }
    },
    methods: {
        isValidEmailFormat() {
            return this.email && this.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        },
        async callSignUp() {
            if(!this.invalidFormData) {
                this.signupError = null
                const { data, error }  = await this.authStore.signup(this.displayName, this.email, this.password)
                console.log(data, error)
                if(error) {
                    this.signupError = error.message
                } else {
                    this.$router.push('/signup-success')
                }
            }
        }
    }
}
</script>

<style>
.valid {
    color: green;
}
.invalid {
    color: red;
}
</style>