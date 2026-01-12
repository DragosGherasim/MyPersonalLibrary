import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      token
      errors {
        ... on InvalidCredentialsError {
          message
        }
      }
    }
  }
`;

export const CREATE_AUTHOR_MUTATION = gql`
  mutation CreateAuthor($name: String!) {
    createAuthor(input: { name: $name }) {
      authorPayload {
        author {
          id
          name
        }
      }
      errors {
        ... on InvalidAuthorNameError {
          message
        }
      }
    }
  }
`;

export const ADD_BOOK_MUTATION = gql`
  mutation AddBook(
    $title: String!
    $year: Int!
    $description: String
    $authorId: Int!
  ) {
    addBook(
      input: {
        title: $title
        year: $year
        description: $description
        authorId: $authorId
      }
    ) {
      book {
        id
        title
        year
        description
        authorId
      }
      errors {
        ... on AuthorNotFoundError {
          message
        }
        ... on InvalidBookYearError {
          message
        }
        ... on InvalidTitleError {
          message
        }
        ... on NotAuthenticatedError {
          message
        }
      }
    }
  }
`;

export const UPDATE_BOOK_STATUS_MUTATION = gql`
  mutation UpdateBookStatus($bookId: Int!, $status: BookStatus!) {
    updateBookStatus(input: { bookId: $bookId, status: $status }) {
      userBook {
        bookId
        status
        userId
      }
      errors {
        ... on BookNotFoundError {
          message
        }
        ... on NotAuthenticatedError {
          message
        }
      }
    }
  }
`;

export const REMOVE_BOOK_FROM_LIBRARY_MUTATION = gql`
  mutation RemoveBookFromLibrary($bookId: Int!) {
    removeBookFromLibrary(input: { bookId: $bookId }) {
      int
      errors {
        ... on BookNotFoundError {
          message
        }
        ... on NotAuthenticatedError {
          message
        }
      }
    }
  }
`;
