import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Button
} from 'react-native';

export default class SettingsScreen extends Component {
    static navigationOptions = {
        title: 'Settings',
    }


    render() {
        return (
            <View style={styles.container}>
                <Button onPress={() => this.props.screenProps._loadInitialState('forceFetch').done()} title="Download Latest Dictionary" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
        flex: 1,
    },

});
