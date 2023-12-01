import UserModel from "../models/user.model";

class UserService {
  createUser(username: string) {
    return UserModel.create({ username })
  }

  getUserByUsername(username: string) {
    return UserModel.findOne({ username })
  }

  getUserById(id: string) {
    return UserModel.findById(id)
  }
}

export default new UserService()