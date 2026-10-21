<template>
  <div class="login-wrapper">
    <v-card class="card--auth" :elevation="elevation">
      <v-card-title class="u-text-center">{{ title }}</v-card-title>
      <v-card-text>
        <slot />
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title?: string; elevation?: number }>()

// default prop values for template consumers (handled in markup when needed)
</script>

<style scoped>
/* auth card relies on shared utilities; keep minimal here */
</style>
