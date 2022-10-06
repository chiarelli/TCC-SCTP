/**
 * Classe de Error genérica para todos os microserviços, preferencialmente, após a borda.
 */
export class ServiceError extends Error {
    private code: number;
    private previous?: Error;

    constructor(message: string, code: number = 500, previous?: Error) {
        super(message);
        this.code = code;
        this.previous = previous;
    }

}