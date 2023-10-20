import { defineStore } from "pinia"
import { supabase } from "../../supabase"

export const useAuthStore = defineStore('auth', {
    state: () => ({
        loggedIn: false,
        session: null
    }),
    getters: {
        isLoggedIn() {
            return this.loggedIn
        },
        getSession() {
            return this.session
        }
    },
    actions: {
        async signup(email, password) {
            const { data, error } = await supabase.auth.signUp({
                  email,
                  password
                })

            return { data, error }
        },
        async resetPassword(email, redirectTo) {
            return await supabase.auth.resetPasswordForEmail(email, {
                redirectTo
            })
        },
        async loginWithSso(provider, redirectUrl) {
            const fullRedirectUrl
                = window.location.origin + '/login-success'
                    + (redirectUrl ? '?redirect=' + redirectUrl : '')
            
            await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: fullRedirectUrl,
                    queryParams: {
                        prompt: 'select_account'
                    }
                }
            })
        },
        async login(email, password) {
            return await supabase.auth.signInWithPassword({
                email,
                password
              }
            )
        },
        async loadSession() {
            const { data } = await supabase.auth.getSession()
            this.session = data.session
            this.loggedIn = true
        },
        async logout() {
            await supabase.auth.signOut()
            this.session = null
            this.loggedIn = false
        }
    },
    persist: true
})