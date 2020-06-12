import React, { useState } from 'react';
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-community/async-storage";
import { Container, Button, Text, H1, Input, Form, Item, Toast } from "native-base";
import S from "../styles/global";


// Apollo
import { gql, useMutation } from "@apollo/client";
/**
 * Este corresponde a la mutacion que se haría en el servidor de graphical
 */
const AUTENTICAR_USUARIO = gql`
    mutation autenticarUsuario ($input: AutenticarInput) {
        autenticarUsuario (input: $input) {
        token
    }
  }`;

const Login = () => {

    const navigation = useNavigation();
    // Mutation de Apollo
    const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);

    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [mensaje, setMensaje] = useState(null);

    const iniciarSesion = async () => {
        // Validar
        if (correo === '' || contrasena === '') {
            // Mostrar error
            setMensaje('Todos los campos son obligatorios');
            console.log(mensaje);
            return;
        }

        try {
            const { data } = await autenticarUsuario({
                /**
                 * Aqui dentro le paso las variables, me dice que recibe un inputUsuario que contiene
                 * Nombre, email y password...
                 */
                variables: {
                    // input porque en el servidor llamé que la variable que recibe se llama '$input'
                    input: {
                        email: correo,
                        password: contrasena
                    }
                }
            });
            // console.log("Datos recibidos:", data);
            const { token } = data.autenticarUsuario;
            console.log(token);

            // Guardar token
            await AsyncStorage.setItem('token', token);

            // Redireccionar
            navigation.navigate('Proyectos');

        } catch (error) {
            setMensaje(error.message.replace('GraphQL error:', ''));
        }
    };

    // Muestra un mensaje toast
    const mostrarAlerta = () => {
        Toast.show({
            text: mensaje,
            buttonText: 'OK',
            duration: 4000,
        });
    };

    return (
        <Container style={[S.contenedor, { backgroundColor: '#E84347' }]} >
            <View style={S.contenido}>
                <H1 style={S.titulo}>UpTask</H1>

                <Form>
                    <Item inlineLabel last style={S.input}>
                        <Input
                            placeholder="Correo"
                            onChangeText={text => setCorreo(text.toLocaleLowerCase())}
                            value={correo}
                            keyboardType='email-address'
                            keyboardAppearance='dark'
                        />
                    </Item>

                    <Item inlineLabel last style={S.input}>
                        <Input
                            secureTextEntry={true}
                            placeholder="Contraseña"
                            onChangeText={text => setContrasena(text)}
                        />
                    </Item>
                </Form>

                <Button square block style={S.boton} onPress={iniciarSesion}>
                    <Text style={S.botonTexto}>Iniciar Sesión</Text>
                </Button>

                <Text onPress={() => navigation.navigate('CrearCuenta')} style={S.enlace}>Crear Cuenta</Text>

                {
                    mensaje && mostrarAlerta()
                }
            </View>
        </Container>
    );
}

export default Login;