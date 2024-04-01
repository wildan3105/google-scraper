import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user-entity';
import { IKeyword } from '../interfaces/keyword';

@Entity()
export class Keyword implements IKeyword {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;

    @ManyToOne(() => User, (user) => user.keywords)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'text' })
    value: string;

    @Column({ type: 'int', nullable: true })
    num_of_links?: number;

    @Column({ type: 'int', nullable: true })
    num_of_adwords?: number;

    @Column({ type: 'text', nullable: true })
    search_result_information?: string;

    @Column({ type: 'text', nullable: true })
    html_code?: string;
}
