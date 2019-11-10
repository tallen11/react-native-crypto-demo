import React from 'react';

import {
    View,
    StyleSheet,
} from 'react-native';

import { ItemColor } from '../Types'

interface ItemProps {
    readonly color: string;
}

class PageIndicatorItem extends React.PureComponent<ItemProps> {

    render(): JSX.Element {
        return (
            <View style={[ItemStyles.container, {
                backgroundColor: this.props.color,
             }]} />
        );
    }
}

interface Props {
    readonly items: ItemColor[];
    readonly index: number;
}

export default class CryptoPageIndicator extends React.Component<Props> {

    render(): JSX.Element {
        return (
            <View style={Styles.container}>
                {this.props.items.map((col, i) => <PageIndicatorItem
                                                        key={i}
                                                        color={i === this.props.index ? col.dark : '#E4E5E9'} />)}
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    container: {
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'red',
    },
});

const ItemStyles = StyleSheet.create({
    container: {
        width: 15,
        height: 6,
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 3,
        backgroundColor: 'red',
    },
});
