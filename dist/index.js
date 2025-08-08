"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { execute, subscribe } = require('graphql');
const typeDefs = require('./typedefs/typeDefs');
const resolvers = require('./resolvers/resolvers');
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();
const schema = makeExecutableSchema({ typeDefs, resolvers });
let express = require("express");
const app = express();
const httpServer = createServer(app);
const cors = require("cors");
const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res, pubsub }),
});
app.use(cors({
    url: process.env.URL,
    // url: "https://employee-managment-dashboard-client.vercel.app",
}));
function startApolloServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield apolloServer.start();
        apolloServer.applyMiddleware({ app });
        const wsServer = new WebSocketServer({
            server: httpServer,
            path: apolloServer.graphqlPath
        });
        useServer({ schema, execute, subscribe }, wsServer);
    });
}
startApolloServer();
const port = 4005;
httpServer.listen(port, () => {
    console.log(`Server ready at http://localhost:${port}${apolloServer.graphqlPath}`);
});
