import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ALL_AUTHORS } from './queries.jsx'

import { 
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  split
 } from '@apollo/client'

import { setContext } from '@apollo/client/link/context'

import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('library-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
})

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
})

const wsLink = new GraphQLWsLink(
  createClient({ url: 'http://localhost:4000' })
)

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink
})

// client.query({ query: ALL_AUTHORS })
//   .then((response) => {
//     console.log(response.data)
//   })

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
