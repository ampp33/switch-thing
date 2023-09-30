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
        async signup(displayName, email, password) {
            const { data, error } = await supabase.auth.signUp({
                  email,
                  password,
                  options: {
                    data: { display_name: displayName }
                  }
                })

            return { data, error }
        },
        async resetPassword(email, redirectTo) {
            return await supabase.auth.resetPasswordForEmail(email, {
                redirectTo
            })
        },
        async loginWithSso(provider) {
            await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: window.location.origin + '/login-success'
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