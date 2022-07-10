import { ICreateMessageDto } from '../interfaces'
import { ICradle } from '../container'
import { LIMIT_MESSAGES } from '../constants'

export const messageService = ({ models }: ICradle) => {
  const { messages } = models

  const createOne = async (createMessageDto: ICreateMessageDto) =>
    await messages.create(createMessageDto)

  const findByChatId = async (chat_id: string, page: number) =>
    (
      await messages
        .find({ chat_id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * LIMIT_MESSAGES)
        .limit(LIMIT_MESSAGES)
    ).reverse()

  const findLast = async (chat_ids: string[]) =>
    messages
      .find({ chat_id: { $in: chat_ids } })
      .sort({ createdAt: -1 })
      .limit(1)

  const deleteByChatId = async (chat_id: string) =>
    await messages.deleteMany({ chat_id })

  const udpateOneGuestMessageId = async (
    guest_message_id: string,
    message_id: string,
  ) =>
    await messages.findOneAndUpdate(
      { _id: message_id },
      { guest_message_id },
      { new: true },
    )

  const updateOneEmoji = async (emoji: string | null, message_id: string) =>
    await messages.findOneAndUpdate(
      { _id: message_id },
      { emoji },
      { new: true },
    )

  return {
    createOne,
    findByChatId,
    deleteByChatId,
    udpateOneGuestMessageId,
    updateOneEmoji,
    findLast,
  }
}
