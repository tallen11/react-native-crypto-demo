import React from 'react';

import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    Alert,
    Animated,
    Dimensions,
} from 'react-native';

import GetPricesRequest from './src/api/GetPricesRequest';
import CryptoType from './src/model/CryptoType';
import CryptoData from './src/model/CryptoData';

import CryptoPager from './src/components/CryptoPager';

import Fonts from './src/style/Fonts';
import { RFPercentage } from 'react-native-responsive-fontsize';

import Graph from './src/components/Graph';

const TestData = [
    {
        dailyChangePercentage: -0.10371519186238025,
        imagePath: "https://www.cryptocompare.com/media/19633/btc.png",
        name: "Bitcoin",
        price: 9313.94,
        type: "BTC",
    },
    {
        dailyChangePercentage: 0.39159654971689106,
        imagePath: "https://www.cryptocompare.com/media/20646/eth_logo.png",
        name: "Etherium",
        price: 189.71,
        type: "ETH",
    },
    {
        dailyChangePercentage: 0.89159654971689106,
        imagePath: "https://www.cryptocompare.com/media/20646/eth_logo.png",
        name: "Litecoin",
        price: 233.71,
        type: "LTC",
    },
] as CryptoData[];

interface State {
    currencyData: CryptoData[];
    currentIndex: number;

    detailOpacity: Animated.Value;
    detailYOffset: Animated.Value;

    graphTargetData: number[];
}

export default class App extends React.Component<{}, State> {

    private graphRef: any;

    constructor(props: {}) {
        super(props);

        this.graphRef = React.createRef();

        this.state = {
            currencyData: [],
            currentIndex: 0,

            detailOpacity: new Animated.Value(1.0),
            detailYOffset: new Animated.Value(0.0),

            graphTargetData: [0.9, 0.4, 0.7, 0.0, 0.5, 1.0, 0.1, 0.9, 0.4, 0.7],
        };
    }
    
    async componentDidMount() {
        const request = new GetPricesRequest([
            CryptoType.Bitcoin,
            CryptoType.Etherium,
            CryptoType.Litecoin,
            CryptoType.BitcoinCash,
        ]);
        
        try {
            const response = await request.start();
            this.setState({ currencyData: response.currencies });
            // this.setState({ currencyData: TestData });
        } catch (error) {
            Alert.alert('API Error', `${error}`, [
                { text: 'Ok' },
            ]);
        }
    }

    private onPagerIndexChanged(index: number, prevIndex: number) {
        if (index !== prevIndex) {
            this.setState({
                graphTargetData: this.state.graphTargetData.map(_ => Math.random()),
            }, () => {
                const graphAnim = this.graphRef.getAnimation();
                const detailAnims = this.getDetailAnimations(index);

                graphAnim.start();

                Animated.parallel([
                    // graphAnim,
                    ...detailAnims,
                ]).start(() => {
                    this.setState({ currentIndex: index }, () => {
                        Animated.parallel([
                            Animated.timing(this.state.detailOpacity, {
                                toValue: 1.0,
                                duration: 200,
                                useNativeDriver: true,
                            }),
                            Animated.timing(this.state.detailYOffset, {
                                toValue: 0,
                                duration: 200,
                                useNativeDriver: true,
                            }),
                        ]).start();
                    });
                });
            });
        }
    }

    private getDetailAnimations(index: number): Animated.CompositeAnimation[] {
        return [
            Animated.timing(this.state.detailOpacity, {
                toValue: 0.0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(this.state.detailYOffset, {
                toValue: 10,
                duration: 200,
                useNativeDriver: true,
            })
        ];
    }

    render(): JSX.Element {
        const dims = Dimensions.get('window');
        const currency = this.state.currencyData[this.state.currentIndex];

        return (
            <SafeAreaView style={Styles.container}>
                <Graph
                    ref={(c: any) => this.graphRef = c}
                    svgStyle={{
                        position: 'absolute',
                        top: dims.height * 0.31
                    }}
                    color={/*'#cfcfcf'*/ '#888888'}
                    width={dims.width}
                    height={dims.height * 0.3}
                    targetData={this.state.graphTargetData} />
                
                <View style={Styles.detailContainer}>
                    <Animated.View style={[Styles.detailSubcontainer, {
                        opacity: this.state.detailOpacity,
                        transform: [
                            { translateY: this.state.detailYOffset },
                        ],
                    }]}>
                        <Text style={Styles.nameText}>{currency && currency.name}</Text>
                        <Text style={Styles.priceText}>{currency ? `\$${currency.price.toFixed(2)}` : '---'}</Text>
                    </Animated.View>
                </View>

                <View style={Styles.pagerContainer}>
                    <CryptoPager
                        currencies={this.state.currencyData}
                        onIndexChanged={this.onPagerIndexChanged.bind(this)} />
                </View>
            </SafeAreaView>
        );
    }
};

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#fafaf7',
    },

    detailContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    detailSubcontainer: {

    },

    nameText: {
        fontFamily: Fonts.regular,
        fontSize: RFPercentage(3),
        color: '#ACADB5',
    },

    priceText: {
        fontFamily: Fonts.medium,
        fontSize: RFPercentage(5.5),
        color: '#5968AD',
    },

    pagerContainer: {
        width: '100%',
        justifyContent: 'flex-end',
        paddingBottom: 30,
    },
});
