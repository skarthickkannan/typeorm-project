import { Field, ObjectType } from "type-graphql";
import { Post } from "../entity/Post";
import { User } from "../entity/User";
import { ErrorResponse } from "./ErrorResponse";

@ObjectType()
export class PostResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  error?: ErrorResponse[];

  @Field(() => Post, { nullable: true })
  post?: Post;
}
