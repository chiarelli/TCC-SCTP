import slugify from "slugify";
import uuidToHex from "uuid-to-hex";
import { TermService } from "..";
import { ServiceError } from "../../../error/ServiceError";
import { CollectionUtilities } from "../../CollectionUtilities";
import { EvaluateStatuses, Statuses } from "../../enums";
import { ITerm, IUser, PresentationOfCollections } from "../../interfaces";
import { UUID_Utilities } from "../../UUID_Utilities";
import { DocumentTermType, Term } from "./term-schema";

export class TermModel {

    constructor(private stubs: typeof TermService.stubs) {

    }

    async create({description, name, question}: Partial<ITerm>, userLogedin: IUser): Promise<DocumentTermType> {
        const model = new Term;
            model.uuid = Buffer.from( uuidToHex(UUID_Utilities.generateUUIDv5(model._id.toString(), undefined)), 'hex' );
            model.createdAt = new Date;
            model.updatedAt = new Date;
            model.name = name || '';
            model.description = description || '';
            model.question = question || '';
            model.slug = slugify(model.name).toLowerCase();

            model.author = typeof userLogedin.uuid === 'string'
                ? UUID_Utilities.uuidToBuffer(userLogedin.uuid)
                : userLogedin.uuid;

            return model.save();
    }

    async evaluate(uuid: string, evaluate: EvaluateStatuses): Promise<DocumentTermType> {
        return this.update(uuid, { evaluate });
    }

    async getAll(limit: number, offset: number): Promise<PresentationOfCollections<DocumentTermType>> {
        return CollectionUtilities.find(Term, { status: Statuses.active }, limit, offset);
    }

    async getOne(uuid: string): Promise<DocumentTermType> {
        const model = await Term.findOne({ uuid: UUID_Utilities.uuidToBuffer(uuid), status: Statuses.active })
        if(!model) return Promise.reject(new ServiceError("not_found", 404));
        return model;
    }

    async search(search: string, limit: number, offset: number): Promise<PresentationOfCollections<DocumentTermType>> {
        let userRegex = new RegExp( slugify( this.escapeStringRegexp( search.replaceAll('-', ' ') ) ) );

        return CollectionUtilities.findLean(Term, {
                slug: <string><unknown>userRegex,
                status: Statuses.active,
                evaluate: EvaluateStatuses.approved
            }
            , limit
            , offset
        );
    }

    async softDelete(uuid: string): Promise<void> {
        try {
            const model = await this.getOne(uuid);
            return model.update({ status: Statuses.inactive });
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async update(uuid: string, { description, name, question, evaluate }: Partial<ITerm>): Promise<DocumentTermType> {
        const model = await this.getOne(uuid);

        const args = {
            name: name || model.name,
            description: description || model.description,
            question: question || model.question,
            evaluate: evaluate || model.evaluate,
            slug: name ? slugify(name).toLowerCase() : model.slug,
        }

        const comp = new Term(Object.assign( {}, model.toObject(), args ) );
        let isEquals = true;

        Object.entries(model.toObject()).forEach(([key, value]) => {
            let obj = <any>comp.toObject();
            let data = <any>value;

            if( obj[key] != data?.toString() ) {
                isEquals = false;
                return isEquals;
            }
        });

        if( !isEquals ) await model.update({ ...args, updatedAt: new Date });

        return this.getOne(uuid);
    }

    protected escapeStringRegexp(txt: string) {
        if (typeof txt !== 'string') {
            throw new TypeError('Expected a string');
        }

        // Escape characters with special meaning either inside or outside character sets.
        // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
        return txt
            .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            .replace(/-/g, '\\x2d');
    }

}