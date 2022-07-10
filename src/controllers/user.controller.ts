import { hash, verify } from 'argon2'
import { Response } from 'express'
import { sign } from 'jsonwebtoken'
import { ICradle } from '../container'
import _ from 'lodash'

export const userController = ({ helpers, services, envs }: ICradle) => {
  const { responseHelper, convertHelper } = helpers
  const { userService } = services

  const registerNewUser = async (req: any, res: Response) => {
    const phoneOrEmail = _.trim(req.body.phone_or_email)
    const password = _.trim(req.body.password)
    const fullname = _.trim(req.body.fullname)
    try {
      const existingUser =
        req.type === 'email'
          ? await userService.findOneByEmail(phoneOrEmail)
          : await userService.findOneByPhoneNum(phoneOrEmail)
      if (existingUser)
        return responseHelper.badRequest(
          res,
          `${
            req.type === 'email' ? 'Email' : 'Phone number'
          } already exists, please choose another one!`,
        )
      const hashedPassword = await hash(`${password}${envs.ENCRYPT_PASSWORD}`)
      const createNewUser = (
        phone_number: string | null,
        email: string | null,
      ) => ({
        phone_number,
        email,
        password: hashedPassword,
        fullname,
        fresh_name: convertHelper.removeAccents(fullname),
      })
      await userService.createOne(
        req.type === 'email'
          ? createNewUser(null, phoneOrEmail)
          : createNewUser(phoneOrEmail, null),
      )
      return responseHelper.responseSuccess(
        res,
        'Successful account registration',
      )
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  const loginAccountUser = async (req: any, res: Response) => {
    const phoneOrEmail = _.trim(req.body.phone_or_email)
    const password = _.trim(req.body.password)
    try {
      const existingUser =
        req.type === 'email'
          ? await userService.findOneByEmail(phoneOrEmail)
          : await userService.findOneByPhoneNum(phoneOrEmail)
      if (!existingUser)
        return responseHelper.badRequest(
          res,
          `${
            req.type === 'email' ? 'Email' : 'Phone number'
          } or password incorrect, please try again!`,
        )
      const verifyPassword = await verify(
        existingUser.password as string,
        `${password}${envs.ENCRYPT_PASSWORD}`,
      )
      if (!verifyPassword)
        return responseHelper.badRequest(
          res,
          `${
            req.type === 'email' ? 'Email' : 'Phone number'
          } or password incorrect, please try again!`,
        )
      const accessToken = sign(
        { userId: existingUser._id },
        envs.ACCESS_TOKEN_SECRET,
      )
      return responseHelper.responseSuccess(res, 'Logged in successfully', {
        access_token: accessToken,
      })
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  const logoutAccountUser = async (req: any, res: Response) => {
    try {
      await userService.updateOneStatusOnline(false, req.userId)
      await userService.updateOneLastLogout(req.userId)
      return responseHelper.responseSuccess(res, 'Log out account successfully')
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  const changeAvatar = async (req: any, res: Response) => {
    const newAvatar = req.body.new_avatar?.trim() || null
    try {
      const updatedUser = await userService.updateOneAvatar(
        newAvatar,
        req.userId,
      )
      return responseHelper.responseSuccess(
        res,
        'Update new avatar successfully',
        { new_avatar: updatedUser?.avatar },
      )
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  const getMyInfo = async (req: any, res: Response) => {
    try {
      const myInfo = await userService.findOneById(req.userId)
      return responseHelper.responseSuccess(res, 'Get my info successfully', {
        my_info: myInfo,
      })
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  const searchUsers = async (req: any, res: Response) => {
    let pattern = req.query.pattern?.trim() || null
    if (!pattern) return responseHelper.badRequest(res, 'Pattern is required!')
    pattern = convertHelper.removeAccents(pattern)
    try {
      const listUsers = await userService.findByPattern(pattern)
      return responseHelper.responseSuccess(res, 'Search users successfully', {
        list_users: listUsers,
      })
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  const updateStatusOnline = async (req: any, res: Response) => {
    const statusOnline = req.body.status_online
    try {
      await userService.updateOneStatusOnline(statusOnline, req.userId)
      return responseHelper.responseSuccess(
        res,
        'Update status online successfully',
        {
          status_online: statusOnline,
        },
      )
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  return {
    registerNewUser,
    loginAccountUser,
    logoutAccountUser,
    changeAvatar,
    getMyInfo,
    searchUsers,
    updateStatusOnline,
  }
}
