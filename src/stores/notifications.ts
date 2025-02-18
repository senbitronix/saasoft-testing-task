import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationsStore = defineStore('notifications', () => {
  const notification = ref()
  const active = ref()

  function add(msg: string) {
    notification.value = msg
    active.value = true
  }

  return {
    add,
    active,
    notification,
  }
})
