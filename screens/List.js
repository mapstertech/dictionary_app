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
        title: 'Dictionary',
    }

    constructor(props) {
        super(props);
        this.filterWords = this.filterWords.bind(this);
        this.state = {
            words: false,
            categories: false,
            currentCategories : 'All'
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
        this.setState({ words, currentCategories : category });
    }

    render() {
        const { words, categories, currentCategories } = this.state;
        
        let sortedWords = words ? words.sort((a,b) => (a.word> b.word) ? 1 : ((b.word> a.word) ? -1 : 0)) : [];

        return (
            <View style={styles.container}>
                <View style={styles.filters}>
                    <Text style={styles.cats}>
                       {currentCategories} Words
                    </Text>
                    <TouchableOpacity 
                        onPress={() => this.props.navigation.navigate('Filters', { categories, filterWords : this.filterWords.bind(this) })}
                        style={styles.filterButton}
                    >
                        <Text style={styles.filterButtonText}>
                           Filters 
                        </Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>

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
    filters : {
        backgroundColor : '#333',
        padding : 10,
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
        color : '#fff'
    },
    cats : {
        color : '#fff',
        fontWeight : 'bold',
        textTransform : 'capitalize'
    },
    filterButton : {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        margin : 5,
        borderRadius : 2,
        height : 50,
        textAlign : 'center',
        width : 70,
        zIndex : 2,
        color : '#000'
    },
    filterButtonText : {
        fontWeight : 'bold',
        fontSize : 14 ,
        color : '#000'
    },
    itemText : {
        padding : 12,
        color : '#000',
        fontSize : 15,
        textTransform : 'uppercase',
        borderBottomColor : '#eee',
        borderBottomWidth : 1
    }
});
