var express = require("express")
var { graphqlHTTP } = require("express-graphql")
var { buildSchema } = require("graphql")
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList,
    GraphQLNonNull,
  } = require('graphql');


const PagePostType = new GraphQLObjectType({
    name: 'PagePost',
    fields: () => ({
        pageId: {type: GraphQLString},
        pageName: { type: GraphQLString },
        userName: { type: GraphQLString },
        facebookId: { type: GraphQLString },
        // ... add other fields similarly
        overperformingScore: { type: GraphQLFloat },
    }),
});


// test data
const fakeDatabase = [
    // Sample data
    {
      pageId: '1',
      pageName: 'Page 1',
      userName: 'User 1',
      facebookId: '123456789',
      overperformingScore: 1.2,
    },
    {
      pageId: '2',
      pageName: 'Page 2',
      userName: 'User 2',
      facebookId: '987654321',
      overperformingScore: 0.9,
    },
    {
      pageId: '3',
      pageName: 'Page 3',
      userName: 'User 3',
      facebookId: '456789123',
      overperformingScore: 1.5,
    },
    // ... add more data as needed
  ];


// endpoints functions
var getPagePost = {
  type: new GraphQLList(PagePostType),
  resolve(parent, args) {
      // This resolver would ideally fetch the page post data
      // Replace this with your data
      return fakeDatabase
      // Sample Query
      // {
      //     getPagePost{
      //       pageId,
      //       pageName,
      //       userName,
      //       facebookId,
      //     }
      // }
  },
}

var getPagePostByPageName = {
  type: PagePostType,
  args: {
      pageName: { type: GraphQLNonNull(GraphQLString) }, // Define an argument for ID
  },
  resolve(parent, args) {
      // Logic to fetch a specific page post by ID
      return fakeDatabase.find(post => post.pageName === args.pageName);
      // Sample Query
      // {
      //     getPagePostByPageName(pageName: "Page 1"){
      //       pageId,
      //       pageName,
      //       userName,
      //       facebookId,
      //     }
      // }
  },
}

// Define the root query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        getPagePost: getPagePost,
        getPagePostByPageName: getPagePostByPageName,
    },
});

// Create the GraphQL schema
const schema = new GraphQLSchema({
    query: RootQuery,
});


var app = express()
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    // source: source,
    rootValue: RootQuery,
    // graphiql: true,
  })
)
app.listen(4000)
console.log("Running a GraphQL API server at http://localhost:4000/graphql")