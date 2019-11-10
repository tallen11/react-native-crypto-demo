import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    Animated,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import { RFPercentage } from 'react-native-responsive-fontsize';
import { ItemColor } from '../Types'
import CryptoData from '../model/CryptoData';

import Graph from './Graph';

import Fonts from '../style/Fonts';

interface Props {
    readonly currency: CryptoData;
    readonly color: ItemColor;
}

interface State {
    graphTargetData: number[];
}

export default class CryptoPagerItem extends React.PureComponent<Props, State> {

    static widthPercentage = 0.85;

    constructor(props: Props) {
        super(props);

        this.state = {
            graphTargetData: [0.9, 0.4, 0.7, 0.0, 0.5, 1.0, 0.1],
        };
    }

    private formatUSD(amount: number): string {
        return `\$ ${amount.toFixed(2)}`;
    }

    private formatChangePercentage(change: number): string {
        const sign = change < 0.0 ? '-' : '+';
        return `${sign}${Math.abs(change*100.0).toFixed(1)} %`;
    }

    render(): JSX.Element {
        return (
            <View style={Styles.container}>
                <View style={Styles.gradientContainer}>
                    <LinearGradient
                        colors={[this.props.color.dark, this.props.color.light]}
                        style={Styles.innerContainer}>
                        <View style={Styles.mainContainer}>
                            <View style={Styles.headerContainer}>
                                <View style={Styles.logoContainer}>
                                    <Image style={Styles.logo}
                                        source={{ uri: this.props.currency.imagePath }}
                                        resizeMode={'contain'} />
                                </View>

                                <View style={Styles.rightHeaderContainer}>
                                    <Text style={Styles.changePercentageText}>{this.formatChangePercentage(this.props.currency.dailyChangePercentage)}</Text>
                                    <Text style={Styles.todayText}>{'today'}</Text>
                                </View>
                            </View>

                            <Text style={Styles.nameText}>{this.props.currency.name}</Text>
                            <Text style={Styles.priceText}>{this.formatUSD(this.props.currency.price)}</Text>
                        </View>

                        <View style={Styles.graphContainer}>
                            <Graph
                                color={'white'}
                                width={Dimensions.get('window').width * CryptoPagerItem.widthPercentage}
                                height={95.0}
                                targetData={this.state.graphTargetData} />
                        </View>
                    </LinearGradient>
                </View>
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: 240,
        padding: 15,
    },

    gradientContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 8.0,
    },

    innerContainer: {
        width: Dimensions.get('window').width * CryptoPagerItem.widthPercentage,
        height: '100%',
        borderRadius: 20.0,
    },

    mainContainer: {
        padding: 20,
    },

    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    logoContainer: {
        width: 45,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 22.5,
        backgroundColor: 'rgba(0,0,0,0.25)',
    },

    logo: {
        width: 45.0 * 0.85,
        height: 45.0 * 0.85,
        borderRadius: 45.0 * 0.85 * 0.5,
    },

    rightHeaderContainer: {
        alignItems: 'flex-end',
    },

    changePercentageText: {
        fontFamily: Fonts.medium,
        fontSize: RFPercentage(2.3),
        color: 'white',
    },

    todayText: {
        fontFamily: Fonts.regular,
        fontSize: RFPercentage(1.8),
        color: 'rgba(0,0,0,0.3)',
    },

    nameText: {
        paddingTop: 10,
        fontFamily: Fonts.semiBold,
        fontSize: RFPercentage(2.8),
        color: 'white',
    },

    priceText: {
        fontFamily: Fonts.medium,
        fontSize: RFPercentage(2.3),
        color: 'rgba(0,0,0,0.3)',
    },

    graphContainer: {
        flex: 1,
    },
});
