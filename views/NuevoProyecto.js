import React, { useState } from 'react';
import { View, YellowBox } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Container, Button, Text, H1, Form, Item, Input, Toast } from "native-base";
import S from "../styles/global";

// Apollo
import { gql, useMutation } from "@apollo/client";
/**
 * Este corresponde a la mutacion que se haría en el servidor de graphical
 */
const NUEVO_PROYECTO = gql`
    mutation nuevoProyecto ($input: ProyectoInput) {
        nuevoProyecto (input: $input) {
        nombre
        id
        }
    }`;

const OBTENER_PROYECTOS = gql`
    query obtenerProyectos {
        obtenerProyectos {
            id
            nombre
        }
    }
`;

YellowBox.ignoreWarnings([
    'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
]);

const NuevoProyecto = () => {

    const [nombre, setNombre] = useState('');
    const [mensaje, setMensaje] = useState(null);

    // Navigation
    const navigation = useNavigation();

    // Apollo
    // Para entender este paso de actualización, se debe ver el video 251: Actualizar los proyectos cuando se agregan nuevos...
    const [nuevoProyecto] = useMutation(NUEVO_PROYECTO, {
        update(cache, { data: { nuevoProyecto } }) {
            const { obtenerProyectos } = cache.readQuery({ query: OBTENER_PROYECTOS });
            cache.writeQuery({
                query: OBTENER_PROYECTOS,
                data: { obtenerProyectos: obtenerProyectos.concat([nuevoProyecto]) }
            })
        }
    });

    // Validar proyecto
    const handleSubmit = async () => {
        if (nombre === '') {
            setMensaje('El nombre del proyecto es obligatorio.');
            return;
        }

        // Guardar el proyecto en la BD
        try {
            const { data } = await nuevoProyecto({
                variables: {
                    input: {
                        nombre
                    }
                }
            });
            setMensaje('¡Proyecto creado correctamente!');
            navigation.navigate('Proyectos');
        } catch (error) {
            console.log(error);
            setMensaje('¡Algo ha salido mal, intentalo luego!');
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
        <Container style={[S.contenedor, { backgroundColor: '#E84347' }]}>
            <View style={S.contenido}>
                <H1 style={S.subtitulo}>Nuevo proyecto</H1>
                <Form>
                    <Item inlineLabel last rounded style={S.input}>
                        <Input
                            placeholder="Nombre del proyecto"
                            onChangeText={text => setNombre(text)}
                        />
                    </Item>
                </Form>
                <Button style={[S.boton, { marginTop: 30, marginHorizontal: 20 }]} square block rounded
                    onPress={handleSubmit}
                >
                    <Text style={S.botonTexto}>Crear Proyecto</Text>
                </Button>

                {
                    mensaje && mostrarAlerta()
                }
            </View>
        </Container>
    );
}

export default NuevoProyecto;