import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from './src/page/SplashScreen';
import DashboardScreen from "./src/page/DashboardScreen";
import EscritorQuiz from "./src/page/EscritorQuiz";
import DistrictQuiz from "./src/page/DistrictQuiz";
import LakeQuiz from "./src/page/LakeQuiz";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="EscritorQuiz" component={EscritorQuiz} />
        <Stack.Screen name="Provincias" component={DistrictQuiz} /> 
        <Stack.Screen name="Lagoa" component={LakeQuiz}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
