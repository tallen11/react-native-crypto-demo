import React from 'react';

import {
    View,
    ScrollView,
    StyleSheet,
    Dimensions,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';

import CryptoData from '../model/CryptoData';

import CryptoPagerItem from './CryptoPagerItem';
import CryptoPageIndicator from './CryptoPageIndicator';
import { ItemColor } from '../Types'

interface Props {
    readonly currencies: CryptoData[];
    readonly onIndexChanged: (index: number, prevIndex: number) => void;
}

interface State {
    currentIndex: number;
    // historicalDataCache: { [] };
}

export default class CryptoPager extends React.PureComponent<Props, State> {

    private static Colors: ItemColor[] = [
        { light: '#6e89cc', dark: '#5968AD' },
        { light: '#79cef2', dark: '#4fAEE7'},
        { light: '#d979c4', dark: '#c45eb8' },
        { light: '#f27979', dark: '#e0695e' },
    ];

    constructor(props: Props) {
        super(props);

        this.state = {
            currentIndex: 0,
        };
    }

    private onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
        const index = Math.max(0, Math.floor(event.nativeEvent.contentOffset.x / Dimensions.get('window').width));
        const currentIndex = this.state.currentIndex;
        this.setState({
            currentIndex: index,
        }, () => {
            this.props.onIndexChanged(index, currentIndex);
        });
    }

    render(): JSX.Element {
        return (
            <View style={Styles.container}>
                <ScrollView style={Styles.scrollView}
                    pagingEnabled={true}
                    horizontal={true}
                    snapToInterval={Dimensions.get('window').width}
                    snapToAlignment={'center'}
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={this.onScroll.bind(this)}>
                    {this.props.currencies.map((c, i) => <CryptoPagerItem
                                                                key={c.name}
                                                                currency={c}
                                                                color={CryptoPager.Colors[i]} />)}
                </ScrollView>

                <CryptoPageIndicator
                    items={this.props.currencies.map(({}, i) => CryptoPager.Colors[i])}
                    index={this.state.currentIndex} />
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    container: {
        
    },

    scrollView: {
        paddingBottom: 20,
    },
});
