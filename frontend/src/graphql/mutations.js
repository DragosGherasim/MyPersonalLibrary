import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      token
      user {
        username
      }
      errors {
        ... on InvalidCredentialsError {
          code
          message
        }
      }
    }
  }
`;