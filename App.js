import { createStackNavigator, createAppContainer } from 'react-navigation';

import HomeScreen from './Home'
import WordDetailScreen from './WordDetail'
import ListScreen from './List'

const MainNavigator = createStackNavigator({
    List: { screen: ListScreen },
    Home: { screen: HomeScreen },
    WordDetail: { screen: WordDetailScreen }
});

const App = createAppContainer(MainNavigator);

export default App;
