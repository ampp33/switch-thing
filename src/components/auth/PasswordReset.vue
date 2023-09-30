<template>
    <div class="flex justify-center">
        <div class="ma4 pa4 bg-near-white w-30">
            <div v-if="successfullySubmitted">
                Password successfully changed!
            </div>
            <div v-else>
                <h2>Password Reset</h2>
                <div class="mb2 gray f6">
                    Please enter a new password
                </div>
                <div class="mb2">Password</div>
                <input id="password" name="password" v-model="password" class="input-reset ba b--black-20 pa2 mb3 db w-100" type="password" />
                <div :class="!password || passwordTooShort ? 'invalid' : 'valid'" class="mb2 gray f6">Passwords must be at least 6 characters long</div>
                <div class="mb2">Re-Enter Password</div>
                <input id="password2" name="password2" v-model="password2" class="input-reset ba b--black-20 pa2 mb3 db w-100" type="password" />
                <div v-if="passwordsDontMatch" class="mb2 red">Passwords do not match</div>
                <div v-if="invalidFormData" class="mb2 red">Form has missing or incorrect information</div>
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
            password: null,
            password2: null,
            serverError: null,
            successfullySubmitted: false
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
            return !this.password || !this.password2 || this.passwordsDontMatch || this.passwordTooShort
        }
    },
    methods: {
        async submitForm() {
            if(!this.invalidFormData) {
                this.serverError = null
                // TODO finish and test this, I have no idea how this is supposed to work (yet)
                const { error }  = await this.authStore.updateUser(this.email, {
                    password: this.password
                })
                if(error) {
                    this.serverError = error.message
                } else {
                    this.successfullySubmitted = true
                }
                // if there's no error then the above call should redirect to the login screen
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