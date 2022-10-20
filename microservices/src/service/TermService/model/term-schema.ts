import { Document, model, Schema } from "mongoose";
import { AbstractShema } from "../../AbstractShema";
import { EvaluateStatuses, Statuses } from "../../enums";
import { ITerm } from "../../interfaces";

export const TermSchema = new Schema<ITerm>({
    ...AbstractShema.obj,
    author: { type: Buffer, required: true },
    slug: { type: String, unique: true, lowercase: true, trim: true, maxLength: 100 },
    name: { type: String, trim: true, maxLength: 100 },
    question: { type: String, trim: true, maxLength: 100 },
    description: { type: String, trim: true, maxLength: 600 },
    evaluate: { type: String, enum: Object.values(EvaluateStatuses), default: EvaluateStatuses.none },
    status: { type: String, required: true, enum: Object.values(Statuses), default: Statuses.active },
});

export const Term = model<ITerm>('Term', TermSchema);

export type DocumentTermType = Document<unknown, any, ITerm> & ITerm;