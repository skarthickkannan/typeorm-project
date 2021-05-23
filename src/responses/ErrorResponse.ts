import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class ErrorResponse {
  @Field()
  field: string;

  @Field()
  message: string;
}
