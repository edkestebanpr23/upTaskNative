import { StyleSheet } from 'react-native';

const S = StyleSheet.create({
    contenedor: {
        flex: 1
    },
    contenido: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginHorizontal: '2.5%',
        flex: 1
    },
    titulo: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white'
    },
    subtitulo: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 26,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 15
    },
    input: {
        backgroundColor: 'white',
        marginBottom: 20
    },
    boton: {
        backgroundColor: '#28303B',
    },
    botonTexto: {
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: 'white'
    },
    enlace: {
        color: "white",
        marginTop: 60,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        textTransform: 'uppercase'
    }
});

export default S;