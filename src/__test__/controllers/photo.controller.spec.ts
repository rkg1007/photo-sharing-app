import { Request, Response, NextFunction } from "express";
import { fetchPhotos, updatePhotoAccess, uploadPhoto } from "../../controllers/photo.controller";
import { BadRequest } from "../../errors";
import photoService from "../../services/photo.service";

const mockedPhoto = {
  id: 1,
  url: "http://localhost:5000/images/dummyImage.png",
  ownerId: 1,
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

jest.mock("../../services/photo.service", () => {
    return {
      uploadPhoto: jest.fn(() => mockedPhoto),
      fetchPhotos: jest.fn(() => [mockedPhoto]),
      updatePhotoAccess: jest.fn(() => "access provided")
    };
});

describe("upload photo controller", () => {
    const mockedResponse = mockResponse();
    const mockedNextFunction = mockNextFunction();

    const testCases = [
      {
        msg: "should call photoService.uploadPhoto",
        request: { params: { userId: 1 }, file: {} as Express.Multer.File },
        expectedFunctionCall: photoService.uploadPhoto,
        withData: [1, {} as Express.Multer.File],
      },
      {
        msg: "should call response.status",
        request: { params: { userId: 1 }, file: {} as Express.Multer.File },
        expectedFunctionCall: mockedResponse.status,
        withData: [200],
      },
      {
        msg: "should call response.json",
        request: { params: { userId: 1 }, file: {} as Express.Multer.File },
        expectedFunctionCall: mockedResponse.json,
        withData: [{ data: mockedPhoto}],
      },
    ];

    test.each(testCases)("$msg", async ({ request, expectedFunctionCall, withData }) => {
        const mockedRequest = mockRequest(request);
        await uploadPhoto(mockedRequest, mockedResponse, mockedNextFunction);
        expect(expectedFunctionCall).toHaveBeenCalledWith(...withData)
    })
})

describe("fetch photo controller", () => {
  const mockedResponse = mockResponse();
  const mockedNextFunction = mockNextFunction();

  const testCases = [
    {
      msg: "should call photoService.fetchPhotos",
      request: { params: { userId: 1 } },
      expectedFunctionCall: photoService.fetchPhotos,
      withData: [1],
    },
    {
      msg: "should call response.status",
      request: { params: { userId: 1 } },
      expectedFunctionCall: mockedResponse.status,
      withData: [200],
    },
    {
      msg: "should call response.json",
      request: { params: { userId: 1 } },
      expectedFunctionCall: mockedResponse.json,
      withData: [{ data: [mockedPhoto]}],
    },
  ];

  test.each(testCases)(
    "$msg",
    async ({ request, expectedFunctionCall, withData }) => {
      const mockedRequest = mockRequest(request);
      await fetchPhotos(mockedRequest, mockedResponse, mockedNextFunction);
      expect(expectedFunctionCall).toHaveBeenCalledWith(...withData);
    }
  );
});

describe("update Photo Access controller", () => {
  const mockedResponse = mockResponse();
  const mockedNextFunction = mockNextFunction();

  const testCases = [
    {
      msg: "should call photoService.updatePhotoAccess",
      request: {
        params: { userId: 1, photoId: 1 },
        body: { allowedUsers: ["email1"] },
      },
      expectedFunctionCall: photoService.updatePhotoAccess,
      withData: [1, 1, ["email1"]],
    },
    {
      msg: "should call response.status",
      request: {
        params: { userId: 1, photoId: 1 },
        body: { allowedUsers: ["email1"] },
      },
      expectedFunctionCall: mockedResponse.status,
      withData: [200],
    },
    {
      msg: "should call response.json",
      request: {
        params: { userId: 1, photoId: 1 },
        body: { allowedUsers: ["email1"] },
      },
      expectedFunctionCall: mockedResponse.json,
      withData: [{ data: { msg: "access provided" } }],
    },
    {
      msg: "should call next function with error",
      request: {
        params: { userId: 1, photoId: 1 },
        body: { allowedUsers: [] },
      },
      expectedFunctionCall: mockedNextFunction,
      withData: [
        new BadRequest("please send users list to allow access to users"),
      ],
    },
  ];

  test.each(testCases)(
    "$msg",
    async ({ request, expectedFunctionCall, withData }) => {
      const mockedRequest = mockRequest(request);
      await updatePhotoAccess(mockedRequest, mockedResponse, mockedNextFunction);
      expect(expectedFunctionCall).toHaveBeenCalledWith(...withData);
    }
  );
});
