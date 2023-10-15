import { defineStore } from "pinia"

export const useLoadingStore = defineStore('loading', {
    state: () => ({
        showLoading: false,
        transitionInProgress: false,
        queuedTransition: false,
        queuedCallback: null
    }),
    getters: {
        isLoading() {
            return this.showLoading
        }
    },
    actions: {
        transitionComplete() {
            this.transitionInProgress = false
            if(this.queuedCallback) this.queuedCallback()
            if(this.queuedTransition) {
                this.queuedTransition = false
                this.toggleLoading()
            }
        },
        toggleLoading(callback) {
            if(this.transitionInProgress) {
                this.queuedTransition = true
                this.queuedCallback = callback
            } else {
                if(callback) callback()
                this.transitionInProgress = true
                this.showLoading = !this.showLoading
            }
        }
    }
})