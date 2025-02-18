<template>
  <v-snackbar v-model="notificationsStore.active" :timeout="2000" variant="tonal">
    {{ notificationsStore.notification }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { useNotificationsStore } from '@/stores/notifications'

const notificationsStore = useNotificationsStore()
</script>

<style scoped></style>
