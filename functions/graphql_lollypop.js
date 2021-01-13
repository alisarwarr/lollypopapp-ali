const dotenv = require('dotenv');
dotenv.config();


const { ApolloServer, gql } = require('apollo-server-lambda');
var faunadb = require('faunadb'),
q = faunadb.query;


const axios = require('axios');


const typeDefs = gql`
    type lollypopType {
        id: ID!
        topColor: String!
        middleColor: String!
        bottomColor: String!
        to: String!
        message: String!
        from: String!
        path: String!
    }

    type Query {
        allLollypop: [lollypopType]
        getLollypopbyPath(path: String!): lollypopType
    }

    type Mutation {
        addLollypop(
            topColor: String!
            middleColor: String!
            bottomColor: String!
            to: String!
            message: String!
            from: String!
            path: String!
        ): lollypopType
    }
`

var adminClient = new faunadb.Client({
    secret: process.env.FAUNADB_ADMIN_SECRET
})

const resolvers = {
    Query: {
        allLollypop: async() => {
            try {
                const result = await adminClient.query(
                    q.Map(
                        q.Paginate(q.Documents(q.Collection('lollypops'))),
                        q.Lambda(x => q.Get(x))
                    )
                )

                const modifiedData = result.data.map(obj => {               //array holding only 'id', 'topColor', 'middleColor', 'bootomColor', 'to', 'message', 'from' & 'path' properties
                    return {
                        id           : obj.ref.id,
                        topColor     : obj.data.topColor,
                        middleColor  : obj.data.middleColor,
                        bottomColor  : obj.data.bottomColor,
                        to           : obj.data.to,
                        message      : obj.data.message,
                        from         : obj.data.from,
                        path         : obj.data.path
                    }
                })

                return modifiedData;                                        //return that array
            }
            catch(error) {
                console.log(error);   
            }
        },

        getLollypopbyPath: async(_, {path}) => {
            try {
                const result = await adminClient.query(
                    q.Get(q.Match(q.Index('lollypop_by_path'), path))
                )

                return {                                                   //array holding only 'id', 'topColor', 'middleColor', 'bootomColor', 'to', 'message', 'from' & 'path' properties
                    id           : result.ref.id,
                    topColor     : result.data.topColor,
                    middleColor  : result.data.middleColor,
                    bottomColor  : result.data.bottomColor,
                    to           : result.data.to,
                    message      : result.data.message,
                    from         : result.data.from,
                    path         : result.data.path
                }
            }
            catch(error) {
                console.log(error);   
            }
        }
    },

    Mutation: {
        addLollypop: async(_, {
            topColor,
            middleColor,
            bottomColor,
            to,
            message,
            from,
            path
        }) => {
            try {
                const result = await adminClient.query(
                    q.Create(
                        q.Collection('lollypops'),
                        { data: { 
                            topColor,                                       //'topColor' assigned
                            middleColor,                                    //'middleColor' assigned
                            bottomColor,                                    //'bottomColor' assigned
                            to,                                             //'to' assigned
                            message,                                        //'message' assigned
                            from,                                           //'from' assigned
                            path                                            //'path' assigned
                        } }
                    )
                )

                //to refetch data realtime while dynamic pages
                    axios
                    .post('https://api.netlify.com/build_hooks/5ff2610e39a30065cc762b04')
                    .then((response) => {
                        console.log(response);
                    })
                    .catch((error) => {
                        console.error(error);
                    })
                //to refetch data realtime while dynamic pages
            }
            catch(error) {
                console.log(error);
            }
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    introspection: true
})

exports.handler = server.createHandler();