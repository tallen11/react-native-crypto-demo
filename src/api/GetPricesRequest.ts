import Request, { Method, Headers } from './Request';
import CryptoType from '../model/CryptoType';
import CryptoData from '../model/CryptoData';
import Auth from './Auth';

const CryptoNames = {
    [CryptoType.Bitcoin]: 'Bitcoin',
    [CryptoType.Etherium]: 'Etherium',
    [CryptoType.Litecoin]: 'Litecoin',
    [CryptoType.BitcoinCash]: 'Bitcoin Cash',
};

export interface GetPricesResponse {
    readonly currencies: CryptoData[];
}

export default class GetPricesRequest extends Request<GetPricesResponse> {

    readonly cryptoTypes: CryptoType[];

    constructor(cryptoTypes: CryptoType[]) {
        super();

        this.cryptoTypes = cryptoTypes;
    }

    get path(): string {
        return `pricemultifull?fsyms=${this.cryptoTypes.join(',')}&tsyms=USD&extraParams=CryptoDemoApp`;
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

    get processResponse(): ((json: any) => GetPricesResponse) | undefined {
        return (json: any): GetPricesResponse => {
            const data = this.cryptoTypes.map((ct): CryptoData => {
                const usd = json['RAW'][ct]['USD'];
                return {
                    type: ct,
                    name: CryptoNames[ct],
                    price: usd['PRICE'],
                    dailyChangePercentage: usd['CHANGEPCTDAY'],
                    imagePath: `https://www.cryptocompare.com${usd['IMAGEURL']}`,
                    historicalData: undefined,
                };
            });


            return { currencies: data };
        }
    }
}
