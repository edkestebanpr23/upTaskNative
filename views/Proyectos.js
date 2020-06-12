import React from 'react';
import { StyleSheet } from "react-native";
import { Container, Button, Text, H2, Content, List, ListItem, Right, Left } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { gql, useQuery } from "@apollo/client";
import S from "../styles/global";

const OBTENER_PROYECTOS = gql`
    query obtenerProyectos {
        obtenerProyectos {
            id
            nombre
        }
    }
`;

const Proyectos = () => {

    const navigation = useNavigation();

    // Apollo
    /**
     * Esta destructuracion me dice:
     * data: Ahi se cargan los datos una vez se realice la consulta en el servidor
     * loading: Este al ejecutarse es true, pero cambia a falso cuando retorne un resultado
     * error: Si ocurrio un error...
     */
    const { data, loading, error } = useQuery(OBTENER_PROYECTOS);
    console.log(data);
    console.log(loading);
    console.log(error);

    if (loading) return <Text>Cargando...</Text>

    return (
        <Container style={[S.contenedor, { backgroundColor: '#E84347' }]}>
            <Button style={[S.boton, { marginTop: 30, marginHorizontal: 20 }]} square block rounded
                onPress={() => navigation.navigate('NuevoProyecto')}
            >
                <Text style={S.botonTexto}>Nuevo Proyecto</Text>
            </Button>

            <H2 style={S.subtitulo}>Selecciona un proyecto</H2>

            <Content>
                <List style={styles.contenido}>
                    {
                        data.obtenerProyectos.map(proyecto => (
                            <ListItem
                                key={proyecto.id}
                                onPress={() => navigation.navigate("Proyecto", proyecto)}
                            >
                                <Left>
                                    <Text>{proyecto.nombre}</Text>
                                </Left>
                                <Right>

                                </Right>
                            </ListItem>
                        ))
                    }
                </List>
            </Content>
        </Container>
    );
};

const styles = StyleSheet.create({
    contenido: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: '2.5%'
    }
});

export default Proyectos;