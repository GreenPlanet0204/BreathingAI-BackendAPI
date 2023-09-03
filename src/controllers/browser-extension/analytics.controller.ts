import {AuthenticationMethodBindings} from '@authentication/strategies/keys';
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {
  ImprovemnetEventRepository,
  UserImprovementsRepository,
} from '@repositories/core';

@authenticate(AuthenticationMethodBindings.SESSION.key)
export class AnalyticsController {
  constructor(
    @repository('UserImprovementsRepository')
    public userImprovementsRepository: UserImprovementsRepository,
    @repository('ImprovemnetEventRepository')
    public imrpovementEventRepository: ImprovemnetEventRepository,
  ) {}

  @get('/browser-extension/analytics')

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
  ): Promise<{}> {
    const userImprovements = await this.userImprovementsRepository.findOne({
      where: {
        userId: user.profile.id,
      },
    });

    const events = await this.imrpovementEventRepository.find({
      where: {
        userImprovementId: userImprovements?.id,
      },
    });
    return {
      totalBreaks: events?.length,
    };
  }
}
