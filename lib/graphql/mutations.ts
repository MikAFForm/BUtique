// GraphQL mutation strings

export const CREATE_USER = `
  mutation CreateUser($name: String!, $email: String!, $password: String!) {
    createUser(name: $name, email: $email, password: $password) {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`;

export const LOGIN_USER = `
    mutation LoginUser($email: String!, $password: String!) {
      loginUser(email: $email, password: $password) {
        success
        message
        user {
          id
          name
          email
          createdAt
          updatedAt
        }
      }
    }
  `;


  
export const CREATE_PRODUCT = `
  mutation CreateProduct($data: ProductInput!) {
    createProduct(data: $data) {
      id
      name
      price
      condition
      status
      category
      description
      location
      sellerId
      sellerName
      createdAt
      updatedAt
      imageUrls
      hashtags
    }
  }
`;

export const SEND_MESSAGE = `
  mutation SendMessage($sessionId: ID!, $senderId: ID!, $body: String!) {
    sendMessage(sessionId: $sessionId, senderId: $senderId, body: $body) {
      id
      sessionId
      senderId
      body
      createdAt
    }
  }
`;
