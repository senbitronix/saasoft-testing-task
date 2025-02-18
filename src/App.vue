<script setup lang="ts">
import AccountManagementForm from './components/AccountManagementForm.vue'
import NotificationMessage from './components/NotificationMessage.vue'
</script>

<template>
  <main>
    <div class="container">
      <AccountManagementForm />
    </div>
  </main>
  <NotificationMessage />
</template>

<style scoped>
.container {
  margin: 0 auto;
  max-width: 1200px;
  /* color: #9f9fff; */
  /* color: #1f1e1e; */
}
</style>
