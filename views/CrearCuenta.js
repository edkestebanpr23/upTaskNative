import React, { useState } from 'react';
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Container, Button, Text, H1, Input, Form, Item, Toast } from "native-base";
import S from "../styles/global";

// Apollo
import { gql, useMutation } from "@apollo/client";
/**
 * Este corresponde a la mutacion que se haría en el servidor de graphical
 */
const NUEVA_CUENTA = gql`
    mutation crearUsuario ($input: UsuarioInput) {
        crearUsuario (input: $input)
    }
`;

const CrearCuenta = () => {
    // React Navigation
    const navigation = useNavigation();

    /**
     * Mutation de Apollo:
     * Aquí debo pasarle la sentencia que escribiría en el servidor de graphical para insertar o etc...
     * Me retorna la funcion correspondiente del resolver... En este caso, el resolver para
     * Crear usuario de servidor lo tengo ahora disponible en RN [crearUsuario]: function
     * Siempre me retorna el nombre de la funcion que está después de mutation
     */
    const [crearUsuario] = useMutation(NUEVA_CUENTA);

    // state del formulario
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [mensaje, setMensaje] = useState(null);

    const registrar = async () => {
        // Validar
        if (nombre === '' || correo === '' || contrasena === '') {
            // Mostrar error
            setMensaje('Todos los campos son obligatorios');
            console.log(mensaje);
            return;
        }
        // Password al menos de 6 caracteres
        if (contrasena.length < 6) {
            setMensaje('La contraseña debe ser de al menos 6 caracteres');
            console.log(mensaje);
            return;
        }

        // Guardar usuario
        try {
            const { data } = await crearUsuario({
                /**
                 * Aqui dentro le paso las variables, me dice que recibe un inputUsuario que contiene
                 * Nombre, email y password...
                 */
                variables: {
                    // input porque en el servidor llamé que la variable que recibe se llama '$input'
                    input: {
                        nombre,
                        email: correo,
                        password: contrasena
                    }
                }
            });
            console.log("Datos recibidos:", data);
            setMensaje(data.crearUsuario);
            navigation.navigate('Login');
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
                            placeholder="Nombre"
                            onChangeText={texto => setNombre(texto)}
                        />
                    </Item>

                    <Item inlineLabel last style={S.input}>
                        <Input
                            placeholder="Correo"
                            onChangeText={texto => setCorreo(texto)}

                        />
                    </Item>

                    <Item inlineLabel last style={S.input}>
                        <Input
                            secureTextEntry={true}
                            placeholder="Contraseña"
                            onChangeText={texto => setContrasena(texto)}

                        />
                    </Item>
                </Form>

                <Button square block style={S.boton} onPress={registrar}>
                    <Text style={S.botonTexto}>Crear Cuenta</Text>
                </Button>

                {
                    mensaje && mostrarAlerta()
                }
            </View>
        </Container>
    );
}

export default CrearCuenta;