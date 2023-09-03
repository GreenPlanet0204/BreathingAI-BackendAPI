import {AuthenticationMethodBindings} from '@authentication/strategies/keys';
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, put, requestBody} from '@loopback/rest';
import {createUuid, UuidNamespaces} from '@services/core';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {ScreenTime} from '@models/browser-extension/types';
import {UserScreenTimeRepository} from '@repositories/browser-extension/user-screentime.repository';

/**
 * @description returns the current date in the format YYYY-MM-DD
 * @returns {string}
 */
export const getCurrentDate = () => {
  return new Date().toISOString().substr(0, 10);
};

@authenticate(AuthenticationMethodBindings.SESSION.key)
export class ScreenTimeController {
  constructor(
    @repository(UserScreenTimeRepository)
    public userColorRepository: UserScreenTimeRepository,
  ) {}

  @get('/screentime/today')
  async findByUserId(
    @inject(SecurityBindings.USER) user: UserProfile,
  ): Promise<{
    [key: string]: ScreenTime;
  }> {
    const currentDate = getCurrentDate();
    const id = createUuid(UuidNamespaces.USER_SCREENTIME, currentDate);
    let userScreentime = await this.userColorRepository.findById(id);

    if (!userScreentime) {
      userScreentime = await this.userColorRepository.create({
        id: createUuid(UuidNamespaces.USER_SCREENTIME, currentDate),
        date: currentDate,
        userId: user.profile.id,
        screenTime: {},
      });
      return {
        [userScreentime.date]: userScreentime.screenTime,
      };
    }

    return {
      [userScreentime.date]: userScreentime.screenTime,
    };
  }

  @put('/screentime')
  async updateByDate(
    @inject(SecurityBindings.USER) user: UserProfile,
    @requestBody()
    {
      screenTime,
      date,
    }: {
      screenTime: ScreenTime;
      date: string;
    },
  ): Promise<{
    [key: string]: ScreenTime;
  }> {
    let userScreentime = await this.userColorRepository.findOne({
      where: {
        date: date,
        userId: user.profile.id,
      },
    });

    if (!userScreentime) {
      userScreentime = await this.userColorRepository.create({
        id: createUuid(UuidNamespaces.USER_SCREENTIME, date),
        date: date,
        userId: user.profile.id,
        screenTime: screenTime,
      });
      return {
        [userScreentime.date]: userScreentime.screenTime,
      };
    }

    const newScreenTime = {
      ...userScreentime,
      screenTime: {
        ...userScreentime.screenTime,
        ...screenTime,
      },
    };

    await this.userColorRepository.updateById(userScreentime.id, newScreenTime);

    return {
      [userScreentime.date]: userScreentime.screenTime,
    };
  }
}
