import prisma from "../../../prisma/prisma";
import { Error } from "../../constants";
import userService from "../../services/user.service";
import { exclude, hashPassword } from "../../utils";

const mockedUserData = {
    name: "name",
  email: "email",
  password: "password",
};

const mockedUser = {
  id: 1,
  name: "name",
  email: "email",
  password: "hashedPassword",
};

jest.mock("../../../prisma/prisma", () => {
  return {
    user: {
      findUnique: jest.fn((query) => {
        const { email, id } = query.where;
        if (email && email !== "email") {
          return null;
        }
        if (id && id != 1) {
          return null;
        }
        return mockedUser;
      }),
      create: jest.fn(() => mockedUser),
      update: jest.fn(() => mockedUser),
    },
  };
});

jest.mock("../../utils", () => {
  return {
    exclude: jest.fn((x) => x),
    hashPassword: jest.fn(x => "hashedPassword"),
  };
});

describe("create user service", () => {
  const testCases = [
    {
      msg: "should call prisma.user.findUnique",
      userData: { ...mockedUserData, email: "newEmail" },
      functionCallExpected: prisma.user.findUnique,
      withData: [{ where: { email: "newEmail" } }],
    },
    {
      msg: "should call hashPassword",
      userData: { ...mockedUserData, email: "newEmail" },
      functionCallExpected: hashPassword,
      withData: [mockedUserData.password],
    },
    {
      msg: "should call exclude",
      userData: { ...mockedUserData, email: "newEmail" },
      functionCallExpected: exclude,
      withData: [mockedUser, ["password"]],
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
      functionCallExpected: prisma.user.findUnique,
      withData: [{ where: { id: 1 } }],
    },
    {
      msg: "should call hashPassword",
      functionCallExpected: hashPassword,
      withData: [mockedUserData.password],
    },
    {
      msg: "should call exclude",
      functionCallExpected: exclude,
      withData: [mockedUser, ["password"]],
    },
    {
        msg: "should call prisma.user.update",
        functionCallExpected: prisma.user.update,
        withData: [{
            where: {
                id: 1
            },
            data: {
                ...mockedUserData,
                password: "hashedPassword"
            }
        }]
    }
  ];

  test.each(testCases)(
    "$msg",
    async ({ functionCallExpected, withData }) => {
      await userService.updateUser(1, mockedUserData);
      expect(functionCallExpected).toHaveBeenCalledWith(...withData);
    }
  );

  test("should give error if user doesn't exists", async () => {
    expect(async () => {
      await userService.updateUser(2, mockedUserData);
    }).rejects.toThrowError(Error.USER_NOT_FOUND);
  });
});

describe("get user service", () => {
  const testCases = [
    {
      msg: "should call prisma.user.findUnique",
      functionCallExpected: prisma.user.findUnique,
      withData: [{ where: { id: 1 } }],
    },
    {
      msg: "should call exclude",
      functionCallExpected: exclude,
      withData: [mockedUser, ["password"]],
    },
  ];

  test.each(testCases)(
    "$msg",
    async ({ functionCallExpected, withData }) => {
      await userService.getUser(1);
      expect(functionCallExpected).toHaveBeenCalledWith(...withData);
    }
  );

  test("should give error if user doesn't exists", async () => {
    expect(async () => {
      await userService.getUser(2);
    }).rejects.toThrowError(Error.USER_NOT_FOUND);
  });
});