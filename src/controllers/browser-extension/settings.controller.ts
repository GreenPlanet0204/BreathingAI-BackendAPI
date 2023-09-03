import {AuthenticationMethodBindings} from '@authentication/strategies/keys';
import {repository} from '@loopback/repository';
import {get, response, put, requestBody} from '@loopback/rest';
import {authenticate} from '@loopback/authentication';
import {
  SoundsSettings,
  initialAppSettingsState,
  initialBreaksSettingsState,
  initialColorsSettingsState,
  ColorsSettings,
  BreaksSettings,
  AppSettings,
  initialSoundSettingsState,
} from '@models/browser-extension/types';
import {ExtensionSettingsRepository} from '@repositories/browser-extension/index';
import {ExtensionSettings} from '@models/browser-extension';
import {inject} from '@loopback/core';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {createUuid, UuidNamespaces} from '@services/core';
//@todo use @inject(SecurityBindings.USER) user: UserProfile,

@authenticate(AuthenticationMethodBindings.SESSION.key)
export class SettingsController {
  constructor(
    @repository(ExtensionSettingsRepository)
    public extensionSettingsRepository: ExtensionSettingsRepository,
  ) {}

  @get('/browser-extension/sounds-settings')
  @response(200, {})
  async getSoundsSttings(
    @inject(SecurityBindings.USER) user: UserProfile,
  ): Promise<SoundsSettings> {
    const extensionSettings = await this.getOrCreateInitialSettings(
      user.profile.id,
    );
    return extensionSettings.sounds;
  }

  @put('/browser-extension/sounds-settings')
  @response(204, {})
  async updateSoundsSettings(
    @inject(SecurityBindings.USER) user: UserProfile,
    @requestBody() settings: SoundsSettings,
  ): Promise<SoundsSettings> {
    const extensionSettings = await this.getOrCreateInitialSettings(
      user.profile.id,
    );

    const newSettings = new ExtensionSettings({
      ...extensionSettings,
      sounds: settings,
    });

    await this.extensionSettingsRepository.update(newSettings, {
      where: {
        userId: user.profile.id,
      },
    });
    return newSettings.sounds;
  }

  @get('/browser-extension/colors-settings')
  @response(200, {})
  async getColorsSettings(
    @inject(SecurityBindings.USER) user: UserProfile,
  ): Promise<ColorsSettings> {
    const extensionSettings = await this.getOrCreateInitialSettings(
      user.profile.id,
    );

    return extensionSettings.colors;
  }

  @put('/browser-extension/colors-settings')
  @response(204, {})
  async updateColorsSettings(
    @inject(SecurityBindings.USER) user: UserProfile,
    @requestBody() settings: ColorsSettings,
  ): Promise<ColorsSettings> {
    const extensionSettings = await this.getOrCreateInitialSettings(
      user.profile.id,
    );
    const newSettings = new ExtensionSettings({
      ...extensionSettings,
      colors: settings,
    });

    await this.extensionSettingsRepository.update(newSettings, {
      where: {
        userId: user.profile.id,
      },
    });
    return newSettings.colors;
  }

  @get('/browser-extension/breaks-settings')
  @response(200, {})
  async getBreaksSettings(
    @inject(SecurityBindings.USER) user: UserProfile,
  ): Promise<BreaksSettings> {
    const extensionSettings = await this.getOrCreateInitialSettings(
      user.profile.id,
    );
    return extensionSettings.breaks;
  }

  @put('/browser-extension/breaks-settings')
  @response(204, {})
  async updateBreaksSettings(
    @inject(SecurityBindings.USER) user: UserProfile,
    @requestBody() settings: BreaksSettings,
  ): Promise<BreaksSettings> {
    const extensionSettings = await this.getOrCreateInitialSettings(
      user.profile.id,
    );
    const newSettings = new ExtensionSettings({
      ...extensionSettings,
      breaks: settings,
    });

    await this.extensionSettingsRepository.update(newSettings, {
      where: {
        userId: user.profile.id,
      },
    });
    return newSettings.breaks;
  }

  @get('/browser-extension/app-settings')
  @response(200, {})
  async getAppSettings(
    @inject(SecurityBindings.USER) user: UserProfile,
  ): Promise<AppSettings> {
    const extensionSettings = await this.getOrCreateInitialSettings(
      user.profile.id,
    );

    return extensionSettings.app;
  }

  @put('/browser-extension/app-settings')
  @response(204, {})
  async updateAppSettings(
    @inject(SecurityBindings.USER) user: UserProfile,
    @requestBody() settings: AppSettings,
  ): Promise<AppSettings> {
    const extensionSettings = await this.getOrCreateInitialSettings(
      user.profile.id,
    );

    const newSettings = new ExtensionSettings({
      ...extensionSettings,
      app: settings,
    });

    await this.extensionSettingsRepository.update(newSettings, {
      where: {
        userId: user.profile.id,
      },
    });

    return newSettings.app;
  }

  async getOrCreateInitialSettings(userId: string) {
    const id = createUuid(UuidNamespaces.USER_SETTINGS, userId);
    let extensionSettings;
    try {
      extensionSettings = await this.extensionSettingsRepository.findById(id);
    } catch (err) {
      if (err.code !== 'ENTITY_NOT_FOUND') {
        throw err;
      }
    }
    if (!extensionSettings) {
      extensionSettings = await this.extensionSettingsRepository.create({
        id,
        userId: userId,
        app: initialAppSettingsState,
        breaks: initialBreaksSettingsState,
        colors: initialColorsSettingsState,
        sounds: initialSoundSettingsState,
      });
    }
    return extensionSettings;
  }
}
