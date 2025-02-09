//using lowdb

import { JSONFilePreset } from 'lowdb/node'
// send type -- need to look into details
import type { AIMessage } from '../types'
//create confict free ids
import { v4 as uuid4 } from 'uuid'
import { create } from 'got'

export type MessageWithMetaData = AIMessage & {
  id: string
  createdAt: string
}

type Data = {
  messages: MessageWithMetaData[]
}

export const addMetaData = (message: AIMessage) => {
  return {
    ...message,
    id: uuid4(),
    createdAt: new Date().toISOString(),
  }
}

export const removeMetaData = (message: MessageWithMetaData) => {
  const { id, createdAt, ...rest } = message
  return rest
}

const defaultData: Data = { messages: [] }

export const getDb = async () => {
  const db = await JSONFilePreset<Data>('db.json', defaultData)

  return db
}

export const addMessages = async (messages: AIMessage[]) => {
  const db = await getDb()
  db.data.messages.push(...messages.map(addMetaData))
  await db.write()
}

export const getMessages = async () => {
  const db = await getDb()
  return db.data.messages.map(removeMetaData)
}

export const saveToolResponse = async (
  toolCallId: string,
  toolResponse: string
) => {
  return addMessages([
    {
      role: 'tool',
      content: toolResponse,
      tool_call_id: toolCallId,
    },
  ])
}
