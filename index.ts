
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

let express = require("express")
const app: any = express();

const httpServer = createServer(app);
const cors = require("cors")

const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }:{req:Express.Request,res:Express.Response}) => ({ req, res, pubsub }),
});
app.use(cors({
    url: "https://employee-managment-dashboard-client.vercel.app",
}))

async function startApolloServer() {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    const wsServer = new WebSocketServer(
        {
            server: httpServer,
            
            path: apolloServer.graphqlPath
        }
    );

    useServer({ schema, execute, subscribe }, wsServer);
}

startApolloServer();

const port = 4004;
httpServer.listen(port, () => {
    console.log(`Server ready at http://localhost:${port}${apolloServer.graphqlPath}`);
});
