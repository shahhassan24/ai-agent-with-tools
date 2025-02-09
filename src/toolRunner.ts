import type OpenAI from 'openai'
import { dadJoke, dadJokesToolDefinition } from './tools/dadJokes'
import { redditSubreddit, redditSubreditToolDefinition } from './tools/reddit'

export const runTool = async (
  toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
  userMessage: string
) => {
  const input = {
    userMessage,
    toolArgs: JSON.parse(toolCall.function.arguments || '{}'),
  }

  switch (toolCall.function.name) {
    case dadJokesToolDefinition.name:
      return dadJoke(input)
    case redditSubreditToolDefinition.name:
      return redditSubreddit(input)
    default:
      return `Never Run this tool: ${toolCall.function.name} again`
  }
}
