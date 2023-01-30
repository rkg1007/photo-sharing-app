import prisma from "../../../prisma/prisma";
import { Error } from "../../constants";
import userRepository from "../../repositories/user.repository";
import authService from "../../services/auth.service";
import { comparePassword, createAccessToken } from "../../utils";

const mockedUserCredentials = {
    email: "email@email.com",
    password: "Password@123"
}

const mockedUser = {
    id: 1,
    email: 'email@email.com',
    password: 'hashedPassword'
}

jest.mock("../../repositories/user.repository", () => {
  return {
    getUser: jest.fn((email) => {
        if (email !== "email@email.com") {
          return null;
        }
        return mockedUser;
      }),
  };
});

jest.mock("../../utils", () => {
    return {
      comparePassword: jest.fn((password) => {
        if (password !== "Password@123") {
          return false;
        }
        return true;
      }),
      createAccessToken: jest.fn().mockResolvedValue("jwtToken")
    };
});

describe("login service", () => {
    const testCases = [
      {
        msg: "should call prisma.user.findUnique",
        userData: mockedUserCredentials,
        functionCallExpected: userRepository.getUser,
        withData: [mockedUserCredentials.email, { passwordRequired: true}],
      },
      {
        msg: "should call comparePassword",
        userData: mockedUserCredentials,
        functionCallExpected: comparePassword,
        withData: [mockedUserCredentials.password, mockedUser.password],
      },
      {
        msg: "should call createAccessToken",
        userData: mockedUserCredentials,
        functionCallExpected: createAccessToken,
        withData: [{ email: mockedUser.email }],
      },
    ];

    test.each(testCases)('$msg', async ({ userData, functionCallExpected, withData }) => {
        const token = await authService.login(userData);
        expect(functionCallExpected).toHaveBeenCalledWith(...withData);
        expect(token).toBe("jwtToken");
    });

    test("should give error if email is wrong", async () => {
        expect(async () => {
          await authService.login({
            ...mockedUserCredentials,
            email: "wrong@email.com",
          });
        }).rejects.toThrowError(Error.USER_NOT_FOUND);
    })

    test("should give error if password is wrong", async () => {
      expect(async () => {
        await authService.login({
          ...mockedUserCredentials,
          password: "wrongPassword@123",
        });
      }).rejects.toThrowError(Error.PASSWORD_NOT_MATCHED);
    });
})