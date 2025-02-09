import { z } from 'zod'
import type { ToolFn } from '../../types'
import fetch from 'node-fetch'

export const redditSubreditToolDefinition = {
  name: 'reddit_subreddit',
  parameters: z.object({}),
  description: 'Get a reddit subreddit',
}

type Args = z.infer<(typeof redditSubreditToolDefinition)['parameters']>

export const redditSubreddit: ToolFn<Args, string> = async ({ toolArgs }) => {
  const { data } = await fetch('https://www.reddit.com/r/nba/.json').then(
    (res) => res.json()
  )

  const relevantInfo = data.children.map((child: any) => ({
    title: child.data.title,
    link: child.data.url,
    subreddit: child.data.subreddit_name_prefixed,
    author: child.data.author,
    upvotes: child.data.ups,
  }))

  return JSON.stringify(relevantInfo, null, 2)
}
