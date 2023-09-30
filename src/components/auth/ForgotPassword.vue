<template>
    <div class="flex justify-center">
        <div class="ma4 pa4 bg-near-white w-30">
            <div v-if="successfullySubmitted">
                Your request has been successfully submitted, if your password matches an account in our system
                you'll soon receive a password reset email that'll contain a link that you can use to reset your password.
            </div>
            <div v-else>
                <h2>Forgot Password</h2>
                <div class="mb2 gray f6">
                    Enter the email address you use to login to your account,
                    if your email address matches an account we have on record you'll soon receive a password reset email.
                </div>
                <div class="mb2">Email Address</div>
                <input id="email" name="email" v-model="email" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" />
                <div v-if="invalidEmail" class="mb2 red">Please enter a valid email address</div>
                <div v-if="serverError != null" class="mb2 red">{{ serverError }}</div>
                <div @click="submitForm" class="white bg-light-red flex items-center content-center justify-center pa3 pointer mb2">
                    Submit
                </div>
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
            email: null,
            serverError: null,
            successfullySubmitted: false
        }
    },
    computed: {
        ...mapStores(useAuthStore),
        invalidEmail() {
            return !this.isValidEmailFormat()
        }
    },
    methods: {
        isValidEmailFormat() {
            return this.email && this.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        },
        async submitForm() {
            if(!this.invalidEmail) {
                this.serverError = null
                const { error }  = await this.authStore.resetPasswordForEmail(this.email, {
                    redirectTo: window.location.origin + '/password-reset'
                })
                if(error) {
                    this.serverError = error.message
                } else {
                    this.successfullySubmitted = true
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