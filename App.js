import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View, AsyncStorage, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppNavigator from './navigation/AppNavigator';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : true,
      fetching : false,
      words : []
    }
  }

  componentDidMount() {
    this._loadInitialState().done();
  }

  _loadInitialState = async(forceFetch) => {
      this.setState({fetching:true});
      try {
        const value = await AsyncStorage.getItem('DitidahtWordlist');
        if (value !== null && !forceFetch) {
          console.log('from storage');
          this.setState({words:JSON.parse(value), fetching: false});
          // Comparing if remote is equal
          // Would be better to have a version number we update instead of fetching everything uselessly
          fetch('http://ditidahtdictionary.com/wp-json/words/all')
            .then((response) => response.json())
            .then((responseJson) => {
              console.log('fetch for check')
              if(JSON.stringify(responseJson)!==value) {
                console.log('not equal, replace');
                this.setState({words:responseJson});
                AsyncStorage.setItem('DitidahtWordlist', JSON.stringify(responseJson));
              }
          }).catch((error) => {
              console.log(error);
          });
        } else {
          console.log('fetching');
          fetch('http://ditidahtdictionary.com/wp-json/words/all')
            .then((response) => response.json())
            .then((responseJson) => {
              this.setState({words:responseJson, fetching: false});
              AsyncStorage.setItem('DitidahtWordlist', JSON.stringify(responseJson));
          }).catch((error) => {
              console.log(error);
          });
        }
      } catch (error) {
        // Error retrieving data
      }
  }

  render() {
    if(this.state.loading) {
      return (
        <AppLoading
          startAsync={loadResourcesAsync}
          onError={handleLoadingError}
          onFinish={() => this.setState({loading:false})}
        />
      )
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator screenProps={{
            words : this.state.words,
            fetching : this.state.fetching,
            _loadInitialState : this._loadInitialState
          }} />
        </View>
      )
    }
  }
}

async function loadResourcesAsync() {
  const imageAssets = cacheImages([
    require('./assets/images/nitinaht-lake-min.png'),
  ]);
  const fontAssets = cacheFonts([Ionicons.font]);
  await Promise.all([...imageAssets, ...fontAssets]);
}

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

function handleLoadingError(error: Error) {
  console.warn(error);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
