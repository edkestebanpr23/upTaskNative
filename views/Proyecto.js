import React, { useState } from 'react';
import { StyleSheet, YellowBox } from "react-native";
import { Container, Button, Text, H2, Content, List, Form, Item, Input, Toast } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { gql, useMutation, useQuery } from "@apollo/client";
import S from "../styles/global";
import Tarea from "../components/Tarea";

YellowBox.ignoreWarnings([
    'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
]);

// Crear nuevas tareas
const NUEVA_TAREA = gql`
    mutation nuevaTarea($input: TareaInput) {
        nuevaTarea(input: $input) {
            nombre
            id
            proyecto
            estado
        }
    }
`;

// Obtener tareas
const OBTENER_TAREAS = gql`
query obtenerTareas ($input: ProyectoIdInput) {
    obtenerTareas (input: $input) {
        id
        nombre
        estado
    }
}
`;

const Proyecto = ({ route }) => {

    // State del componente
    const [nombre, setNombre] = useState('');
    const [mensaje, setMensaje] = useState(null);
    // const [tareas, setTareas] = useState([]);

    // Apollo crear tareas [] Mutation con [ ]
    const [nuevaTarea] = useMutation(NUEVA_TAREA, {
        update(cache, { data: { nuevaTarea } }) {
            // El nombre destructurado de la variable depende de la funcion que esté almacenada en caché
            const { obtenerTareas } = cache.readQuery({
                // Query a ejecutar, pero no se ejecuta en el servidor, es local
                query: OBTENER_TAREAS,
                // Estas son las mismas variables que usamos cuando hacemos la consulta
                variables: {
                    input: {
                        // nombre: nombre,
                        proyecto: route.params.id
                    }
                }
            });

            cache.writeQuery({
                // Aquí se repite la informacion de cache.readQuery()
                query: OBTENER_TAREAS,
                variables: {
                    input: {
                        // nombre: nombre,
                        proyecto: route.params.id
                    }
                },
                /**
                 * Este data es con lo que lo vamos a reescribir
                 */
                data: {
                    obtenerTareas: [...obtenerTareas, nuevaTarea]
                }
            })
        }
    });

    // Apollo obtener tareas {} Queries con { }
    const { data, loading, error } = useQuery(OBTENER_TAREAS, {
        variables: {
            input: {
                proyecto: route.params.id
            }
        }
    });
    if (data) { console.log(data) }


    const crearTareaFn = async () => {
        console.log('___________________________', nombre);
        if (nombre === '') {
            setMensaje('El nombre de la tarea es obligatorio');
            return;
        }
        const variables = {
            variables: {
                input: {
                    nombre: nombre,
                    proyecto: route.params.id
                }
            }
        };
        console.log('Variables:', variables);

        try {
            const { data } = await nuevaTarea(variables);
            console.log(data);
            setMensaje(null);
            setMensaje('Tarea creada correctamente!');
            setTimeout(() => {
                setMensaje(null);
            }, 3000);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    // Muestra un mensaje toast
    const mostrarAlerta = () => {
        Toast.show({
            text: mensaje,
            buttonText: 'OK',
            duration: 4000,
            useNativeDriver: true
        });
    };

    // if (loading) return <Text>Cargando...</Text>;

    return (
        <Container style={[S.contenedor, { backgroundColor: '#E84347' }]}>
            <Form style={{ marginHorizontal: '2.5%', marginTop: 20 }}>
                <Item inlineLabel last style={S.input}>
                    <Input
                        placeholder="Nombre Tarea"
                        // value={nombre}
                        onChangeText={text => setNombre(text)}
                    />
                </Item>

                <Button style={S.boton} square block onPress={() => crearTareaFn()}>
                    <Text style={S.botonTexto}>Crear Tarea</Text>
                </Button>
            </Form>

            <H2 style={S.subtitulo}>Tareas: {route.params.nombre} </H2>

            <Content>
                <List style={styles.contenido}>
                    {
                        data && data.obtenerTareas.map(tarea => (
                            <Tarea key={tarea.id} tarea={tarea} proyectoId={route.params.id} />
                        ))
                    }
                </List>
            </Content>
            {
                mensaje && mostrarAlerta()
            }
        </Container>
    );
};

const styles = StyleSheet.create({
    contenido: {
        backgroundColor: 'white',
        marginHorizontal: '2.5%'
    }
});

export default Proyecto;