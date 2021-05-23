import { UserContext } from "../UserContext";
import { isAuth } from "../isAuth";
import {
  Arg,
  Ctx,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { User } from "../entity/User";
import { Post } from "../entity/Post";

@ObjectType()
@Resolver()
export class MeResolver {
  @Query(() => String)
  @UseMiddleware(isAuth)
  async Me(@Ctx() { payload }: UserContext) {
    return `Your user id : ${payload!.userId}`;
  }

  @Query(() => [User], { nullable: true })
  @UseMiddleware(isAuth)
  async allUserPosts(): Promise<User[]> {
    const users = User.find({ relations: ["posts"] });

    return users;
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async oneUserPosts(@Ctx() { payload }: UserContext): Promise<User> {
    const users = User.findOne({
      where: { id: payload!.userId },
      relations: ["posts"],
    });
    return users;
  }

  @Query(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async getPost(@Arg("postId") postId: String): Promise<Post> {
    const post = await Post.findOne({
      where: { id: postId },
      relations: ["user"],
    });
    return post;
  }

  @Query(() => [Post], { nullable: true })
  @UseMiddleware(isAuth)
  async getAllPost(): Promise<Post[]> {
    const posts = await Post.find({
      relations: ["user"],
    });
    return posts;
  }
}
