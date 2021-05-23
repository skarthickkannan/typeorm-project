import {
  Arg,
  Ctx,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Post } from "../entity/Post";
import { PostResponse } from "../responses/PostResponse";
import { PostInput } from "../inputs/PostInput";
import { User } from "../entity/User";
import { isAuth } from "../isAuth";
import { UserContext } from "../UserContext";

@ObjectType()
@Resolver()
export class PostResolver {
  @Query(() => String)
  @UseMiddleware(isAuth)
  async postHelloword(): Promise<string> {
    return "hello";
  }

  @Query(() => [Post], { nullable: true })
  @UseMiddleware(isAuth)
  async getAllPost(): Promise<Post[]> {
    const posts = await Post.find({
      relations: ["user"],
    });
    return posts;
  }

  @Mutation(() => PostResponse)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("data") { title, body, createdAt }: PostInput,
    @Ctx() { payload }: UserContext
  ): Promise<PostResponse> {
    let user = await User.findOne({ where: { id: payload.userId! } });

    if (!user) {
      return {
        error: [
          {
            field: "User",
            message: "User not found",
          },
        ],
      };
    }

    let post = Post.create({
      title,
      body,
      createdAt,
      user,
    });
    await post.save();

    return {
      post,
    };
  }
}
