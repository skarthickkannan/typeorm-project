import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

@Entity("posts")
@ObjectType()
export class Post extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column({ nullable: true })
  body: string;

  @Field()
  @Column()
  createdAt: Date;

  @Field((type) => User)
  @ManyToOne(() => User)
  user: User;
}
