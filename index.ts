import 'dotenv/config'
import { runLLM } from './src/llm'
import { getMessages, addMessages } from './src/memory'
import { runAgent } from './src/agent'
import { z } from 'zod'
import { tools } from './src/tools'

const userMessage = process.argv[2]

if (!userMessage) {
  console.error('Please provide a message')
  process.exit(1)
}

// await addMessages([{ role: 'user', content: userMessage }])

// const messages = await getMessages()
// const response = await runLLM({
//   messages,
//   tools,
// })

// await addMessages([{ role: 'assistant', content: response }])
// const getWeather = () => 'its hot, 3434 degress'

// const weatherTool = {
//   name: 'get_weather',
//   description: `use this to get the weather.`,
//   parameters: z.object({
//     reasoning: z.string().describe('why did you pick this tool?'),
//   }),
// }
await runAgent({ userMessage, tools })

// console.log('you', response)
