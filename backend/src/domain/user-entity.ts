import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { IUser } from '../interfaces/user';
import { UserVerificationCode } from './user-verification-code-entity';

@Entity()
export class User implements IUser {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    email: string;

    @Column({ type: 'text', nullable: false })
    password: string;

    @Column({ type: 'boolean', default: false })
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    last_login: Date;

    @OneToMany(() => UserVerificationCode, (code) => code.user)
    verificationCodes: UserVerificationCode[];
}