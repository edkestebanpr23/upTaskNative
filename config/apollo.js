import { ApolloClient } from "@apollo/client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink, createHttpLink } from "apollo-link-http";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { setContext } from "apollo-link-context";

const httpLink = createHttpLink({
    uri: Platform.OS === 'ios' ? 'http://localhost:4000/' : 'http://192.168.1.61:4000/',
});

// Con esto vamos a pasar el token por el header
const authLink = setContext(async (_, { headers }) => {
    // Leer token
    const token = await AsyncStorage.getItem('token');
    // console.log('Token CLI', token);

    return {
        // Retorno un heder con todo lo que tenia, mas el Token si existe
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '', // Se supone que es un estandar retornarlo así...
        }
    }
});

// const uri = Platform.OS === 'ios' ? 'http://localhost:4000/' : 'http://192.168.1.61:4000/';

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
});

// const client = new ApolloClient({
//     cache: new InMemoryCache(),
//     link: new HttpLink({
//         uri: uri
//     })
// });

export default client;