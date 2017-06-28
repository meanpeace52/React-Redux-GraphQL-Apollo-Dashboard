import { gql } from 'react-apollo';

export default gql`
    mutation addBox($name: String!, $language: String!, $description: String!) {
        addBox(name: $name, language: $language, description: $description) {
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