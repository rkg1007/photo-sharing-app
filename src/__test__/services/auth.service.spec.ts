import prisma from "../../../prisma/prisma";
import { Error } from "../../constants";
import authService from "../../services/auth.service";
import { comparePassword, createAccessToken } from "../../utils";

const mockedUserCredentials = {
    email: "email",
    password: "password"
}

const mockedUser = {
    id: 1,
    email: 'email',
    password: 'hashedPassword'
}

jest.mock("../../../prisma/prisma", () => {
    return {
        user: {
            findUnique: jest.fn((query) => {
                if (query.where.email !== "email") {
                    return null;
                }
                return mockedUser;
            })
        }
    }
});

jest.mock("../../utils", () => {
    return {
      comparePassword: jest.fn((password) => {
        if (password !== "password") {
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
        functionCallExpected: prisma.user.findUnique,
        withData: [{ where: { email: mockedUserCredentials.email } }],
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
        withData: [{ id: mockedUser.id }],
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
            email: "wrong email",
          });
        }).rejects.toThrowError(Error.USER_NOT_FOUND);
    })

    test("should give error if password is wrong", async () => {
      expect(async () => {
        await authService.login({
          ...mockedUserCredentials,
          password: "wrong password",
        });
      }).rejects.toThrowError(Error.PASSWORD_NOT_MATCHED);
    });
})