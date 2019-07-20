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
                    { categories && categories.map(cat=> {
                        return (
                            <TouchableOpacity 
                                onPress={() => this.setState({ currentFilter : cat })}
                                key={cat} 
                                style={styles.filterButton}
                            >
                                <Text style={styles.filterButtonText}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>

                <TouchableOpacity 
                    onPress={() => this.applyFilters()}
                    style={styles.applyButton}
                >
                    <Text style={styles.filterButtonText}>
                        Apply Filters
                    </Text>
                </TouchableOpacity>
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
        flexDirection : 'row',
        flexWrap : 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterButton : {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ccc',
        margin : 5,
        borderRadius : 2,
        height : 80,
        textAlign : 'center',
        width : 100
    },
    filterButtonText : {
        fontWeight : 'bold',
        fontSize : 14 
    },
    applyButton : {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#777',
        margin : 5,
        borderRadius : 2,
        height : 80,
        textAlign : 'center',
        width : 100
    },
    itemText : {
        padding : 6,
        color : '#fff',
        fontSize : 20,
        textTransform : 'capitalize'
    }
});
