import { Document } from "mongoose";
import { IUser } from "./model/user-schema";

export type AbsDoc<T> = Document<unknown, any, T> & T & IUser;