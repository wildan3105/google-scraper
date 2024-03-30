import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user-entity';
import { IUserVerificationCode } from '../interfaces/user-verification-code';

@Entity()
export class UserVerificationCode implements IUserVerificationCode {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255 })
    code: string;

    @Column()
    expired_at: Date;

    @ManyToOne(() => User, (user) => user.verificationCodes)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn()
    created_at: Date;
}
