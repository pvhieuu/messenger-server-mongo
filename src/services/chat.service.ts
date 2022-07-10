import { ICreateChatDto } from '../interfaces'
import { ICradle } from '../container'

export const chatService = ({ models }: ICradle) => {
  const { chats } = models

  const findOneByHostGuestId = async (host_id: string, guest_id: string) =>
    await chats.findOne({ host_id, guest_id })

  const updateOneGuestChatId = async (
    guest_chat_id: string | null,
    chat_id: string,
  ) =>
    await chats.findOneAndUpdate(
      { _id: chat_id },
      { guest_chat_id },
      { new: true },
    )

  const createOne = async (createChatDto: ICreateChatDto) =>
    await chats.create(createChatDto)

  const findOneById = async (chat_id: string) =>
    await chats.findOne({ _id: chat_id })

  const findByHostId = async (host_id: string) =>
    await chats.find({ host_id }).sort({ last_message_time: -1 })

  const deleteOne = async (chat_id: string, host_id: string) =>
    await chats.findOneAndDelete({ _id: chat_id, host_id })

  const updateOneReaded = async (chat_id: string, readed: boolean) =>
    await chats.findOneAndUpdate({ _id: chat_id }, { readed }, { new: true })

  const updateOneNickname = async (
    data: {
      nickname_host: string | null
      nickname_guest: string | null
    },
    chat_id: string,
  ) => await chats.findOneAndUpdate({ _id: chat_id }, data, { new: true })

  const updateOneColor = async (color: string, chat_id: string) =>
    await chats.findOneAndUpdate({ _id: chat_id }, { color }, { new: true })

  const updateOneBackgroundColor = async (
    background_color: string,
    chat_id: string,
  ) =>
    await chats.findOneAndUpdate(
      { _id: chat_id },
      { background_color },
      { new: true },
    )

  const updateOneEmoji = async (emoji: string, chat_id: string) =>
    await chats.findOneAndUpdate({ _id: chat_id }, { emoji }, { new: true })

  const updateOneLastMessageTime = async (
    last_message_time: Date,
    chat_id: string,
  ) =>
    await chats.findOneAndUpdate(
      { _id: chat_id },
      { last_message_time },
      { new: true },
    )

  return {
    findOneByHostGuestId,
    updateOneGuestChatId,
    createOne,
    findByHostId,
    deleteOne,
    findOneById,
    updateOneReaded,
    updateOneNickname,
    updateOneColor,
    updateOneBackgroundColor,
    updateOneEmoji,
    updateOneLastMessageTime,
  }
}
