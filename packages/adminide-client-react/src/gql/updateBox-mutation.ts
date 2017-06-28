import { gql } from 'react-apollo';

export default gql`
    mutation updateBox($_id: String!, $name: String, $language: String, $description: String) {
        updateBox(_id: $_id, name: $name, language: $language, description: $description) {
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
    }
`;