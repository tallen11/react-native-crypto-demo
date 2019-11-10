import Request, { Method, Headers } from './Request';
import CryptoType from '../model/CryptoType';
import Auth from './Auth';

export enum TimeBreakdown {
    Daily = 'histoday',
    Hourly = 'histohour',
    Minute = 'histominute',
}

export interface GetHistoryRequestResponse {
    data: number[];
}

export default class GetHistoryRequest extends Request<GetHistoryRequestResponse> {

    readonly cryptoType: CryptoType;
    readonly breakdown: TimeBreakdown;
    readonly limit: number;

    constructor(cryptoType: CryptoType, breakdown: TimeBreakdown, limit: number) {
        super();

        this.cryptoType = cryptoType;
        this.breakdown = breakdown;
        this.limit = limit;
    }
   
    get path(): string {
        return `v2/${this.breakdown}?fsym=${this.cryptoType}&tsym=USD&limit=${this.limit}`;
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
        return undefined;
    }

    get processResponse(): ((json: any) => GetHistoryRequestResponse) | undefined {
        return (json: any): GetHistoryRequestResponse => {
            const rawData: number[] = json['Data']['Data']
                                        .sort((a: any, b: any) => a['time'] - b['time'])
                                        .map((obj: any) => obj['close']);
            const min = Math.min(...rawData);
            const max = Math.max(...rawData);
            return {
                data: rawData.map(v => (v - min) / (max - min)),
            };
        };
    }
}
