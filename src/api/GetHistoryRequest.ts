import Request, { Method, Headers } from './Request';
import CryptoType from '../model/CryptoType';
import Auth from './Auth';

export interface GetHistoryRequestResponse {

}

export default class GetHistoryRequest extends Request<GetHistoryRequestResponse> {

    readonly cryptoType: CryptoType;
    readonly limit: number;

    constructor(cryptoType: CryptoType, limit: number) {
        super();

        this.cryptoType = cryptoType;
        this.limit = limit;
    }
   
    get path(): string {
        return `v2/histoday?fsym=${this.cryptoType}&tsym=USD&limit=${this.limit}`;
    }
    
    get method(): Method {
        return Method.Get;
    }

    get headers(): Headers {
        return {
            'authorization': `Apikey {${Auth.APIKey}}`,
        };
    }

    get body(): object | undefined {
        throw new Error("Method not implemented.");
    }

    get processResponse(): ((json: any) => GetHistoryRequestResponse) | undefined {
        throw new Error("Method not implemented.");
    }
}
