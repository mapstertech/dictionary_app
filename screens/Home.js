import React, { Component } from 'react';
import { Platform } from 'react-native';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    ImageBackground,
    Animated,
    Keyboard,
    Dimensions
} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { Ionicons } from '@expo/vector-icons';

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
        this.screenHeight = Dimensions.get('window').height;
        this.screenWidth = Dimensions.get('window').width;
        this.keyboardPosY = new Animated.Value(this.screenHeight);
        this.state = {
            query: '',
            //showKeyboard : true,
            currentPos : 0
        };
    }

    componentDidMount() {
        this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow);
        this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide);
    }

    componentWillUnmount() {
        this.keyboardWillShowSub.remove();
        this.keyboardWillHideSub.remove();
    }

    keyboardWillShow = (event) => {

        const keyboardHeight = event.endCoordinates.height;
        const offSet = Platform.OS === 'ios' ? -70 : -88;
        /*
        console.log(screenHeight, ' screen height', Platform.OS);
        console.log(keyboardHeight, ' leyboard height', Platform.OS);
        */

        Animated.timing(this.keyboardPosY, {
            duration: event.duration,
            toValue: this.screenHeight - keyboardHeight + offSet,
        }).start();
    };

    keyboardWillHide = (event) => {
        Animated.timing(this.keyboardPosY, {
            //duration: event.duration,
            duration : 200,
            toValue: this.screenHeight,
        }).start();
    };

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

    scrollMiniKeyboard(direction) {
        let { currentPos } = this.state;
        if (direction === 'back' && currentPos < 1 || direction === 'forward' && currentPos > (ditiChars.length * 40 - 80)) {
            return
        } else {
            let newPos = direction === 'forward' ? (currentPos + this.screenWidth - 80) : (currentPos - this.screenWidth + 80);
            this.scroll.scrollTo({ x : newPos});
            this.setState({ currentPos : newPos });
        }
    }

    render() {
        const { query, showKeyboard } = this.state;
        const data = this.filterData(query);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

        //console.log(this.keyboardPosY)
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
                        <Animated.View style={{ height: this.keyboardPosY, justifyContent : 'flex-end' }}>
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
                                
                           { showKeyboard ?
                               <View style={[styles.keyboardWrap]}>
                                   <Ionicons
                                      name={
                                        Platform.OS === 'ios'
                                          ? 'ios-arrow-back'
                                          : 'md-arrow-dropleft'
                                      }
                                      size={26}
                                      style={styles.arrowIcon}
                                      onPress={() => this.scrollMiniKeyboard('back')}
                                   />

                                   <ScrollView 
                                    horizontal 
                                    keyboardShouldPersistTaps="always" 
                                    style={styles.keyboard}
                                    onScroll={(event) => this.setState({ currentPos : event.nativeEvent.contentOffset.x })}
                                    scrollEventThrottle={0}
                                    ref={(node) => this.scroll = node}
                                   >
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
                                   </ScrollView>

                                   <Ionicons
                                      name={
                                        Platform.OS === 'ios'
                                          ? 'ios-arrow-forward'
                                          : 'md-arrow-dropright'
                                      }
                                      size={26}
                                      style={styles.arrowIcon}
                                      onPress={() => this.scrollMiniKeyboard('forward')}
                                   />

                               </View>
                           : null }

                        </Animated.View>
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
        top: 20,
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
    keyboardWrap : {
        position : 'absolute',
        overflow : 'hidden',
        //left: '10%',
        width : '100%',
        //right : 0,
        //top: '2%',
        bottom : 0,
        flex : 1,
        flexDirection : 'row',
        flexWrap : 'nowrap',
        //maxHeight : 40,
        //height : 40
        backgroundColor : "rgba(255,255,255,0.5)",
    },
    keyboard : {
        overflow : 'visible',
        width : '100%',
        paddingRight : 200,
        //left: '10%',
        //top: '2%',
        //zIndex: 1,
        //maxWidth : '100%',
        //width: '100%',
        //flexWrap : 'wrap',
        //justifyContent : 'center',
        //flexDirection : 'row',
        //padding : 2,
        //flex : 1,
        //borderRadius : 2,
    },
    keyboardKey : {
        backgroundColor : "rgba(240,240,240,1)",
        margin : 2,
        paddingHorizontal : 12,
        paddingVertical : 5,
        minWidth : '15%',
        flexDirection : 'row',
        flexWrap : 'nowrap',
        width : 45,
        height : 40,
        fontSize : 20,
        flexGrow : 1,
        borderRadius : 2,
        textAlign : 'center'
    },
    arrowIcon : {
        width : 40,
        height : '100%',
        alignSelf : 'center',
        paddingTop : 7,
        borderRadius : 2,
        borderWidth : 0.5,
        borderColor : '#ccc',
        textAlign : 'center',
        opacity : 1,
        zIndex : 2,
        backgroundColor : '#fff'
    }
});
