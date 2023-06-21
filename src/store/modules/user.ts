import { defineStore } from 'pinia'

export default defineStore('user', {
  state: () => ({
    name: '',
    counter: 0
  }),
  actions: {
    clear() {
      this.$state = {
        name: '',
        counter: 0
      }
    },
    increment() {
      this.counter++
    }     
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
      }
    ]
  }
})