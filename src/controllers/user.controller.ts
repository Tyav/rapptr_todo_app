import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { UserDto } from '../interfaces/user.interface';
import userService from '../services/user.service';
import { Conflict, ResourceNotFound } from '../services/error.service';
import tokenService from '../services/token.service';

class UserController {
  registerUser = catchAsync(async (req: Request, res: Response) => {
    const { username } = req.body as UserDto;

    // check if username exist
    const userTaken = await userService.getUserByUsername(username);

    if (userTaken) {
      return Promise.reject(
        new Conflict({
          message: 'Username is taken',
          data: {
            username,
          },
        })
      );
    }

    await userService.createUser(username);

    res.status(201).json({
      message: 'User created successfully',
    });
  });

  loginUser = catchAsync(async (req: Request, res: Response) => {
    const { username } = req.body as UserDto;

    // check if username exist
    const user = await userService.getUserByUsername(username);

    if (!user) {
      return Promise.reject(
        new ResourceNotFound({
          message: 'User does not exist',
          data: {
            username,
          },
        })
      );
    }

    // generate token
    const token = await tokenService.generateToken(user.id);

    // return data
    res
      // this option can be used if you need to store token in cookie. you will also consider the passport strategy used
      //.cookie('token', token, config.jwt.cookieOptions)
      .status(200).json({
      message: 'User logged in successfully',
      data: {
        user,
        token,
      },
    });
  });
}

export default new UserController();
