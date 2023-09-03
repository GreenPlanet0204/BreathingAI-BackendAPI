import {injectable, BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {UserRepository} from '@repositories/core';
import Turn from 'node-turn';

@injectable({scope: BindingScope.SINGLETON})
class TurnServer {
  username: string;
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  async createServer(username: string): Promise<Turn> {
    const user = await this.userRepository.find({
      where: {
        username: username,
      },
    });

    if (!user) throw Error('User doesnt exist');

    const trunServer = new Turn({
      credentials: {
        username: username,
      },
    });

    return trunServer;
  }
}

export default TurnServer;
