import { Model } from "mongoose";
import { PresentationOfCollections, Sort } from "./interfaces";

export class CollectionUtilities {

    static async find(
        model: typeof Model, 
        query: { [key: string]: string|number },
        limit: number = 20, 
        offset: number = 0, 
        sort: Sort  = { createdAt: 'descending'}
            ): Promise<PresentationOfCollections<any>> {                    

        const schema = model.find(query);
        const _query = schema.toConstructor();
        limit = parseInt(limit.toString());
        offset = parseInt(offset.toString());

        const [total, items] = await Promise.all([
                schema.count().exec(),
                // @ts-ignore: Unreachable code error
                _query().limit(limit).skip(offset).sort(sort).exec()
            ]);
        return CollectionUtilities.presentationOfCollections(items, total, limit, offset);
    }

    static presentationOfCollections(
        items: any[], 
        total: number, 
        limit: number, 
        offset: number 
            ): PresentationOfCollections<any> {
        return { offset, limit, query_total: total, length: items.length, items };
    }
}