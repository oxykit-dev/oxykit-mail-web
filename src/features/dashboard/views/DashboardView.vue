<script setup lang="ts">
import {
  DashboardStats,
  DashboardEmailsPerDayChart,
  DashboardLatestEmails,
  DashboardFailures,
  DashboardTopRecipients,
  DeadLetteredEmails,
} from '../components'
import { useAuthStore } from '@/features/identity'

const auth = useAuthStore()
</script>

<template>
  <main>
    <h1 class="mb-6">Email Dashboard</h1>
    <v-container fluid class="pa-0">
      <v-row class="mb-2">
        <v-col cols="12" md="4">
          <DashboardStats />
        </v-col>
        <v-col cols="12" md="8">
          <DashboardEmailsPerDayChart />
        </v-col>
      </v-row>
      <v-row class="mb-2">
        <v-col cols="12" md="6">
          <DashboardLatestEmails />
        </v-col>
        <v-col cols="12" md="6">
          <DashboardFailures />
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="auth.isAdmin" cols="12" md="6">
          <DashboardTopRecipients />
        </v-col>
        <v-col cols="12" :md="auth.isAdmin ? 6 : 12">
          <DeadLetteredEmails />
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>
