import React from 'react';

import { Animated, Alert, View, Easing } from 'react-native';

import Svg, {
    Defs,
    Stop,
    Path,
    LinearGradient,
} from 'react-native-svg';

interface Props {
    readonly svgStyle?: object;
    readonly color: string;
    readonly width: number;
    readonly height: number;
    readonly targetData: number[];
}

interface State {
    curve: Animated.Value;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default class Graph extends React.Component<Props, State> {

    private pathRef: any;
    private data: number[];

    constructor(props: Props) {
        super(props);

        this.pathRef = React.createRef();
        this.data = this.props.targetData.map(d => d);

        this.state = {
            curve: new Animated.Value(0.0),
        };
    }

    componentDidMount() {
        this.state.curve.addListener(({ value }) => {
            this.pathRef.setNativeProps({ d: this.generatePath(value) });
        });
    }

    componentWillUnmount() {
        this.state.curve.removeAllListeners();
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.targetData !== this.props.targetData) {
            this.data = prevProps.targetData;
            this.state.curve.setValue(0.0);
        }
    }

    getAnimation(): Animated.CompositeAnimation {
        return Animated.timing(this.state.curve, {
            toValue: 1.0,
            duration: 500.0,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        });
    }

    private generatePath(value: number): string {
        const s = this.props.width / (this.data.length - 1);
        const path = this.data.map((val, i) => {
            const y = (1.0 - (val + value * (this.props.targetData[i] - val))) * (this.props.height / 2.0) + (this.props.height / 20.0);
            if (i == 0) {
                return `L0 ${y}`;
            } else {
                return `S${s*i-s/2} ${y} ${s*i} ${y}`;
            }
        }).join(' ');

        return `M0 ${this.props.height} ${path} L${this.props.width} ${this.props.height}`;
    }

    render(): JSX.Element {
        return (
            <Svg style={this.props.svgStyle}
                x={0}
                y={0}
                width={this.props.width}
                height={this.props.height}>
                <Defs>
                    <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="60%">
                        <Stop offset="0" stopColor={this.props.color} stopOpacity="0.2" />
                        <Stop offset="1" stopColor={this.props.color} stopOpacity="0" />
                    </LinearGradient>
                </Defs>
                <AnimatedPath
                    ref={(c: any) => this.pathRef = c}
                    d={this.generatePath(0.0)}
                    fill={'url(#grad)'}
                    stroke={'transparent'}
                    strokeWidth={0} />
                </Svg>
        );
    }
}
