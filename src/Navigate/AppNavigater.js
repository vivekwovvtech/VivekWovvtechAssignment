import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRefer} from './RootNavigator';
import {createStackNavigator} from '@react-navigation/stack';
import PostListing from '../Activities/PostListing';
import JsonDetails from '../Activities/JsonDetails';

const Stack = createStackNavigator();

export default function AppNavigater()
{
    return(

<NavigationContainer ref={navigationRefer}>
    <Stack.Navigator initialRouterName ="HomeScreen">
    <Stack.Screen
    name= "PostListing"
     component ={PostListing}
     options ={
         {
             title:'Posts',
         }
     }
    />
    <Stack.Screen
    name= "JsonDetails"
    component ={JsonDetails}
    options={{ 
        title:'JSON'
    }}
/>
    </Stack.Navigator>


</NavigationContainer>
    );
}