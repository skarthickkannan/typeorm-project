import { Field, ObjectType } from "type-graphql";
import { User } from "../entity/User";
import { ErrorResponse } from "./ErrorResponse";

@ObjectType()
export class UserResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  error?: ErrorResponse[];

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => String, { nullable: true })
  token?: string;
}
