import hexToUuid from 'hex-to-uuid';
import uuidToHex from 'uuid-to-hex';
import { v5 as uuidv5 } from 'uuid';

export class UUID_Utilities {

    static generateUUIDv5(name: string, namespace: string | undefined): string {
        var uuid = uuidv5( name, <string>process.env.UUID_NAMESPACE );
        if( namespace ) uuid = uuidv5( uuid, namespace );
        return uuid;
    };

    static uuidToBuffer(uuid: string): Buffer {
        try {
            const formatted = UUID_Utilities.formatUUID(uuid);
            if(formatted === false) throw new Error('');

            return Buffer.from( uuidToHex( formatted ), 'hex');
        } catch (e) {
            return Buffer.from('');
        }
    }

    static formatUUID(str: string): string|false {
        str = str.replace(/-/g, '');
        try {
            return hexToUuid(str);
        } catch(e) {
            return false;
        }
    }

}