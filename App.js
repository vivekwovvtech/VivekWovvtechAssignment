import React from 'react';
import 'react-native-gesture-handler';
import AppNavigator from './src/Navigate/AppNavigater';
import {Root} from 'native-base';
Console.disableYellowBox = true;

const App = () =>(
<Root>

  <AppNavigator/>
</Root>

);

export default App;