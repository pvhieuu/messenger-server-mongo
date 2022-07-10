import { ICreateUserDto } from '../interfaces'
import { ICradle } from '../container'
import moment from 'moment'

export const userService = ({ models }: ICradle) => {
  const { users } = models

  const findOneByPhoneNum = async (phone_number: string) =>
    await users.findOne({ phone_number })

  const findOneByEmail = async (email: string) => await users.findOne({ email })

  const createOne = async (createUserDto: ICreateUserDto) =>
    await users.create(createUserDto)

  const updateOneStatusOnline = async (
    status_online: boolean,
    user_id: string,
  ) =>
    await users.findOneAndUpdate(
      { _id: user_id },
      { status_online },
      { new: true },
    )

  const updateOneLastLogout = async (user_id: string) =>
    await users.findOneAndUpdate(
      { _id: user_id },
      { last_logout: moment() },
      { new: true },
    )

  const updateOneAvatar = async (new_avatar: string, user_id: string) =>
    await users.findOneAndUpdate(
      { _id: user_id },
      { avatar: new_avatar },
      { new: true },
    )

  const findOneById = async (user_id: string) =>
    await users.findOne(
      { _id: user_id },
      {
        phone_number: false,
        email: false,
        password: false,
        createdAt: false,
        updatedAt: false,
      },
    )

  const findByPattern = async (pattern: string) =>
    await users.find(
      {
        $or: [
          { phone_number: { $regex: pattern } },
          { email: { $regex: pattern } },
          { fresh_name: { $regex: pattern } },
        ],
      },
      {
        phone_number: false,
        email: false,
        password: false,
        createdAt: false,
        updatedAt: false,
      },
    )

  const findByIds = async (user_ids: string[]) =>
    await users.find(
      { _id: { $in: user_ids } },
      {
        phone_number: false,
        email: false,
        password: false,
        createdAt: false,
        updatedAt: false,
      },
    )

  return {
    findOneByPhoneNum,
    findOneByEmail,
    createOne,
    updateOneStatusOnline,
    updateOneLastLogout,
    updateOneAvatar,
    findOneById,
    findByPattern,
    findByIds,
  }
}
