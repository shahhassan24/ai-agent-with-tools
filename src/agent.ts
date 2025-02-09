import type { AIMessage } from '../types'
import { runLLM } from './llm'
import { z } from 'zod'
// import { runTool } from './toolRunner'
import { addMessages, getMessages, saveToolResponse } from './memory'
import { logMessage, showLoader } from './ui'
import { runTool } from './toolRunner'

export const runAgent = async ({
  userMessage,
  tools,
}: {
  userMessage: string
  tools: any[]
}) => {
  await addMessages([{ role: 'user', content: userMessage }])

  const loader = showLoader('🤔')

  while (true) {
    const history = await getMessages()

    const response = await runLLM({ messages: history, tools })
    await addMessages([response])

    if (response.content) {
      logMessage(response)
      loader.stop()
      return getMessages()
    }

    if (response.tool_calls) {
      const toolCall = response.tool_calls[0]
      logMessage(response)
      loader.update(`executing: ${toolCall.function.name}`)

      const toolResponse = await runTool(toolCall, userMessage)
      await saveToolResponse(toolCall.id, toolResponse)
      loader.update(`done: ${toolCall.function.name}`)
    }

    // logMessage(response)
    // loader.stop()
    // return getMessages()
  }
}
