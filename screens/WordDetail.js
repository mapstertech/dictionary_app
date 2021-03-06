import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
            word: this.props.navigation.getParam('data')
            //sound: null
        };
    }

    async componentDidMount() {
        /* Depr
        try {
            const sound = new Audio.Sound();
            await sound.loadAsync(require('../assets/marbles-daniel_simon.mp3'))
            this.setState({ sound })
        } catch (error) {
            console.log(error)
        };
        */
    }

    playAudio = async () => {
        // load and play audio
        // const sound = new Audio.Sound()
        // await sound.unloadAsync()
        // await sound.loadAsync(require('../assets/marbles-daniel_simon.mp3'))
        // await sound.playAsync()
    }

    render() {
        const { word } = this.state;
        return (
            <View style={styles.container}>
                {this.state.word ?
                    <View style={{ alignSelf : 'stretch' }}>
                        <View style={{ alignItems : 'center', marginVertical : 10 }}>
                            <Text style={styles.word}>
                                {word.word}
                            </Text>
                            <Text style={styles.meaning}>
                                {word.meaning}
                            </Text>
                        </View>

                        { word.images ?
                            <Image
                                source={{ uri: word.images }}
                                style={{ height: 200, width: 'auto', margin : 20, borderWidth : 1  }}
                            />
                        : null }

                        <View style={{ alignItems : 'center', marginVertical : 10 }}>
                            <Text style={styles.grammar}>
                                {word.grammar}
                            </Text>
                        </View>

                        {/*
                        {Object.keys(word).map((key) => {
                            return (
                                <Text key={key}>
                                    {key} -- {word[key]}
                                </Text>
                            )
                        })}
                        */}

                        <View style={{ position : 'absolute' , top : 10, right : 0 }}>
                            <TouchableOpacity onPress={this.playAudio}>
                                <Ionicons
                                  name={
                                    Platform.OS === 'ios'
                                      ? 'ios-volume-high'
                                      : 'md-volume-high'
                                  }
                                  size={36}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        flex: 1,
        alignItems: 'center',
        zIndex: 1000,
        marginHorizontal : 10
    },
    word : {
        fontSize : 24,
        fontWeight : 'bold',
        marginHorizontal : 20
    },
    meaning : {
        fontStyle : 'italic',
        fontSize : 18,
        color : '#444',
        marginTop : 10
    },
    grammar : {
        textTransform : 'capitalize',
        fontSize : 14,
        color : '#000'
    }
});
