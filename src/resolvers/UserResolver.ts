import {
  Arg,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { User } from "../entity/User";
import { RegisterInput } from "../inputs/RegisterInput";
import { UserResponse } from "../responses/UserResponse";
import { LoginInput } from "../inputs/LoginInput";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { isAuth } from "../isAuth";

function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

@ObjectType()
@Resolver()
export class UserResolver {
  @Query(() => String)
  @UseMiddleware(isAuth)
  async postHelloword(): Promise<string> {
    return "hello";
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("data") { username, email, password, createdAt }: RegisterInput
  ): Promise<UserResponse> {
    let user = await User.findOne({ email });

    if (user) {
      return {
        error: [{ field: "User", message: "Email already taken" }],
      };
    }

    let emailCheck = validateEmail(email);

    if (!emailCheck) {
      return {
        error: [{ field: "Email", message: "Please enter correct email" }],
      };
    }

    if (password.length < 8) {
      return {
        error: [
          { field: "Password", message: "Password should be 8 characters" },
        ],
      };
    }

    const hash = await argon2.hash(password);

    user = User.create({
      username,
      email,
      password: hash,
      createdAt,
    });
    await user.save();
    return {
      user,
    };
  }
  @Mutation(() => UserResponse)
  async login(
    @Arg("data") { email, password }: LoginInput
  ): Promise<UserResponse> {
    let user = await User.findOne({ email });

    let emailCheck = validateEmail(email);

    if (!emailCheck) {
      return {
        error: [{ field: "Email", message: "Please enter correct email" }],
      };
    }

    if (!user) {
      return {
        error: [{ field: "User", message: "User not found" }],
      };
    }

    const verifyPassword = await argon2.verify(user.password, password);

    if (!verifyPassword) {
      return {
        error: [{ field: "Password", message: "Password does not match" }],
      };
    }

    const token = jwt.sign({ userId: user.id }, "secret", {
      expiresIn: "15m",
    });

    return {
      user,
      token,
    };
  }
}
