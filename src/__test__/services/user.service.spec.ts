import prisma from "../../../prisma/prisma";
import { Error } from "../../constants";
import userRepository from "../../repositories/user.repository";
import userService from "../../services/user.service";
import { exclude, hashPassword } from "../../utils";

const mockedUserData = {
  name: "name",
  email: "email@email.com",
  password: "Password@123",
};

const mockedUser = {
  id: 1,
  name: "name",
  email: "email@email.com",
  password: "hashedPassword",
};

jest.mock("../../repositories/user.repository", () => {
  return {
    getUser: jest.fn((email) => {
      if (email && email !== "email@email.com") {
        return null;
      }
      return mockedUser;
    }),
    createUser: jest.fn(() => mockedUser),
    updateUser: jest.fn(() => mockedUser),
  };
});

jest.mock("../../utils", () => {
  return {
    exclude: jest.fn((x) => x),
    hashPassword: jest.fn((x) => "hashedPassword"),
  };
});

describe("create user service", () => {
  const testCases = [
    {
      msg: "should call prisma.user.findUnique",
      userData: { ...mockedUserData, email: "email1@email.com" },
      functionCallExpected: userRepository.getUser,
      withData: ["email1@email.com"],
    },
    {
      msg: "should call hashPassword",
      userData: { ...mockedUserData, email: "email1@email.com" },
      functionCallExpected: hashPassword,
      withData: [mockedUserData.password],
    },
  ];

  test.each(testCases)(
    "$msg",
    async ({ userData, functionCallExpected, withData }) => {
      await userService.createUser(userData);
      expect(functionCallExpected).toHaveBeenCalledWith(...withData);
    }
  );

  test("should give error if user is already present", async () => {
    expect(async () => {
      await userService.createUser(mockedUserData);
    }).rejects.toThrowError(Error.USER_FOUND);
  });
});

describe("update user service", () => {
  const testCases = [
    {
      msg: "should call prisma.user.findUnique",
      functionCallExpected: userRepository.getUser,
      withData: ["email@email.com"],
    },
    {
      msg: "should call hashPassword",
      functionCallExpected: hashPassword,
      withData: [mockedUserData.password],
    },
    {
      msg: "should call prisma.user.update",
      functionCallExpected: userRepository.updateUser,
      withData: ["email@email.com", mockedUserData],
    },
  ];

  test.each(testCases)("$msg", async ({ functionCallExpected, withData }) => {
    await userService.updateUser("email@email.com", mockedUserData);
    expect(functionCallExpected).toHaveBeenCalledWith(...withData);
  });

  test("should give error if user doesn't exists", async () => {
    expect(async () => {
      await userService.updateUser("email1@email.com", mockedUserData);
    }).rejects.toThrowError(Error.USER_NOT_FOUND);
  });
});

describe("get user service", () => {
  const testCases = [
    {
      msg: "should call prisma.user.findUnique",
      functionCallExpected: userRepository.getUser,
      withData: ["email@email.com"],
    },
  ];

  test.each(testCases)("$msg", async ({ functionCallExpected, withData }) => {
    await userService.getUser("email@email.com");
    expect(functionCallExpected).toHaveBeenCalledWith(...withData);
  });

  test("should give error if user doesn't exists", async () => {
    expect(async () => {
      await userService.getUser("email1@email.com");
    }).rejects.toThrowError(Error.USER_NOT_FOUND);
  });
});
