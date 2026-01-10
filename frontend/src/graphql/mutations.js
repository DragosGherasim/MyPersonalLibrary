import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      token
    }
  }
`;

export const CREATE_AUTHOR = gql`
  mutation CreateAuthor($name: String!) {
    createAuthor(input: { name: $name }) {
      authorPayload {
        author {
          id
          name
        }
      }
      errors {
        __typename
        ... on InvalidAuthorNameError {
          message
          code
        }
      }
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation CreateBook($title: String!, $year: Int!, $description: String, $authorId: Int!) {
    createBook(input: { title: $title, year: $year, description: $description, authorId: $authorId }) {
      bookPayload {
        book {
          id
          title
          year
          description
          authorId
        }
      }
      errors {
        __typename
        ... on InvalidBookYearError { message code }
        ... on InvalidTitleError { message code }
        ... on AuthorNotFoundError { message code }
      }
    }
  }
`;

export const UPDATE_BOOK = gql`
  mutation UpdateBook($id: Int!, $title: String, $year: Int, $description: String, $authorId: Int) {
    updateBook(input: { id: $id, title: $title, year: $year, description: $description, authorId: $authorId }) {
      bookPayload {
        book {
          id
          title
          year
          description
          authorId
        }
      }
      errors {
        __typename
        ... on InvalidBookYearError {
          message
          code
        }
        ... on InvalidTitleError {
          message
          code
        }
        ... on AuthorNotFoundError {
          message
          code
        }
        ... on BookNotFoundError {
          message
          code
        }
      }
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: Int!) {
    deleteBook(input: { id: $id }) {
      success
      errors {
        __typename
        ... on BookNotFoundError {
          message
          code
        }
      }
    }
  }
`;
