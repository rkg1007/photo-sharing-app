import { loginUser } from "../../controllers";
import { Request, Response } from "express";
import authService from "../../services/auth.service";
import { Error } from "../../constants";

const mockedCredentials = {
    email: "email@email.com",
    password: "Password@123"
}

const mockRequest = (req: any) => {
  return req as unknown as Request;
};

const mockResponse = () => {
  const response = { send: jest.fn() } as unknown as Response;
  return response;
};

jest.mock("../../services/auth.service", () => {
    return {
        login: jest.fn(() => "jwtToken")
    }
})

describe("login controller", () => {
    const mockedResponse = mockResponse();

    const testCases = [
      {
        msg: "should call authService.login",
        request: { body: mockedCredentials },
        functionCallExpected: authService.login,
        withData: mockedCredentials,
      },
      {
        msg: "should call response.send",
        request: { body: mockedCredentials },
        functionCallExpected: mockedResponse.send,
        withData: { statusCode: 200, accessToken: "jwtToken"},
      },
    ];

    test.each(testCases)('$msg', async ({ request, functionCallExpected, withData}) => {
      const mockedRequest = mockRequest(request);
      await loginUser(mockedRequest, mockedResponse);
      expect(functionCallExpected).toHaveBeenCalledWith(withData);
    })

    test("should give error if email or password is missing", async () => {
      const mockedRequest = mockRequest({ body: {} })
      expect(async () => {
        await loginUser(mockedRequest, mockedResponse);
      }).rejects.toThrowError(Error.MISSING_VALUE);
    });
})