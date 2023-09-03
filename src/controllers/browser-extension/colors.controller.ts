import {AuthenticationMethodBindings} from '@authentication/strategies/keys';
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, put, requestBody} from '@loopback/rest';
import {UserColorRepository} from '@repositories/core';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {fallBackColorsArray} from '@models/browser-extension/types';

@authenticate(AuthenticationMethodBindings.SESSION.key)
export class ColorsController {
  constructor(
    @repository(UserColorRepository)
    public userColorRepository: UserColorRepository,
  ) {}

  @get('/colors')

  // @response(200, {
  //   description: 'User model instance',
  //   content: {
  //     'application/json': {
  //       schema: getModelSchemaRef(User, {includeRelations: true}),
  //     },
  //   },
  // })
  async findByUserId(
    @inject(SecurityBindings.USER) user: UserProfile,
  ): Promise<{
    colors: string[];
  }> {
    let usersColors = await this.userColorRepository.findOne({
      where: {
        userId: user.profile.id,
      },
      order: ['modifiedOn DESC'],
    });
    if (!usersColors) {
      usersColors = await this.userColorRepository.create({
        userId: user.profile.id,
        colors: fallBackColorsArray,
      });
      return {
        colors: usersColors.colors,
      };
    }

    return {
      colors: usersColors.colors,
    };
  }

  @put('/colors')

  // @response(200, {
  //   description: 'User model instance',
  //   content: {
  //     'application/json': {
  //       schema: getModelSchemaRef(User, {includeRelations: true}),
  //     },
  //   },
  // })
  async updateById(
    @inject(SecurityBindings.USER) user: UserProfile,
    @requestBody() {newColors}: {newColors: string[]},
  ): Promise<{
    colors: string[];
  }> {
    let usersColors = await this.userColorRepository.findOne({
      where: {
        userId: user.profile.id,
      },
    });

    if (!usersColors) {
      usersColors = await this.userColorRepository.create({
        userId: user.profile.id,
        colors: newColors,
      });
      return {
        colors: usersColors.colors,
      };
    }

    const newUserColors = {
      ...usersColors,
      colors: newColors,
    };

    await this.userColorRepository.updateById(usersColors.id, newUserColors);

    return {
      colors: usersColors.colors,
    };
  }
}
