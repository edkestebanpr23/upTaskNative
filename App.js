import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Root } from 'native-base';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-community/async-storage";

import Login from "./views/Login";
import CrearCuenta from "./views/CrearCuenta";
import Proyectos from "./views/Proyectos";
import NuevoProyecto from "./views/NuevoProyecto";
import Proyecto from "./views/Proyecto";


const Stack = createStackNavigator();

const App = () => {

  const [view, setView] = useState('Proyectos');

  // useEffect(() => {
  //   const init = async () => {
  //     let token = await AsyncStorage.getItem('token');
  //     const initialView = token ? 'Proyectos' : 'Login';
  //     console.log('Vista inciial:', initialView);
  //     setView(initialView);
  //   };

  //   init();
  // }, [view])

  return (
    <>
      {/* Este Root es para solucionar un error de Toast (Mostrar alertas negras abajo) */}
      {view && (
        <Root>
          <NavigationContainer>
            <Stack.Navigator initialRouteName={'Proyectos'}>

              <Stack.Screen
                name="Login"
                component={Login}
                options={{
                  title: "Iniciar Sesión",
                  headerShown: false, // Así no se muestra el header
                }}
              >
              </Stack.Screen>

              <Stack.Screen
                name="CrearCuenta"
                component={CrearCuenta}
                options={{
                  title: "Crear Cuenta",
                  headerShown: true, // Así no se muestra el header
                  headerStyle: {
                    backgroundColor: '#28303B'
                  },
                  headerTintColor: '#FFFFFF',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  headerTitleAlign: 'center'
                }}
              ></Stack.Screen>

              <Stack.Screen
                name="Proyectos"
                component={Proyectos}
                options={{
                  title: "Proyectos",
                  headerShown: true, // Así no se muestra el header
                  headerStyle: {
                    backgroundColor: '#28303B'
                  },
                  headerTintColor: '#FFFFFF',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  headerTitleAlign: 'center'
                }}
              ></Stack.Screen>

              <Stack.Screen
                name="NuevoProyecto"
                component={NuevoProyecto}
                options={{
                  title: "Nuevo Proyecto",
                  headerShown: true, // Así no se muestra el header
                  headerStyle: {
                    backgroundColor: '#28303B'
                  },
                  headerTintColor: '#FFFFFF',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  headerTitleAlign: 'center'
                }}
              ></Stack.Screen>

              <Stack.Screen
                name="Proyecto"
                component={Proyecto}
                options={({ route }) => ({
                  title: route.params.nombre,
                  headerShown: true, // Así no se muestra el header
                  headerStyle: {
                    backgroundColor: '#28303B'
                  },
                  headerTintColor: '#FFFFFF',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  headerTitleAlign: 'center'
                })}
              ></Stack.Screen>


            </Stack.Navigator>
          </NavigationContainer>
        </Root>
      )}

    </>
  );
};

const styles = StyleSheet.create({

});

export default App;
