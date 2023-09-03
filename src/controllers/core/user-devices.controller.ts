import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {UserDevices} from '../../models/core';
import {UserDevicesRepository} from '../../repositories/core';
import {AuthenticationMethodBindings} from '@authentication/strategies/keys';
import {authenticate} from '@loopback/authentication';

@authenticate(AuthenticationMethodBindings.SESSION.key)
export class UserDevicesController {
  constructor(
    @repository(UserDevicesRepository)
    public userDevicesRepository: UserDevicesRepository,
  ) {}

  @post('/user-devices')
  @response(200, {
    description: 'UserDevices model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserDevices)}},
  })
  async create(
    // @requestBody({
    //   content: {
    //     'application/json': {
    //       schema: getModelSchemaRef(UserDevices, {
    //         title: 'NewUserDevices',
    //         exclude: ['id'],
    //       }),
    //     },
    //   },
    // })
    userDevices: Omit<UserDevices, 'id'>,
  ): Promise<UserDevices> {
    return this.userDevicesRepository.create(userDevices);
  }

  @get('/user-devices/count')
  @response(200, {
    description: 'UserDevices model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UserDevices) where?: Where<UserDevices>,
  ): Promise<Count> {
    return this.userDevicesRepository.count(where);
  }

  @get('/user-devices')
  // @response(200, {
  //   description: 'Array of UserDevices model instances',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(UserDevices, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })
  async find(
    @param.filter(UserDevices) filter?: Filter<UserDevices>,
  ): Promise<UserDevices[]> {
    return this.userDevicesRepository.find(filter);
  }

  @patch('/user-devices')
  @response(200, {
    description: 'UserDevices PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    // @requestBody({
    //   content: {
    //     'application/json': {
    //       schema: getModelSchemaRef(UserDevices, {partial: true}),
    //     },
    //   },
    // })
    userDevices: UserDevices,
    @param.where(UserDevices) where?: Where<UserDevices>,
  ): Promise<Count> {
    return this.userDevicesRepository.updateAll(userDevices, where);
  }

  @get('/user-devices/{id}')
  // @response(200, {
  //   description: 'UserDevices model instance',
  //   content: {
  //     'application/json': {
  //       schema: getModelSchemaRef(UserDevices, {includeRelations: true}),
  //     },
  //   },
  // })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(UserDevices, {exclude: 'where'})
    filter?: FilterExcludingWhere<UserDevices>,
  ): Promise<UserDevices> {
    return this.userDevicesRepository.findById(id, filter);
  }

  @patch('/user-devices/{id}')
  @response(204, {
    description: 'UserDevices PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    // @requestBody({
    //   content: {
    //     'application/json': {
    //       schema: getModelSchemaRef(UserDevices, {partial: true}),
    //     },
    //   },
    // })
    userDevices: UserDevices,
  ): Promise<void> {
    await this.userDevicesRepository.updateById(id, userDevices);
  }

  @put('/user-devices/{id}')
  @response(204, {
    description: 'UserDevices PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() userDevices: UserDevices,
  ): Promise<void> {
    await this.userDevicesRepository.replaceById(id, userDevices);
  }

  @del('/user-devices/{id}')
  @response(204, {
    description: 'UserDevices DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userDevicesRepository.deleteById(id);
  }
}
