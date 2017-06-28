import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { personsList as persons, findPerson, addPerson } from './data-base/person-database';
import { getBoxesList, createBox, removeBox, setBoxStatus, updateBox } from './data-base/boxes-database';
import './connectors';

/* tslint:disable:no-var-requires */
const modules = [
    require('./modules/mocked-type'),
    require('./modules/some-type'),
    require('./modules/person-type'),
    require('./modules/query'),
    require('./modules/subscription'),
    require('./modules/mutation'),
    require('./modules/box-type'),
];

const mainDefs = [`
    schema {
        query: Query
        mutation: Mutation
        subscription: Subscription
    }
`,
];

const resolvers = Object.assign({},
    ...(modules.map((m) => m.resolver).filter((res) => !!res)));

const typeDefs = mainDefs.concat(modules.map((m) => m.typeDef).filter((res) => !!res));

const schema: GraphQLSchema = makeExecutableSchema({
    logger: console,
    resolverValidationOptions: {
        requireResolversForNonScalar: false,
    },
    resolvers: resolvers,
    typeDefs: typeDefs,
});

const database = { persons, addPerson, findPerson, getBoxesList, createBox, removeBox, setBoxStatus, updateBox };
export { resolvers, typeDefs, database };
