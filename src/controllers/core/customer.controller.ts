import {AuthenticationMethodBindings} from '@authentication/strategies/keys';
import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {FilterExcludingWhere, repository} from '@loopback/repository';
import {
  param,
  get,
  post,
  requestBody,
  SchemaObject,
  HttpErrors,
} from '@loopback/rest';
import {Customer, CustomerRelations, User, UserRelations} from '@models/core';
import {CustomerRepository, UserRepository} from '@repositories/core';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {UserBookmarksRepository} from '@repositories/core/user-bookmarks.repository';
import {UserService} from '../../services/user.service';

export type AddUserToCustomer = {
  users: Array<{
    firstName: string;
    lastName: string;
    email: string;
    department: string;
  }>;
};

const AddUsersToCustomerShema: SchemaObject = {
  type: 'object',
  required: ['users'],
  properties: {
    users: {
      type: 'array',
    },
  },
};

@authenticate(AuthenticationMethodBindings.SESSION.key)
export class CustomerController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,

    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,

    @repository(UserBookmarksRepository)
    public userBookmarkRepository: UserBookmarksRepository,
    @service(UserService)
    public userService: UserService,
  ) {}

  @get('customer')
  async getCustomer(@inject(SecurityBindings.USER) user: UserProfile): Promise<{
    customer: Customer & CustomerRelations;
  }> {
    if (user.profile.customerId) {
      const customer = await this.customerRepository.findById(
        user.profile.customerId,
      );

      return {
        customer,
      };
    }

    return user.profile;
  }

  @get('customer/users')
  async customerUsers(
    @inject(SecurityBindings.USER) user: UserProfile,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<{
    users: (User & UserRelations)[];
  }> {
    if (user.profile.customerId) {
      const users = await this.userRepository.find({
        where: {
          customerId: user.profile.customerId,
        },
      });

      return {
        users,
      };
    }

    return user.profile;
  }

  @post('customer/add-users')
  async addUsersToCustomer(
    @inject(SecurityBindings.USER) user: UserProfile,
    @requestBody({
      description: 'Change password',
      required: true,
      content: {
        'application/json': {
          schema: AddUsersToCustomerShema,
        },
      },
    })
    body: AddUserToCustomer,
  ): Promise<unknown> {
    const allEmails = body.users.map(userToAdd => userToAdd.email);
    if (user.profile.customerId) {
      const usersThatAleadyExist = await this.userRepository.find({
        where: {
          email: {
            inq: allEmails,
          },
        },
      });

      if (usersThatAleadyExist.length > 0) {
        console.log(usersThatAleadyExist);
        throw new HttpErrors[409](
          `Conflict: Users already exist ${usersThatAleadyExist.map(
            u => `${u.email}, `,
          )}`,
        );
      }

      body.users.map(async userToDB => {
        await this.userService.addUserToCustomer(
          {
            email: userToDB.email,
            firstName: userToDB.firstName,
            lastName: userToDB.lastName,
            department: userToDB.department,
          },
          user.profile.customerId,
        );
      });

      return {
        status: 200,
        message: 'Users added succesfully',
      };
    }
  }
}
