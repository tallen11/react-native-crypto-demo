import CryptoType from './CryptoType';

export default interface CryptoData {
    readonly type: CryptoType;
    readonly name: string;
    readonly price: number;
    readonly dailyChangePercentage: number;
    readonly imagePath: string;
    readonly historicalData?: number[];
}
