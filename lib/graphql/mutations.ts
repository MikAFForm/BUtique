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

export const ADD_INTEREST = `
  mutation AddInterest($userId: ID!, $productId: ID!) {
    addInterest(userId: $userId, productId: $productId) {
      message
      liked
    }
  }
`;

export const REMOVE_INTEREST = `
  mutation RemoveInterest($userId: ID!, $productId: ID!) {
    removeInterest(userId: $userId, productId: $productId) {
      message
      liked
    }
  }
`;

export const TOGGLE_INTEREST = `
  mutation ToggleInterest($userId: ID!, $productId: ID!) {
    toggleInterest(userId: $userId, productId: $productId) {
      message
      liked
    }
  }
`;

export const DELETE_PRODUCT = `
  mutation DeleteProduct($productId: ID!) {
    deleteProduct(productId: $productId)
  }
`;

export const UPDATE_PRODUCT = `
  mutation UpdateProduct($productId: ID!, $data: ProductInput!) {
    updateProduct(productId: $productId, data: $data) {
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
      interestedCount
      interestedBuyers {
        userId
        name
      }
    }
  }
`;
