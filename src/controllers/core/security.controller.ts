import {AuthenticationMethodBindings} from '@authentication/strategies/keys';
import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  HttpErrors,
  post,
  requestBody,
  Request,
  Response,
  RestBindings,
  SchemaObject,
  put,
  param,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {TokenPurposes} from '@models/core';
import {
  UserRepository,
  UserCredentialsRepository,
  UserIdentityRepository,
  SubscriptionRepository,
  CustomerRepository,
  UserTokenRepository,
} from '@repositories/core';

import {
  PasswordService,
  PaymentService,
  createUuid,
  UuidNamespaces,
  EmailService,
  IEmail,
  UserService,
} from '@services/core';

export type Credentials = {
  email: string;
  password: string;
};

export type ChangePassword = {
  oldPassword: string;
  newPassword: string;
};

export type SignUp = Credentials & {
  companyName?: string;
  firstName: string;
  lastName: string;
};

export type Account = Credentials & {
  firstName: string;
  lastName: string;
  jobTitle: string;
  workEmail: string;
};

export type Company = Credentials & {
  companyName: string;
  website: string;
  seats: number;
  industry: string;
  country: string;
  phoneNumber: number;
  language: string;
  email: string;
};

export type UpdateData = Credentials & {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phoneNumber: number;
  language: string;
};

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
    },
  },
};

const ChangePaswwordSchema: SchemaObject = {
  type: 'object',
  required: ['oldPassword', 'newPassword'],
  properties: {
    oldPassword: {
      type: 'string',
      minLength: 8,
    },
    newPassword: {
      type: 'string',
      minLength: 8,
    },
  },
};

const SignupShema: SchemaObject = {
  type: 'object',
  required: ['firstName', 'lastName', 'email', 'password'],
  properties: {
    companyName: {
      type: 'string',
    },
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

const accountSchema: SchemaObject = {
  type: 'object',
  required: ['firstName', 'lastName', 'jobTitle', 'email', 'password'],
  properties: {
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    jobTitle: {
      type: 'string',
    },
    workEmail: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

const companySchema: SchemaObject = {
  type: 'object',
  required: ['companyName', 'website', 'seats', 'industry', 'country'],
  properties: {
    companyName: {
      type: 'string',
    },
    website: {
      type: 'string',
    },
    seats: {
      type: 'number',
    },
    industry: {
      type: 'string',
    },
    country: {
      type: 'string',
    },
  },
};

const emailSchema: SchemaObject = {
  type: 'object',
  properties: {
    name: {type: 'string'},
    email: {type: 'string', format: 'email'},
  },
  required: ['name', 'email'],
};

const UpdateDataSchema: SchemaObject = {
  type: 'object',
  required: [
    'firstName',
    'lastName',
    'email',
    'companyName',
    'phone-number',
    'language',
  ],
  properties: {
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
    email: {
      type: 'string',
      format: 'email',
    },
    companyName: {
      type: 'string',
    },
    phoneNumber: {
      type: 'string',
    },
    language: {
      type: 'string',
    },
  },
};

export class SecurityController {
  constructor(
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserTokenRepository)
    public userTokenRepository: UserTokenRepository,
    @repository(UserCredentialsRepository)
    public userCredentialsRepository: UserCredentialsRepository,
    @repository(UserIdentityRepository)
    public userIdentityRepository: UserIdentityRepository,
    @repository(SubscriptionRepository)
    public subscriptionRepositrory: SubscriptionRepository,
    @service(PasswordService)
    public passwordService: PasswordService,
    @service(PaymentService)
    public paymentService: PaymentService,
    @service(EmailService)
    public emailService: EmailService,
    @service(UserService)
    public userService: UserService,
  ) {}

  @post('/signup')
  async signup(
    @requestBody({
      description: 'signup user locally',
      required: true,
      content: {
        'application/json': {schema: SignupShema},
      },
    })
    credentials: SignUp,
  ) {
    const {customer, user} = await this.userService.createAccount({
      email: credentials.email,
      companyName: credentials.companyName,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      password: credentials.password,
    });

    return {
      status: 200,
      message: 'User created succsuefully',
      customer,
      user,
    };
  }

  @authenticate(AuthenticationMethodBindings.LOCAL.key)
  @post('/login', {
    responses: {
      '200': {},
    },
  })
  async login(
    @requestBody({
      description: 'login to create a user session',
      required: true,
      content: {
        'application/json': {schema: CredentialsSchema},
      },
    })
    credentials: Credentials,
    @inject(SecurityBindings.USER) user: UserProfile,
    @inject(RestBindings.Http.REQUEST) request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    return {
      token: user[securityId],
    };
  }

  @authenticate(AuthenticationMethodBindings.SESSION.key)
  @put('/password', {
    responses: {
      '200': {},
    },
  })
  async passwordChange(
    @inject(SecurityBindings.USER) user: UserProfile,
    @requestBody({
      description: 'Change password',
      required: true,
      content: {
        'application/json': {
          schema: ChangePaswwordSchema,
        },
      },
    })
    {oldPassword, newPassword}: ChangePassword,
  ) {
    try {
      if (!user.email) throw new Error('Invalid user');
      const userCredentials = await this.userCredentialsRepository.findById(
        user.email.toLowerCase(),
      );

      if (!userCredentials.password)
        throw new Error('No password was set for this user');
      const hashedOldPassword = await this.passwordService.encryptPassword(
        oldPassword,
      );

      if (userCredentials.password !== hashedOldPassword)
        throw new Error('Wrong passwod');

      const hashedNewPassword = await this.passwordService.encryptPassword(
        newPassword,
      );

      await this.userCredentialsRepository.updateById(userCredentials.id, {
        password: hashedNewPassword,
      });
      return {
        status: 200,
        message: 'Password change succsuefull',
      };
    } catch (err) {
      if (err.code !== 'ENTITY_NOT_FOUND') {
        throw err;
      }
    }
  }

  @authenticate(AuthenticationMethodBindings.BASIC.key)
  @get('/profiles')
  async getExternalProfiles(
    @inject(SecurityBindings.USER) profile: UserProfile,
  ) {
    const user = await this.userRepository.findById(profile[securityId], {
      include: ['profiles'],
    });
    return user.profiles;
  }

  @post('/forgot-password')
  async requestForgotPassword({email}: {email: string}) {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new HttpErrors[404]('User does not exists');
    }

    const token = await this.userTokenRepository.create({
      token: createUuid(UuidNamespaces.USER_TOKEN, email),
      userId: user.id,
      purpose: TokenPurposes.PASSWRD_RESET,
    });

    await this.emailService.sendMail({
      from: 'info@breathing.ai',
      to: email,
      subject: 'breathing ai password forgot password',
      html: `
      <html>
        <head></head>
        <body>
        <a href="https://platform.breathing.ai/password-reset/${token}/${email}" target="_blank">Reset Password</a>
        </body>
      </html>
      `,
    });
  }

  @post('/rest-password')
  async resetPassword({token, password}: {token: string; password: string}) {
    const verifiedToken = await this.userTokenRepository.findOne({
      where: {
        token,
      },
    });

    if (!verifiedToken) {
      throw new HttpErrors[404]('Token expired');
    }

    const user = await this.userRepository.findOne({
      where: {
        id: verifiedToken.userId,
      },
    });
    if (!user) {
      throw new HttpErrors[404]('User does not exists');
    }
    const hashedPassword = await this.passwordService.encryptPassword(password);

    const userCredentials = await this.userCredentialsRepository.findById(
      user.email.toLowerCase(),
    );

    if (!userCredentials) {
      await this.userCredentialsRepository.create({
        id: user.email.toLowerCase(),
        password: hashedPassword,
      });
    } else {
      await this.userCredentialsRepository.updateById(userCredentials.id, {
        password: hashedPassword,
      });
    }
    return {
      status: 200,
      message: 'Password change succsuefull',
    };
  }

  @get('/verify-email/{token}')
  async verifyEmail(@param.path.string('token') token: string) {
    const verfiyToken = await this.userTokenRepository.findOne({
      where: {
        token: token,
      },
    });


    if (!verfiyToken) {
      throw new HttpErrors[404]('Token expired');
    }

    await this.userRepository.updateById(verfiyToken?.userId, {
      verificationToken: token,
      emailVerified: true,
    });
    return {
      status: 200,
      message: 'User email verified',
    };
  }

  @post('/account-details')
  async accountDetails(
    @requestBody({
      description: 'create a new account',
      required: true,
      content: {
        'application/json': {schema: accountSchema},
      },
    })
    credentials: Account,
  ) {
    const {customer, user} = await this.userService.createB2BAccount({
      email: credentials.email,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      password: credentials.password,
    });

    return {
      status: 200,
      message: 'account created successfully',
      customer,
      user,
    };
  }

  @post('/company-details/{customerId}')
  async createCompany(
    @param.path.string('customerId') customerId: string,
    @requestBody({
      description: 'Add company',
      required: true,
      content: {
        'application/json': {schema: companySchema},
      },
    })
    credential: Company,
  ) {
    // Check if a company with the same ID already exists
    const existingCompany = await this.customerRepository.findOne({
      where: {
        id: customerId,
      },
    });

    if (!existingCompany) {
      // If the company already exists, we will return a 409 Conflict error
      return {
        status: 404,
        message: 'Company does not exists',
      };
    }

    // Create a new company using the provided details
    const company = await this.customerRepository.updateById(customerId, {
      companyName: credential.companyName,
      info: {
        seats: credential.seats,
        website: credential.website,
        industry: credential.industry,
        country: credential.country,
      },
    });
    return {
      status: 200,
      message: 'Company created successfully',
      company: company,
    };
  }

  @authenticate(AuthenticationMethodBindings.SESSION.key)
  @post('/inviteUser-by-email')
  async sendInvitation(
    @requestBody({
      description: 'Send email invitation',
      required: true,
      content: {
        'application/json': {schema: emailSchema},
      },
    })
    credentials: {
      name: string;
      email: string;
    },
  ): Promise<object> {
    // Prepare the email object
    const emailObj: IEmail = {
      from: 'info@breathing.ai',
      to: credentials.email,
      subject: 'Invitation from breathing ai',
      html: `<p>Hello ${credentials.name}, you have been invited to join the platform.</p>`,
    };
    // Send the invitation email
    try {
      const result = await this.emailService.sendMail(emailObj);
      return {
        status: 200,
        message: 'Invitation sent successfully',
        result,
      };
    } catch (error) {
      console.error(
        'Failed to send invitation email:>>>>>>><<<>><>><<>>',
        error,
      );
      throw new Error('Failed to send invitation email');
    }
  }

  @authenticate(AuthenticationMethodBindings.SESSION.key)
  @put('/update-user-and-company/{userid}/{companyid}')
  async updateUserAndCompany(
    @param.path.string('userid') userid: string,
    @param.path.string('companyid') companyid: string,
    @requestBody({
      description: 'Update user and company',
      required: true,
      content: {
        'application/json': {schema: UpdateDataSchema},
      },
    })
    credentials: UpdateData,
  ): Promise<unknown> {
    const {firstName, lastName, email, companyName, phoneNumber, language} =
      credentials;

    // Update the user account
    const updatedAccount = await this.userRepository.updateById(userid, {
      firstName,
      lastName,
      email,
    });

    // Update the company
    const updatedCompany = await this.customerRepository.updateById(companyid, {
      companyName,
      phoneNumber,
      language,
      email,
      b2b: true,
    });

    return {
      status: 200,
      message: 'User and Company updated successfully',
      account: updatedAccount,
      company: updatedCompany,
    };
  }
}
