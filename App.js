import { createStackNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from './Home'
import WordDetailScreen from './WordDetail'

const MainNavigator = createStackNavigator({
    Home: { screen: HomeScreen },
    WordDetail: { screen: WordDetailScreen }
});

const App = createAppContainer(MainNavigator);

export default App;
