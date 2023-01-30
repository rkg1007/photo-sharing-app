import { NextFunction, Request, Response } from "express";
import { createUser, getUser, updateUser } from "../../controllers";
import { BadRequest } from "../../errors";
import userService from "../../services/user.service";

const mockedUserDetail = {
  name: "dummy name",
  email: "dummy email",
  password: "dummy password",
};

const mockRequest = (req: any) => {
  return req as unknown as Request;
};

const mockResponse = () => {
  const response = {} as unknown as Response;
  response.status = jest.fn(() => response);
  response.json = jest.fn(() => response);
  return response;
};

const mockNextFunction = () => {
  const next = jest.fn() as unknown as NextFunction;
  return next;
};

jest.mock("../../services/user.service", () => {
  return {
    createUser: jest.fn().mockResolvedValue({
      name: "dummy name",
      email: "dummy email",
      password: "dummy password",
    }),
    updateUser: jest.fn().mockResolvedValue({
      name: "dummy name",
      email: "dummy email",
      password: "dummy password",
    }),
    getUser: jest.fn().mockResolvedValue({
      name: "dummy name",
      email: "dummy email",
      password: "dummy password",
    }),
  };
});

describe("create user controller", () => {
  const mockedResponse = mockResponse();
  const mockedNextFunction = mockNextFunction();

  const testCases = [
    {
      req: { body: mockedUserDetail },
      functionCallExpected: userService.createUser,
      withData: mockedUserDetail,
      msg: "should call userService.createUser",
    },
    {
      req: { body: mockedUserDetail },
      functionCallExpected: mockedResponse.status,
      withData: 201,
      msg: "should call response.status with 201",
    },
    {
      req: { body: mockedUserDetail },
      functionCallExpected: mockedResponse.json,
      withData: { data: mockedUserDetail },
      msg: "should call response.json with mocked used details",
    },
    {
      req: { body: { ...mockedUserDetail, name: undefined } },
      functionCallExpected: mockedNextFunction,
      withData: new BadRequest(
        "missing either one or more values from name, email and password"
      ),
      msg: "should call next function with bad request error",
    },
    {
      req: { body: { ...mockedUserDetail, email: undefined } },
      functionCallExpected: mockedNextFunction,
      withData: new BadRequest(
        "missing either one or more values from name, email and password"
      ),
      msg: "should call next function with bad request error",
    },
    {
      req: { body: { ...mockedUserDetail, password: undefined } },
      functionCallExpected: mockedNextFunction,
      withData: new BadRequest(
        "missing either one or more values from name, email and password"
      ),
      msg: "should call next function with bad request error",
    },
  ];

  test.each(testCases)(
    '$msg',
    async ({ req, functionCallExpected, withData }) => {
      const mockedRequest = mockRequest(req);
      await createUser(mockedRequest, mockedResponse, mockedNextFunction);
      expect(functionCallExpected).toHaveBeenCalledWith(withData);
    }
  );
});

describe("update user controller", () => {
  const mockedResponse = mockResponse();
  const mockedNextFunction = mockNextFunction();

  const testCases = [
    {
      msg: "should call userService.updateUser",
      req: { params: { userId: 1 }, body: mockedUserDetail },
      functionCallExpected: userService.updateUser,
      withData: [1, mockedUserDetail],
    },
    {
      req: { params: { userId: 1 }, body: mockedUserDetail },
      functionCallExpected: mockedResponse.status,
      withData: [200],
      msg: "should call userService.getUser",
    },
    {
      req: { params: { userId: 1 }, body: mockedUserDetail },
      functionCallExpected: mockedResponse.json,
      withData: [{ data: mockedUserDetail }],
      msg: "should call userService.getUser",
    },
    {
      req: { params: { userId: 1 }, body: {} },
      functionCallExpected: mockedNextFunction,
      withData: [new BadRequest("no field is changed")],
      msg: "should call userService.getUser",
    },
  ];

  test.each(testCases)(
    "$msg",
    async ({ req, functionCallExpected, withData, msg }) => {
      const mockedRequest = mockRequest(req);
      await updateUser(mockedRequest, mockedResponse, mockedNextFunction);
      expect(functionCallExpected).toHaveBeenCalledWith(...withData);
    }
  );
});

describe("get user controller", () => {
  const mockedResponse = mockResponse();
  const mockedNextFunction = mockNextFunction();

  const testCases = [
    {
      req: { params: { userId: 1 } },
      functionCallExpected: userService.getUser,
      withData: 1,
      msg: "should call userService.getUser",
    },
    {
      req: { params: { userId: 1 } },
      functionCallExpected: mockedResponse.status,
      withData: 200,
      msg: "should call userService.getUser",
    },
    {
      req: { params: { userId: 1 } },
      functionCallExpected: mockedResponse.json,
      withData: { data: mockedUserDetail },
      msg: "should call userService.getUser",
    },
  ];

  test.each(testCases)(
    "$msg",
    async ({ req, functionCallExpected, withData }) => {
      const mockedRequest = mockRequest(req);
      await getUser(mockedRequest, mockedResponse, mockedNextFunction);
      expect(functionCallExpected).toHaveBeenCalledWith(withData);
    }
  );
});
