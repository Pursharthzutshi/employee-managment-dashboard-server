import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws'; 
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { execute, subscribe } from 'graphql';
const typeDefs = require("./typedefs/typeDefs");
const resolvers = require("./resolvers/resolvers");
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();
const schema = makeExecutableSchema({ typeDefs, resolvers });

const app:any = express();
const httpServer = createServer(app);
const cors = require("cors")

const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res, pubsub }), 
});
app.use(cors({
    url: "https://employee-managment-dashboard-client.vercel.app",
}))

async function startApolloServer() {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    const wsServer = new WebSocketServer({ server: httpServer, path: apolloServer.graphqlPath });

    useServer({ schema, execute, subscribe }, wsServer);
}

startApolloServer();

const port = 4004;
httpServer.listen(port, () => {
    console.log(`Server ready at http://localhost:${port}${apolloServer.graphqlPath}`);
});
