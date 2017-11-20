import { StackNavigator } from 'react-navigation';
import Home from '../Home';

const App = StackNavigator({
  Home: { screen: Home },
});

export default App;
