import { defineStore } from "pinia";

export default defineStore('config', {
  state: () => ({
    appDark: false,
  }),
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage
      }
    ]
  }
})