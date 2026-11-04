export const REACTION_TYPES = [
  "like",
  "love",
  "haha",
  "wow",
  "sad",
  "angry",
] as const

export type ReactionType = (typeof REACTION_TYPES)[number]

export interface MessageReaction {
  id: string
  messageId: string
  userId: string
  type: ReactionType
  createdAt: string
}

export interface MessageReactionSummary {
  type: ReactionType
  count: number
  reactedByMe: boolean
}

export interface CreateMessageReactionDto {
  type: ReactionType
}
