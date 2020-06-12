import React, { useState } from 'react';
import { StyleSheet, Alert } from "react-native";
import { Text, ListItem, Left, Right, Icon, Toast } from 'native-base';
import { gql, useMutation } from "@apollo/client";

const ACTUALIZAR_TAREA = gql`
    mutation actualizarTarea($id: ID!, $input: TareaInput!, $estado: Boolean) {
        actualizarTarea(id: $id, input: $input, estado: $estado) {
            nombre
            id
            proyecto
            estado
        }
    }
`;

const ELIMINAR_TAREA = gql`
    mutation eliminarTarea($id: ID!) {
        eliminarTarea (id: $id)
    }
`;

// Obtener tareas PARA ACTUALIZAR LUEGO DE ELIMINAR UNA TAREA
const OBTENER_TAREAS = gql`
query obtenerTareas ($input: ProyectoIdInput) {
    obtenerTareas (input: $input) {
        id
        nombre
        estado
    }
}
`;


const Tarea = ({ tarea, proyectoId }) => {

    // const { estado } = tarea;
    // const [estado, setEstado] = useState(tarea.estado);

    // Apollo Actualiza
    /**
     * Las actualizaciones me "actualizan" las tareas, no debo crear states ni nada...
     */
    const [actualizarTarea] = useMutation(ACTUALIZAR_TAREA);
    const [eliminarTarea] = useMutation(ELIMINAR_TAREA, {
        update(cache) {
            const { obtenerTareas } = cache.readQuery({
                query: OBTENER_TAREAS,
                variables: {
                    input: {
                        proyecto: proyectoId
                    }
                }
            });

            cache.writeQuery({
                query: OBTENER_TAREAS,
                variables: {
                    input: {
                        proyecto: proyectoId
                    }
                },
                data: {
                    obtenerTareas: obtenerTareas.filter(tareaActual => tareaActual.id !== tarea.id)
                }
            })
        }
    });

    // Cambia el estado de una tarea a completa o incompleta
    const cambiarEstado = async () => {
        // setEstado(!estado);
        try {
            const { data } = await actualizarTarea({
                variables: {
                    id: tarea.id,
                    input: {
                        nombre: tarea.nombre
                    },
                    estado: !tarea.estado
                }
            })
        } catch (error) {
            console.log(error);
        }
    }


    // Dialogo eliminar una tarea
    const mostrarEliminar = () => {
        Alert.alert('Eliminar tarea', '¿Deseas eliminar la tarea?', [
            {
                text: 'Cancelar',
                style: 'cancel'
            },
            {
                text: 'Confirmar',
                onPress: () => eliminarTareaDB()
            }
        ])
    };

    // Eliminar tarea de la base de datos
    const eliminarTareaDB = async () => {
        try {
            const { data } = await eliminarTarea({
                variables: {
                    id: tarea.id
                }
            });
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <ListItem
                onPress={() => cambiarEstado()}
                onLongPress={() => mostrarEliminar()}
            >
                <Left>
                    <Text>
                        {tarea.nombre}
                    </Text>
                </Left>

                <Right>
                    {
                        tarea.estado ? (
                            <Icon name='ios-checkmark-circle' style={[styles.icono, styles.completo]} />
                        ) : (
                                <Icon name='ios-checkmark-circle' style={[styles.icono, styles.incompleto]} />
                            )
                    }
                </Right>
            </ListItem>
        </>
    );
};

const styles = StyleSheet.create({
    icono: {
        fontSize: 32
    },
    completo: {
        color: 'green'
    },
    incompleto: {
        color: '#E1E1E1'
    }
});

export default Tarea;