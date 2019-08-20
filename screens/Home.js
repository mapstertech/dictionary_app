import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ImageBackground
} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';

export default class HomeScreen extends Component {
    static navigationOptions = {
        title: 'Dictionary',
    }

    constructor(props) {
        super(props);
        this.state = {
            query: ''
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
        let ditidaht = words.filter((data) => data.word.search(regex) >= 0);
        return english.concat(ditidaht);
    }

    navigateToWord = (data) => {
        this.props.navigation.navigate('WordDetail', {
            data
        })
    }

    render() {
        const { query } = this.state;
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
                        <Autocomplete
                            autoCapitalize="none"
                            autoCorrect={false}
                            containerStyle={styles.autocompleteContainer}
                            data={data.length === 1 && comp(query, data[0].word) ? [] : data}
                            defaultValue={query}
                            onChangeText={text => this.setState({ query: text })}
                            placeholder="Search for a word"
                            renderItem={({ item }) => {
                                // console.log('title', title)
                                const { word } = item
                                return (
                                    <TouchableOpacity key={word} onPress={() => this.navigateToWord(item)}>
                                        <Text style={styles.itemText}>
                                            {word}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            }}
                        />
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
        top: '40%',
        zIndex: 1,
        width: '80%'
    },
    itemText: {
        fontSize: 18,
        padding : 8,
        borderBottomWidth : 1,
        borderBottomColor : '#eee',
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
    }
});
