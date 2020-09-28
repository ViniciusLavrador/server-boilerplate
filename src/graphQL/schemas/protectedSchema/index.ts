import { types, typeResolvers } from './_type';
import { queryTypes, queryResolvers } from './_query';
import { mutationTypes, mutationResolvers } from './_mutation';
import { enumTypes, enumResolvers } from './_enum'
import inputTypes from './_input';


export default {
    types: () => [types, queryTypes, mutationTypes, enumTypes, inputTypes],
    resolvers: Object.assign(typeResolvers, queryResolvers, mutationResolvers, enumResolvers)
};
