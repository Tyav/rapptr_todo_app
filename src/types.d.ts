import { IUserDoc } from "./interfaces/user.interface";

declare global {
    namespace Express {
        interface Request {
            authUser : IUserDoc
        }
    }
}