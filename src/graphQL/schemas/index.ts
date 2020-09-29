import fs from 'fs';
import path from 'path';
import {merge} from 'lodash';
import {makeExecutableSchema} from 'graphql-tools';
import {GraphQLScalarType, Kind} from 'graphql';


const Query = `
    scalar Date

    type Query {
        status: String!
    }
`;

const Mutation = `
    type Mutation {
        _empty: String
    }
`;


let resolvers = {
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Custom Date Scalar Type',
        parseValue(value) {
            return new Date(value)
        },
        serialize(value) {
            return value;
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return parseInt(ast.value, 10);
            }
            return null;
        },
    }),
    
    Query: {
        status: () => 'UP&RUNNING'
    },
};

const typeDefs = [Query, Mutation];

fs.readdirSync(__dirname)
    .filter(dir => (dir.indexOf('.') < 0))
    .forEach(dir => {
        const tmp = require(path.join(__dirname, dir)).default;
        resolvers = merge(resolvers, tmp.resolvers);
        typeDefs.push(tmp.types);
    });




export default makeExecutableSchema({
    typeDefs,
    resolvers
});