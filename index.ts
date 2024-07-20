
let { ApolloServer } = require('apollo-server-express');
let { createServer } = require('http');
let { WebSocketServer } = require('ws');
let { useServer } = require('graphql-ws/lib/use/ws');
let { makeExecutableSchema } = require('@graphql-tools/schema');
let { execute, subscribe } = require('graphql');
let typeDefs = require('./typedefs/typeDefs');
let resolvers = require('./resolvers/resolvers');
let { PubSub } = require('graphql-subscriptions');


let pubsub = new PubSub();
let schema = makeExecutableSchema({ typeDefs, resolvers });

let express = require("express")
let app = express();

let httpServer = createServer(app);
let cors = require("cors")

let apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }:{req:Express.Request,res:Express.Response}) => ({ req, res, pubsub }),
});
app.use(cors({
    url: "https://employee-managment-dashboard-client.vercel.app",
}))

async function startApolloServer() {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    let wsServer = new WebSocketServer(
        {
            server: httpServer,
            
            path: apolloServer.graphqlPath
        }
    );

    useServer({ schema, execute, subscribe }, wsServer);
}

startApolloServer();

let port = 4004;
httpServer.listen(port, () => {
    console.log(`Server ready at http://localhost:${port}${apolloServer.graphqlPath}`);
});
