import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class List extends Component {
    static navigationOptions = {
        title: 'All Words',
    }

    constructor(props) {
        super(props);
        this.filterWords = this.filterWords.bind(this);
        this.state = {
            words: false,
            categories: false
        };
    }

    async componentDidMount() {
        const data = require('../assets/rubys-sample-data.json')
        let categories = ['All'];
        data.map(item => {
            if (categories.indexOf(item.grammar) === -1) {
                categories.push(item.grammar);
            }
        })
        this.setState({ 
            words : data,
            originalWords : JSON.parse(JSON.stringify(data)),
            categories
        })
    }

    navigateToWord = (data) => {
        this.props.navigation.navigate('WordDetail', {
            data
        })
    }

    filterWords = (category) => {
        const { originalWords } = this.state;
        let words = category === 'All' ? originalWords : originalWords.filter(word => word.grammar === category);
        this.setState({ words });
    }

    render() {
        const { words, categories } = this.state;
        
        let sortedWords = words ? words.sort((a,b) => (a.word> b.word) ? 1 : ((b.word> a.word) ? -1 : 0)) : [];

        return (
            <View style={styles.container}>
                <ScrollView>
                    <TouchableOpacity 
                        onPress={() => this.props.navigation.navigate('Filters', { categories, filterWords : this.filterWords.bind(this) })}
                        style={styles.filterButton}
                    >
                        <Text style={styles.filterButtonText}>
                           Filters 
                        </Text>
                    </TouchableOpacity>

                    { sortedWords.map(word => {
                        return (
                            <TouchableOpacity key={word.word} onPress={() => this.navigateToWord(word)}>
                                <Text style={styles.itemText}>
                                    {word.word}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        backgroundColor: '#fff',
        flex: 1,
        zIndex: 1000
    },
    filterButton : {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ccc',
        margin : 5,
        borderRadius : 2,
        height : 80,
        textAlign : 'center',
        width : 100,
        zIndex : 2,
        color : '#000'
    },
    filterButtonText : {
        fontWeight : 'bold',
        fontSize : 14 ,
        color : '#000'
    },
    itemText : {
        padding : 6,
        color : '#000',
        fontSize : 20,
        textTransform : 'capitalize'
    }
});
