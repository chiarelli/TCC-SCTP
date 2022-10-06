import { Document } from "mongoose";
import { IUser } from "../interfaces";

export type AbsDoc<T> = Document<unknown, any, T> & T & IUser;