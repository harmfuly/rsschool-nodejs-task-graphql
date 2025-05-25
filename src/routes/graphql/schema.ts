import { buildSchema } from 'graphql';

export const schema = buildSchema(`
  schema {
    query: RootQueryType
    mutation: Mutations
  }

  enum MemberTypeId {
    BASIC
    BUSINESS
  }

  input ChangePostInput {
    title: String
    content: String
  }

  input ChangeProfileInput {
    isMale: Boolean
    yearOfBirth: Int
    memberTypeId: MemberTypeId
  }

  input ChangeUserInput {
    name: String
    balance: Float
  }

  input CreatePostInput {
    title: String!
    content: String!
    authorId: String!
  }

  input CreateProfileInput {
    isMale: Boolean!
    yearOfBirth: Int!
    userId: String!
    memberTypeId: MemberTypeId!
  }

  input CreateUserInput {
    name: String!
    balance: Float!
  }

  type MemberType {
    id: MemberTypeId!
    discount: Float!
    postsLimitPerMonth: Int!
  }

  type Post {
    id: String!
    title: String!
    content: String!
  }

  type Profile {
    id: String!
    isMale: Boolean!
    yearOfBirth: Int!
    memberType: MemberType!
  }

  type User {
    id: String!
    name: String!
    balance: Float!
    profile: Profile
    posts: [Post!]!
    userSubscribedTo: [User!]!
    subscribedToUser: [User!]!
  }

  type RootQueryType {
    memberTypes: [MemberType!]!
    memberType(id: MemberTypeId!): MemberType
    users: [User!]!
    user(id: String!): User
    posts: [Post!]!
    post(id: String!): Post
    profiles: [Profile!]!
    profile(id: String!): Profile
  }

  type Mutations {
    createUser(dto: CreateUserInput!): User!
    createProfile(dto: CreateProfileInput!): Profile!
    createPost(dto: CreatePostInput!): Post!
    changePost(id: String!, dto: ChangePostInput!): Post!
    changeProfile(id: String!, dto: ChangeProfileInput!): Profile!
    changeUser(id: String!, dto: ChangeUserInput!): User!
    deleteUser(id: String!): String!
    deletePost(id: String!): String!
    deleteProfile(id: String!): String!
    subscribeTo(userId: String!, authorId: String!): String!
    unsubscribeFrom(userId: String!, authorId: String!): String!
  }
`);