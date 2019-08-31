import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ImageBackground
} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';

const ditiChars = [
  "ƛ", "ƛ̓", "ʔ", "ʕ", "b̓", "c̓", "č", "č̓", "d̓", "kʷ", "k̓",
  "k̓ʷ","l̓","ł","m̓","n̓","p̓","qʷ","q̓","q̓ʷ","š","t̓","w̓","xʷ",
  "x̣","x̣ʷ","y̓","–"
]

export default class HomeScreen extends Component {
    static navigationOptions = {
        title: 'Dictionary',
    }

    constructor(props) {
        super(props);
        this.state = {
            query: '',
        };
    }

    filterData(query) {
        if (query === '') {
            return [];
        }

        const { words } = this.props.screenProps;
        const regex = new RegExp(`${query.trim()}`, 'i');
        //return words.filter((data) => data.word.search(regex) >= 0);

        let english  = words.filter((data) => data.meaning.search(regex) >= 0);
        english = english.sort((data) => data.meaning === query ? -1 : 1);
        let ditidaht = words.filter((data) => data.word.search(regex) >= 0);
        ditidaht = ditidaht.sort((data) => data.word === query ? -1 : 1);
        return english.concat(ditidaht);
    }

    navigateToWord = (data) => {
        this.props.navigation.navigate('WordDetail', {
            data
        })
    }

    englishPreview(meaning) {

        // crop by character count
        /*
        if (meaning.length < 24) {
            return meaning;
        } else {
            return meaning.slice(0, 24) + '...';
        }
        */

        // crop by word count
        let arr = meaning.split(' ');
        let ellipsis = arr.length > 5 ? '...' : '';
        arr.length = 5;
        let newStr = arr.join(' ');
        return newStr + ellipsis;
    }

    render() {
        const { query, showKeyboard } = this.state;
        const data = this.filterData(query);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
        return (
            <View style={styles.container}>
                  <ImageBackground
                      source={require('../assets/images/nitinaht-lake-min.png')}
                      style={{ height: '100%', width: '100%', backgroundColor: '#525D7E' }}
                  >
                      {this.props.screenProps.fetching ?
                        <View style={styles.fetchingContainer}>
                          <Text style={styles.fetchingText}>Loading Words...</Text>
                        </View>
                      :
                        <View style={{ height: '100%' }}>
                           { showKeyboard ?
                               <View style={styles.keyboard}>
                                   {ditiChars.map(letter => {
                                        return (
                                            <Text
                                                style={styles.keyboardKey}
                                                onPress={() => this.setState({ query : query + letter })}
                                                key={letter}
                                            >
                                                {letter}
                                            </Text>
                                        )
                                   })}
                               </View>
                           : null }

                                <Autocomplete
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    containerStyle={styles.autocompleteContainer}
                                    data={data.length === 1 && comp(query, data[0].word) ? [] : data}
                                    onFocus={() => this.setState({ showKeyboard : true })}  defaultValue={query}
                                    onChangeText={text => this.setState({ query: text })}
                                    placeholder="Search for a word"
                                    keyExtractor={(item, index) => item.id.toString()}
                                    listStyle={{maxHeight: 200}}
                                    renderItem={({ item }) => {
                                        // console.log('title', title)
                                        const { word, meaning } = item
                                        return (
                                            <TouchableOpacity
                                                onPress={() => this.navigateToWord(item)}
                                                style={styles.itemText}
                                            >
                                                <Text style={{ maxWidth : '65%', fontSize : 18 }}>
                                                    {word}
                                                </Text>
                                                <Text style={styles.meaningText}>
                                                    {this.englishPreview(meaning)}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                        </View>
                      }
                  </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
        flex: 1,
    },
    fetchingContainer : {
        flex: 1,
        left: '10%',
        position: 'absolute',
        right: 0,
        top: '20%',
        zIndex: 1,
        width: '80%'
    },
    fetchingText : {
      color:'white',
      fontSize:20,
      textAlign:'center'
    },
    autocompleteContainer: {
        flex: 1,
        left: '10%',
        position: 'absolute',
        right: 0,
        top: '30%',
        //top: '10%',
        zIndex: 1,
        width: '80%'
    },
    itemText: {
        padding : 8,
        borderBottomWidth : 1,
        borderBottomColor : '#eee',
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-between',
    },
    descriptionContainer: {
        // `backgroundColor` needs to be set otherwise the
        // autocomplete input will disappear on text input.
        backgroundColor: '#F5FCFF',
        marginTop: 25
    },
    infoText: {
        textAlign: 'center'
    },
    titleText: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 10,
        marginTop: 10,
        textAlign: 'center'
    },
    directorText: {
        color: 'grey',
        fontSize: 12,
        marginBottom: 10,
        textAlign: 'center'
    },
    openingText: {
        textAlign: 'center'
    },
    meaningText : {
        fontSize : 14,
        color : '#aaa',
        marginLeft : 10,
        flexWrap : 'wrap',
        maxWidth : '100%',
        flex : 1,
        textAlign : 'right'

    },
    keyboard : {
        backgroundColor : "rgba(255,255,255,0.5)",
        left: '10%',
        position: 'absolute',
        right: 0,
        top: '2%',
        zIndex: 1,
        width: '80%',
        flexWrap : 'wrap',
        flexDirection : 'row',
        padding : 2,
        borderRadius : 2
    },
    keyboardKey : {
        backgroundColor : "rgba(255,255,255,0.8)",
        margin : 2,
        paddingHorizontal : 10,
        paddingVertical : 3,
        minWidth : '15%',
        fontSize : 17,
        flexGrow : 1,
        borderRadius : 2,
        textAlign : 'center'
    }
});
