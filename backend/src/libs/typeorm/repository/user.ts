import { User } from '../../../domain/user-entity';
import { DataSource, Repository, FindOneOptions } from 'typeorm';
import { IUserWithVerificationCode } from '../../../interfaces/user';

export class UserRepository extends Repository<User> {
    constructor(dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async findOneByFilter(filter: Partial<User>): Promise<User | null> {
        return this.findOne({ where: filter });
    }

    async findUserVerificationCodes(user_id: string): Promise<IUserWithVerificationCode | null> {
        const options: FindOneOptions<User> = { where: { id: user_id }, relations: ['verificationCodes'] };
        const user = await this.findOne(options);
        if (!user) {
            return null;
        }
        const userVerificationCodes = {
            id: user.id,
            codes: user.verificationCodes
        };

        return userVerificationCodes;
    }

    async updateUserToActive(user_id: string): Promise<User | null> {
        const userToUpdate = await this.findOne({ where: { id: user_id } });
        if (!userToUpdate) {
            return null;
        }

        userToUpdate.is_active = true;

        const updatedUser = await this.save(userToUpdate);
        return updatedUser;
    }

    async updateLastLogoutAt(user_id: string, last_logout_at: Date): Promise<User | null> {
        const userToUpdate = await this.findOne({ where: { id: user_id } });
        if (!userToUpdate) {
            return null;
        }

        userToUpdate.last_logout_at = last_logout_at;

        const updatedUser = await this.save(userToUpdate);
        return updatedUser;
    }
}
