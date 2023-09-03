import {AuthenticationMethodBindings} from '@authentication/strategies/keys';
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {FilterExcludingWhere, repository} from '@loopback/repository';
import {
  param,
  get,
  // getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {User} from '@models/core';
import {UserRepository} from '@repositories/core';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {UserBookmarksRepository} from '@repositories/core/user-bookmarks.repository';

// export type profile = {
//   email: string;
//   password: string;
// };

export interface PassportProfile {
  provider: string;
  id: string;
  displayName: string;
  username?: string | undefined;
  name?:
    | {
        familyName: string;
        givenName: string;
        middleName?: string | undefined;
      }
    | undefined;
  emails?:
    | Array<{
        value: string;
        type?: string | undefined;
      }>
    | undefined;
  photos?:
    | Array<{
        value: string;
      }>
    | undefined;
}

@authenticate(AuthenticationMethodBindings.SESSION.key)
export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,

    @repository(UserBookmarksRepository)
    public userBookmarkRepository: UserBookmarksRepository,
  ) {}

  @get('/me')
  // @response(200, {
  //   description: 'User model instance',
  //   content: {
  //     'application/json': {
  //       schema: getModelSchemaRef(User, {includeRelations: true}),
  //     },
  //   },
  // })
  async me(
    @inject(SecurityBindings.USER) user: UserProfile,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    return user.profile;
  }

  @get('/users/{id}')
  // @response(200, {
  //   description: 'User model instance',
  //   content: {
  //     'application/json': {
  //       schema: getModelSchemaRef(User, {includeRelations: true}),
  //     },
  //   },
  // })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    // @requestBody({
    //   content: {
    //     'application/json': {
    //       schema: getModelSchemaRef(User, {partial: true}),
    //     },
    //   },
    // })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }

  @get('/user/bookmarks')
  async getUserBookmarks(@inject(SecurityBindings.USER) user: UserProfile) {
    let userBookmarks = await this.userBookmarkRepository.findOne({
      where: {
        userId: user.profile.id,
      },
    });
    if (!userBookmarks) {
      userBookmarks = await this.userBookmarkRepository.create({
        userId: user.profile.id,
        contentIds: [],
      });
    }

    return {bookmarks: userBookmarks.contentIds};
  }

  @put('/user/bookmarks')
  async upsateUserBookmarks(
    @inject(SecurityBindings.USER) user: UserProfile,
    @requestBody() body: {bookmarks: string[]},
  ) {
    let userBookmarks = await this.userBookmarkRepository.findOne({
      where: {
        userId: user.profile.id,
      },
    });

    if (!userBookmarks) {
      userBookmarks = await this.userBookmarkRepository.create({
        userId: user.profile.id,
        contentIds: body.bookmarks,
      });
    }

    const newUserBookmarks = {
      ...userBookmarks,
      contentIds: body.bookmarks,
    };

    await this.userBookmarkRepository.updateById(
      userBookmarks.id,
      newUserBookmarks,
    );

    return {bookmarks: userBookmarks.contentIds};
  }
}
