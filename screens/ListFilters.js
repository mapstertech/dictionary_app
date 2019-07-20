import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class ListFilters extends Component {
    static navigationOptions = {
        title: 'Filters',
    }

    constructor(props) {
        super(props);
        this.state = {
            categories: this.props.navigation.getParam('categories'),
            currentFilter : false
        };
    }

    async componentDidMount() {
        this.setState({ 
            categories : this.props.navigation.getParam('categories')
        })
    }

    applyFilters() {
        const { currentFilter } = this.state;
        if (currentFilter) {
            this.props.navigation.state.params.filterWords(currentFilter);
        }
        this.props.navigation.goBack();

    }

    render() {
        const { categories, currentFilter } = this.state;

        return (
            <View style={styles.container}>

                <View style={styles.filters}>
                    <Text style={styles.filterLabel}>
                        Grammar
                    </Text>
                    <View style={{ flexDirection : 'row' }}>
                        { categories && categories.map(cat=> {
                            return (
                                <TouchableOpacity 
                                    onPress={() => this.setState({ currentFilter : cat })}
                                    key={cat} 
                                    style={[styles.filterButton, currentFilter === cat ? styles.activeButton : null ]}
                                >
                                    <Text style={[ styles.catText, currentFilter === cat ? styles.activeText : null ]}>
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>

                <View style={{ alignItems : 'center' }}>
                    <TouchableOpacity 
                        onPress={() => this.applyFilters()}
                        style={styles.applyButton}
                    >
                        <Text style={styles.filterButtonText}>
                            Apply Filters
                        </Text>
                    </TouchableOpacity>
                </View>
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
        flexWrap : 'wrap',
        borderColor : '#eee',
        borderWidth : 1,
        padding : 10,
    },
    filterLabel : {
        textTransform : 'uppercase',
        padding : 5,
        fontWeight : 'bold'

    },
    filterButton : {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#222',
        borderWidth : 1,
        margin : 5,
        padding : 10,
        borderRadius : 2,
        textAlign : 'center',
    },
    activeButton : {
        backgroundColor : '#222',
    },
    catText : {
        textTransform : 'capitalize'
    },
    activeText: {
        color : '#fff',
    },
    filterButtonText : {
        fontWeight : 'bold',
        fontSize : 14 ,
        color : '#fff'
    },
    applyButton : {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#222',
        margin : 15,
        borderRadius : 2,
        textAlign : 'center',
        padding : 14
    },
    itemText : {
        padding : 6,
        color : '#fff',
        fontSize : 20,
        textTransform : 'capitalize'
    }
});
