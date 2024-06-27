import express, { Express } from 'express';
import { ApolloServer } from "apollo-server-express";
import { PubSub } from 'graphql-subscriptions';
import { url } from 'inspector';
const typeDefs = require("./typedefs/typeDefs")
const resolvers = require("./resolvers/resolvers")
const cors = require('cors'); 

const app: any = express();
app.use(cors({
    url:"https://employee-managment-dashboard-client.vercel.app",
}))

const port = 4001;

const pubsub = new PubSub()

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: { pubsub }
})

async function startApolloServer() {
    await server.start();
    server.applyMiddleware({ app,path:"/api"});
}

startApolloServer()


app.listen(port, () => {
    console.log(`${port} is running`);
})