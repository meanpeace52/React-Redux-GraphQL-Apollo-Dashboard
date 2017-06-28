import { gql } from 'react-apollo';

export default gql`
    query {
        boxes {
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
