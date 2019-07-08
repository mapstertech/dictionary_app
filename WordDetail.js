import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Audio } from 'expo-av'

export default class WordDetailScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        const toSentenceCase = (str) => {
            return str[0].toUpperCase() + str.slice(1)
        }
        return {
            title: navigation.getParam('data') ? toSentenceCase(navigation.getParam('data').word) : 'Word',
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            word: this.props.navigation.getParam('data'),
            sound: null
        };
    }

    async componentDidMount() {
        try {
            const soundObject = new Audio.Sound();
            const sound = await soundObject.loadAsync(require('./assets/marbles-daniel_simon.mp3'))
            this.setState({ sound })
        } catch (error) {
            console.log(error)
        }
    }

    playAudio = async () => {
        // load and play audio
        if (this.state.sound) {
            await this.state.sound.playAsync()
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.word ?
                    <ImageBackground
                        source={{ uri: this.state.word.images }}
                        style={{ height: '100%', width: '100%' }}
                    >
                        {Object.keys(this.state.word).map((key) => {
                            return (
                                <Text key={key}>
                                    {key} -- {this.state.word[key]}
                                </Text>
                            )
                        })}
                        <TouchableOpacity onPress={this.playAudio}>
                            <View style={{
                                position: 'absolute',
                                top: '50%',
                                left: '20%',
                                backgroundColor: 'white',
                                width: 50,
                                height: 50,
                            }}>
                                <Text style={{ fontSize: 30 }}>Play Audio</Text>
                            </View>
                        </TouchableOpacity>
                    </ImageBackground>
                    : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    },
});
