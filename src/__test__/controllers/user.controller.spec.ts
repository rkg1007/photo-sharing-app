import { NextFunction, Request, Response } from "express";
import { Error } from "../../constants";
import { createUser, getUser, updateUser } from "../../controllers";
import { BadRequest } from "../../errors";
import userService from "../../services/user.service";

const mockedUserDetail = {
  name: "name",
  email: "email@gmail.com",
  password: "Password@123",
};

const mockRequest = (req: any) => {
  return req as unknown as Request;
};

const mockResponse = () => {
  const response = { send: jest.fn() } as unknown as Response;
  return response;
};


jest.mock("../../services/user.service", () => {
  return {
    createUser: jest.fn(() => mockedUserDetail),
    updateUser: jest.fn(() => mockedUserDetail),
    getUser: jest.fn(() => mockedUserDetail),
  };
});

describe("create user controller", () => {
  const mockedResponse = mockResponse();

  const testCases = [
    {
      req: { body: mockedUserDetail },
      functionCallExpected: userService.createUser,
      withData: mockedUserDetail,
      msg: "should call userService.createUser",
    },
    {
      req: { body: mockedUserDetail },
      functionCallExpected: mockedResponse.send,
      withData: { statusCode: 201, user: mockedUserDetail },
      msg: "should call response.send",
    },
  ];

  test.each(testCases)(
    '$msg',
    async ({ req, functionCallExpected, withData }) => {
      const mockedRequest = mockRequest(req);
      await createUser(mockedRequest, mockedResponse);
      expect(functionCallExpected).toHaveBeenCalledWith(withData);
    }
  );

  test("should give error if email or password is missing", async () => {
    const mockedRequest = mockRequest({ body: {} });
    expect(async () => {
      await createUser(mockedRequest, mockedResponse);
    }).rejects.toThrowError(Error.MISSING_VALUE);
  });
});

describe("update user controller", () => {
  const mockedResponse = mockResponse();

  const testCases = [
    {
      msg: "should call userService.updateUser",
      req: { params: { email: "email@email.com" }, body: mockedUserDetail },
      functionCallExpected: userService.updateUser,
      withData: ["email@email.com", mockedUserDetail],
    },
    {
      req: { params: { email: "email@email.com" }, body: mockedUserDetail },
      functionCallExpected: mockedResponse.send,
      withData: [{ statusCode: 200, user: mockedUserDetail }],
      msg: "should call response.send",
    },
  ];

  test.each(testCases)(
    "$msg",
    async ({ req, functionCallExpected, withData, msg }) => {
      const mockedRequest = mockRequest(req);
      await updateUser(mockedRequest, mockedResponse);
      expect(functionCallExpected).toHaveBeenCalledWith(...withData);
    }
  );

  test("should give error if email or password is missing", async () => {
    const mockedRequest = mockRequest({ body: {} });
    expect(async () => {
      await updateUser(mockedRequest, mockedResponse);
    }).rejects.toThrowError(Error.NO_FIELD_CHANGED);
  });
});

describe("get user controller", () => {
  const mockedResponse = mockResponse();

  const testCases = [
    {
      req: { params: { email: "email@email.com" } },
      functionCallExpected: userService.getUser,
      withData: "email@email.com",
      msg: "should call userService.getUser",
    },
    {
      req: { params: { userId: 1 } },
      functionCallExpected: mockedResponse.send,
      withData: { statusCode: 200, user: mockedUserDetail },
      msg: "should call response.send",
    },
  ];

  test.each(testCases)(
    "$msg",
    async ({ req, functionCallExpected, withData }) => {
      const mockedRequest = mockRequest(req);
      await getUser(mockedRequest, mockedResponse);
      expect(functionCallExpected).toHaveBeenCalledWith(withData);
    }
  );
});
