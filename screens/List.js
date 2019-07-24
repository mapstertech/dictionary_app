import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Animated
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class List extends Component {
    static navigationOptions = {
        title: 'Dictionary',
    }

    constructor(props) {
        super(props);
        this.state = {
            words: false,
            categories: false,
            currentCategories : 'All',
            animateFilterPanel : new Animated.Value(-300)
        }
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

    toggleFilterPanel() {
        let toValue = this.state.filtersOpen ? -300 : 0;

        Animated.timing(
            this.state.animateFilterPanel,
            {
                toValue : toValue,
                duration : 500 
            }
        ).start();

        this.setState({ filtersOpen : !this.state.filtersOpen });
    }

    render() {
        const { words, categories, currentCategories, animateFilterPanel } = this.state;
        
        let sortedWords = words ? words.sort((a,b) => (a.word> b.word) ? 1 : ((b.word> a.word) ? -1 : 0)) : [];

        return (
            <View style={styles.container}>
                <View style={styles.filterPreview}>
                    <Text style={{ color : '#fff', fontWeight : 'bold', textTransform : 'capitalize'}}>
                       {currentCategories} Words
                    </Text>
                    <TouchableOpacity 
                        onPress={() => this.toggleFilterPanel()}
                        style={styles.closeButton}
                    >
                        <Text style={styles.closeButtonText}>
                          Categories 
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

                <Animated.View style={[styles.filterPanel, { top : animateFilterPanel } ]}>
                    <View style={{ margin : 15 }}>
                        <Text style={styles.filterLabel}>
                            Grammar
                        </Text>
                        <View style={{ flexDirection : 'row' }}>
                            { categories && categories.map(cat=> {
                                return (
                                    <TouchableOpacity 
                                        onPress={() => this.filterWords(cat)}
                                        key={cat} 
                                        style={[styles.filterButton, currentCategories === cat ? styles.activeButton : null ]}
                                    >
                                        <Text style={[ styles.filterButtonText, currentCategories === cat ? styles.activeText : null ]}>
                                            {cat}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => this.toggleFilterPanel()} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>
                           Done 
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
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
    filterPreview : {
        backgroundColor : '#000',
        padding : 10,
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
        color : '#fff'
    },
    /*
    filterButton : {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        margin : 5,
        borderRadius : 2,
        height : 50,
        textAlign : 'center',
        zIndex : 2,
        paddingHorizontal : 10,
        color : '#000'
    },
    filterButtonText : {
        fontWeight : 'bold',
        fontSize : 14 ,
        color : '#000'
    },
    */
    itemText : {
        padding : 12,
        color : '#000',
        fontSize : 15,
        textTransform : 'uppercase',
        borderBottomColor : '#eee',
        borderBottomWidth : 1
    },
    filterPanel : {
        justifyContent : 'space-between',
        position : 'absolute',
        left : 0,
        right : 0,
        height : 300,
        backgroundColor : '#000',
        opacity : 0.95,
    },
    filterLabel : {
        textTransform : 'uppercase',
        padding : 5,
        fontWeight : 'bold',
        color : '#fff'
    },
    filterButton : {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#fff',
        borderWidth : 1,
        margin : 5,
        padding : 10,
        borderRadius : 2,
        textAlign : 'center',
    },
    activeButton : {
        backgroundColor : '#222',
    },
    filterButtonText : {
        textTransform : 'capitalize',
        color : '#fff'
    },
    activeText: {
        color : '#fff',
    },
    closeButton : {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#222',
        margin : 15,
        borderRadius : 2,
        textAlign : 'center',
        padding : 14,
        width : 120
    },
    closeButtonText : {
        fontWeight : 'bold',
        color : '#fff'
    }
});
