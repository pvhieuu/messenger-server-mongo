import { Response } from 'express'
import {
  BACKGROUND_COLOR,
  IUpdateNicknameDto,
  MAIN_COLOR,
  MAIN_EMOJI,
} from '../interfaces'
import { ICradle } from '../container'
import { BACKGROUND_COLORS, MAIN_COLORS, MAIN_EMOJIS } from '../constants'
import _ from 'lodash'

export const chatController = ({ helpers, services }: ICradle) => {
  const { responseHelper } = helpers
  const { chatService, messageService, userService } = services

  const createNewChat = async (req: any, res: Response) => {
    const guestId = _.trim(req.body.guest_id)
    if (guestId === req.userId)
      return responseHelper.badRequest(res, 'Cannot create a new chat!')
    try {
      const existingHostChat = await chatService.findOneByHostGuestId(
        req.userId,
        guestId,
      )
      if (existingHostChat)
        return responseHelper.badRequest(res, 'Chat room already exists!')
      const existingGuestChat: any = await chatService.findOneByHostGuestId(
        guestId,
        req.userId,
      )
      const guestChatId: any = existingGuestChat ? existingGuestChat._id : null
      const newChat: any = await chatService.createOne({
        host_id: req.userId,
        guest_id: guestId,
        guest_chat_id: guestChatId,
        readed: true,
        nickname_host: existingGuestChat?.nickname_guest || null,
        nickname_guest: existingGuestChat?.nickname_host || null,
        color: existingGuestChat?.color || '#0a7cff',
        background_color: existingGuestChat?.background_color || '#fff',
        emoji: existingGuestChat?.emoji || 'fas fa-thumbs-up',
      })
      const hostInfo = await userService.findOneById(newChat.host_id as any)
      const guestInfo = await userService.findOneById(newChat.guest_id as any)
      const lastMessage: any = []
      const newChatInfo = {
        ...newChat._doc,
        host: hostInfo,
        guest: guestInfo,
        last_message: lastMessage,
      }
      if (existingGuestChat) {
        await chatService.updateOneGuestChatId(
          newChat._id,
          existingGuestChat._id,
        )
      }
      return responseHelper.responseSuccess(
        res,
        'Create a new chat successfully',
        { new_chat: newChatInfo },
      )
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  const getListChats = async (req: any, res: Response) => {
    try {
      const listChats: any = await chatService.findByHostId(req.userId)
      if (!listChats || !listChats.length)
        return responseHelper.responseSuccess(
          res,
          'Get list chats successfully',
          { list_chats: [] },
        )
      const hostInfo = await userService.findOneById(
        listChats[0].host_id as any,
      )
      const listGuestIds: any = []
      const listChatIds: any = []
      for (const chat of listChats) {
        listGuestIds.push(chat.guest_id)
        listChatIds.push(chat._id)
      }
      const listGuestInfo = await userService.findByIds(listGuestIds)
      const memorizeGuestInfo: any = {}
      for (const guestInfo of listGuestInfo) {
        memorizeGuestInfo[guestInfo._id.toString()] = guestInfo
      }
      const listLastMessages = await messageService.findLast(listChatIds)
      const memorizeLastMessage: any = {}
      for (const lastMessage of listLastMessages) {
        if (lastMessage.chat_id) {
          memorizeLastMessage[lastMessage.chat_id?.toString()] = lastMessage
        }
      }
      const listChatsInfo = []
      for (const chat of listChats) {
        listChatsInfo.push({
          ...chat._doc,
          host: hostInfo,
          guest: chat.guest_id
            ? memorizeGuestInfo[chat.guest_id?.toString()]
            : null,
          last_message: memorizeLastMessage[chat._id.toString()]
            ? [memorizeLastMessage[chat._id.toString()]]
            : [],
        })
      }
      return responseHelper.responseSuccess(
        res,
        'Get list chats successfully',
        { list_chats: listChatsInfo },
      )
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  const deleteChat = async (req: any, res: Response) => {
    const chatId = _.trim(req.query.chat_id)
    const guestId = _.trim(req.query.guest_id)
    let guestChatId: string | null = _.trim(req.query.guest_chat_id)
    if (!guestChatId || guestChatId === 'null') {
      guestChatId = null
    }
    try {
      const deletedChat = await chatService.deleteOne(chatId, req.userId)
      if (!deletedChat)
        return responseHelper.badRequest(res, 'Cannot delete chat room!')
      await messageService.deleteByChatId(chatId)
      if (guestChatId) {
        await chatService.updateOneGuestChatId(null, guestChatId)
      }
      return responseHelper.responseSuccess(res, 'Delete chat successfully', {
        deleted_chat: deletedChat,
        chat_id: chatId,
        guest_chat_id: guestChatId,
        guest_id: guestId,
      })
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  const updateReaded = async (req: any, res: Response) => {
    const chat_id = req.body.chat_id?.trim()
    try {
      await chatService.updateOneReaded(chat_id, true)
      return responseHelper.responseSuccess(res, 'Update readed successfully', {
        chat_id,
      })
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  const updateNickname = async (req: any, res: Response) => {
    const updateNicknameDto: IUpdateNicknameDto = req.body
    const chatId = updateNicknameDto.chat_id
    let guestChatId = updateNicknameDto.guest_chat_id
    const guestId = updateNicknameDto.guest_id
    try {
      await chatService.updateOneNickname(updateNicknameDto.data, chatId)
      await chatService.updateOneNickname(
        {
          nickname_host: updateNicknameDto.data.nickname_guest,
          nickname_guest: updateNicknameDto.data.nickname_host,
        },
        guestChatId,
      )
      return responseHelper.responseSuccess(
        res,
        'Update nickname successfully',
        {
          updated_nickname: updateNicknameDto.data,
          guest_id: guestId,
          guest_chat_id: guestChatId,
        },
      )
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  const updateColor = async (req: any, res: Response) => {
    const color: MAIN_COLOR | null = req.body.color?.trim() || null
    const chatId = req.body.chat_id?.trim() || null
    const guestId = req.body.guest_id?.trim() || null
    let guestChatId = req.body.guest_chat_id?.trim() || null
    if (!chatId || !guestId || !color)
      return responseHelper.badRequest(res, 'Cannot update color!')
    if (!MAIN_COLORS.includes(color))
      return responseHelper.badRequest(res, 'Invalid color!')
    try {
      await chatService.updateOneColor(color, chatId)
      await chatService.updateOneColor(color, guestChatId)
      return responseHelper.responseSuccess(res, 'Change color successfully', {
        color,
        guest_chat_id: guestChatId,
        guest_id: guestId,
      })
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  const updateBackgroundColor = async (req: any, res: Response) => {
    const backgroundColor: BACKGROUND_COLOR | null =
      req.body.background_color?.trim() || null
    const chatId = req.body.chat_id?.trim() || null
    const guestId = req.body.guest_id?.trim() || null
    let guestChatId = req.body.guest_chat_id?.trim() || null
    if (!chatId || !guestId || !backgroundColor)
      return responseHelper.badRequest(res, 'Cannot update color!')
    if (!BACKGROUND_COLORS.includes(backgroundColor))
      return responseHelper.badRequest(res, 'Invalid color!')
    try {
      await chatService.updateOneBackgroundColor(backgroundColor, chatId)
      await chatService.updateOneBackgroundColor(backgroundColor, guestChatId)
      return responseHelper.responseSuccess(
        res,
        'Change background color successfully',
        {
          background_color: backgroundColor,
          guest_chat_id: guestChatId,
          guest_id: guestId,
        },
      )
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  const updateEmoji = async (req: any, res: Response) => {
    const emoji: MAIN_EMOJI | null = req.body.emoji?.trim() || null
    const chatId = req.body.chat_id?.trim() || null
    const guestId = req.body.guest_id?.trim() || null
    let guestChatId = req.body.guest_chat_id?.trim() || null
    if (!chatId || !guestId || !emoji)
      return responseHelper.badRequest(res, 'Cannot update emoji!')
    if (!MAIN_EMOJIS.includes(emoji))
      return responseHelper.badRequest(res, 'Invalid emoji!')
    try {
      await chatService.updateOneEmoji(emoji, chatId)
      await chatService.updateOneEmoji(emoji, guestChatId)
      return responseHelper.responseSuccess(res, 'Change emoji successfully', {
        emoji,
        guest_chat_id: guestChatId,
        guest_id: guestId,
      })
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  return {
    createNewChat,
    getListChats,
    deleteChat,
    updateReaded,
    updateNickname,
    updateColor,
    updateBackgroundColor,
    updateEmoji,
  }
}
