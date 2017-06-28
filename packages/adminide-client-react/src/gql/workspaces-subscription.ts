import { gql } from 'react-apollo';

export default gql`
    subscription subscribeToWorkspace($filter: subscribeWorkspaceFilter, $mutations: [WorkspaceMutationEvent]! ) {
        subscribeToWorkspace(filter: $filter, mutations: $mutations) {
            value {
                _id
                name
                language
                status
                description
                spec {
                    cpu
                    ram
                    hdd
                }
            }
            mutation
        }
    }
`;
