import {AuthenticationMethodBindings} from '@authentication/strategies/keys';
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import {
  ContentRepository,
  ImprovemnetEventRepository,
  UserImprovementsRepository,
} from '@repositories/core';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {DeviceTypes} from '@models/core';
import {UuidNamespaces, createUuid} from '@services/core';

@authenticate(AuthenticationMethodBindings.SESSION.key)
export class BrowserExtensionEvents {
  constructor(
    @repository(ContentRepository)
    public contentRepository: ContentRepository,
    @repository(ImprovemnetEventRepository)
    public imrpovementEventRepository: ImprovemnetEventRepository,
    @repository(UserImprovementsRepository)
    public userImprovementsRepository: UserImprovementsRepository,
  ) {}

  @post('/browser-extension/event/break')

  // @response(200, {
  //   description: 'User model instance',
  //   content: {
  //     'application/json': {
  //       schema: getModelSchemaRef(User, {includeRelations: true}),
  //     },
  //   },
  // })
  async createEvent(
    @inject(SecurityBindings.USER) user: UserProfile,
    @requestBody({
      description: 'Break Event',
      required: true,
    })
    event: {
      contentUrl: string;
      completed: boolean;
      rating: number;
      lang: string;
    },
  ): Promise<void> {
    try {
      let userImprovements = await this.userImprovementsRepository.findOne({
        where: {
          userId: user.profile.id,
        },
      });

      if (!userImprovements) {
        userImprovements = await this.userImprovementsRepository.create({
          id: createUuid(UuidNamespaces.USER_IMPROVEMENTS, user.profile.id),
          userId: user.profile.id,
        });
      }

      const contentId = createUuid(UuidNamespaces.CONTENT, event.contentUrl);

      // let content = await this.contentRepository.find({
      //   where: {
      //     file: {
      //       url: event.contentUrl,
      //     },
      //   },
      // });

      // if (!content) {
      //   content = await this.contentRepository.create({
      //     id: contentId,
      //     file: {
      //       url: event.contentUrl,
      //     },
      //     language: event.lang,
      //   });
      // }

      await this.imrpovementEventRepository.create({
        userImprovementId: userImprovements.id,
        contentIds: [contentId],
        device: DeviceTypes.BROWSER_EXTENSION,
        completed: event.completed,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
