import { gql } from '@apollo/client';

export const AUTHENTICATE = gql`
  mutation Authenticate($credentials: AuthenticateInput!) {
    authenticate(credentials: $credentials) {
      accessToken
    }
  }
`;

export const SUBMIT_REVIEW = gql`
  mutation CreateReview($review: CreateReviewInput!)
  {
    createReview(review: $review) {
      user {
        username
      }
      repository {
        name
      }
      rating  
      text
      repositoryId
    }
  }
`;