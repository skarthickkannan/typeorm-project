import { Field, InputType } from "type-graphql";
import { User } from "../entity/User";

@InputType()
export class PostInput {
  @Field()
  title: string;

  @Field()
  body: string;

  @Field()
  createdAt: Date;
}
