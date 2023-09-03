import {AuthenticationMethodBindings} from '@authentication/strategies/keys';
import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  // getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {UserVitals} from '@models/core';
import {UserRepository, UserVitalsRepository} from '@repositories/core';

@authenticate(AuthenticationMethodBindings.SESSION.key)
export class UserVitalsController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserVitalsRepository)
    public userVitalsRepository: UserVitalsRepository,
  ) {}

  @post('/user-vitals')
  @response(200, {
    description: 'UserVitals model instance',
    // content: {'application/json': {schema: getModelSchemaRef(UserVitals)}},
  })
  async create(
    // @requestBody({
    //   content: {
    //     'application/json': {
    //       schema: getModelSchemaRef(UserVitals, {
    //         title: 'NewUserVitals',
    //         exclude: ['id'],
    //       }),
    //     },
    //   },
    // })
    userVitals: Omit<UserVitals, 'id'>,
  ): Promise<UserVitals> {
    return this.userVitalsRepository.create(userVitals);
  }

  @get('/user-vitals/count')
  @response(200, {
    description: 'UserVitals model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UserVitals) where?: Where<UserVitals>,
  ): Promise<Count> {
    return this.userVitalsRepository.count(where);
  }

  @patch('/user-vitals')
  @response(200, {
    description: 'UserVitals PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    // @requestBody({
    //   content: {
    //     'application/json': {
    //       schema: getModelSchemaRef(UserVitals, {partial: true}),
    //     },
    //   },
    // })
    userVitals: UserVitals,
    @param.where(UserVitals) where?: Where<UserVitals>,
  ): Promise<Count> {
    return this.userVitalsRepository.updateAll(userVitals, where);
  }

  @get('/user-vitals/{id}')
  // @response(200, {
  //   description: 'UserVitals model instance',
  //   content: {
  //     'application/json': {
  //       schema: getModelSchemaRef(UserVitals, {includeRelations: true}),
  //     },
  //   },
  // })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(UserVitals, {exclude: 'where'})
    filter?: FilterExcludingWhere<UserVitals>,
  ): Promise<UserVitals> {
    return this.userVitalsRepository.findById(id, filter);
  }

  @patch('/user-vitals/{id}')
  @response(204, {
    description: 'UserVitals PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    // @requestBody({
    //   content: {
    //     'application/json': {
    //       schema: getModelSchemaRef(UserVitals, {partial: true}),
    //     },
    //   },
    // })
    userVitals: UserVitals,
  ): Promise<void> {
    await this.userVitalsRepository.updateById(id, userVitals);
  }

  @put('/user-vitals/{id}')
  @response(204, {
    description: 'UserVitals PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() userVitals: UserVitals,
  ): Promise<void> {
    await this.userVitalsRepository.replaceById(id, userVitals);
  }

  @del('/user-vitals/{id}')
  @response(204, {
    description: 'UserVitals DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userVitalsRepository.deleteById(id);
  }
}
