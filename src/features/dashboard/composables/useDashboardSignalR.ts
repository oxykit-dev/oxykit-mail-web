import { ref } from 'vue'
import * as signalR from '@microsoft/signalr'
import { config } from '@/shared/config'

const dashboardUrl = `${config.signalR.hubUrl}/dashboard`

const connection = new signalR.HubConnectionBuilder()
  .withUrl(dashboardUrl)
  .withAutomaticReconnect()
  .build()

type EmailEvent = Record<string, unknown>
const sentEmails = ref<EmailEvent[]>([])
const queuedEmails = ref<EmailEvent[]>([])

let connected = false
let handlersAttached = false

function attachHandlers() {
  if (handlersAttached) return
  handlersAttached = true
  connection.on('EmailSent', (data: EmailEvent) => {
    sentEmails.value = [...sentEmails.value, data]
  })
  connection.on('EmailQueued', (data: EmailEvent) => {
    queuedEmails.value = [...queuedEmails.value, data]
  })
  connection.onreconnected((id) => console.log('SignalR reconnected:', id))
  connection.onclose((err) => {
    connected = false
    if (err) console.warn('SignalR closed:', err)
  })
}

async function connect() {
  if (connected) return
  attachHandlers()
  try {
    await connection.start()
    connected = true
  } catch (err) {
    console.error('SignalR connection error:', err)
  }
}

async function disconnect() {
  if (!connected) return
  try {
    await connection.stop()
  } catch (err) {
    console.error('SignalR disconnect error:', err)
  } finally {
    connected = false
  }
}

export function useDashboardSignalR() {
  return { sentEmails, queuedEmails, connect, disconnect, connection }
}
