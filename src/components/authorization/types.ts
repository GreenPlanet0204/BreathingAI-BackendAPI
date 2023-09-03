export const enum PermissionKey {
  // Super Admin
  ADMIN = 'admin',

  // user with the ability to create content and creator profile
  CREATOR = 'creator',

  // managing entity of users (usually a company or managing entity of users)
  AGENT = 'agent',

  // User - Default User
  USER = 'user',

  // Feed - for third party services
  FEED = 'feed',
}
