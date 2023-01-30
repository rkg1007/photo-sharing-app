import { Request, Response, NextFunction } from "express";
import { Error } from "../../constants";
import { fetchPhotos, updatePhotoAccess, uploadPhoto } from "../../controllers/photo.controller";
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
  const response = { send: jest.fn() } as unknown as Response;
  return response;
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

    const testCases = [
      {
        msg: "should call photoService.uploadPhoto",
        request: {
          params: { email: "email@email.com" },
          file: {} as Express.Multer.File,
        },
        expectedFunctionCall: photoService.uploadPhoto,
        withData: ["email@email.com", {} as Express.Multer.File],
      },
      {
        msg: "should call response.send",
        request: {
          params: { email: "email@email.com" },
          file: {} as Express.Multer.File,
        },
        expectedFunctionCall: mockedResponse.send,
        withData: [{ statusCode: 200, photo: mockedPhoto }],
      },
    ];

    test.each(testCases)("$msg", async ({ request, expectedFunctionCall, withData }) => {
        const mockedRequest = mockRequest(request);
        await uploadPhoto(mockedRequest, mockedResponse);
        expect(expectedFunctionCall).toHaveBeenCalledWith(...withData)
    })
})

describe("fetch photo controller", () => {
  const mockedResponse = mockResponse();

  const testCases = [
    {
      msg: "should call photoService.fetchPhotos",
      request: { params: { email: "email@email.com" } },
      expectedFunctionCall: photoService.fetchPhotos,
      withData: ["email@email.com"],
    },
    {
      msg: "should call response.status",
      request: { params: { email: "email@email.com" } },
      expectedFunctionCall: mockedResponse.send,
      withData: [{ statusCode: 200, photos: [mockedPhoto] }],
    },
  ];

  test.each(testCases)(
    "$msg",
    async ({ request, expectedFunctionCall, withData }) => {
      const mockedRequest = mockRequest(request);
      await fetchPhotos(mockedRequest, mockedResponse);
      expect(expectedFunctionCall).toHaveBeenCalledWith(...withData);
    }
  );
});

describe("update Photo Access controller", () => {
  const mockedResponse = mockResponse();

  const testCases = [
    {
      msg: "should call photoService.updatePhotoAccess",
      request: {
        params: { email: "email@email.com", photoId: 1 },
        body: { allowedUsers: ["email@gmail.com"] },
      },
      expectedFunctionCall: photoService.updatePhotoAccess,
      withData: ["email@email.com", 1, ["email@gmail.com"]],
    },
    {
      msg: "should call response.status",
      request: {
        params: { email: "email@email.com", photoId: 1 },
        body: { allowedUsers: ["email@email.com"] },
      },
      expectedFunctionCall: mockedResponse.send,
      withData: [{ statusCode: 200, msg: "access provided" }],
    },
  ];

  test.each(testCases)(
    "$msg",
    async ({ request, expectedFunctionCall, withData }) => {
      const mockedRequest = mockRequest(request);
      await updatePhotoAccess(mockedRequest, mockedResponse);
      expect(expectedFunctionCall).toHaveBeenCalledWith(...withData);
    }
  );

  test("should give error if allowed user list undefined or empty", async () => {
    const mockedRequest = mockRequest({
      params: { email: "email@email.com", photoId: 1 },
      body: {},
    });
    expect(async () => {
      await updatePhotoAccess(mockedRequest, mockedResponse);
    }).rejects.toThrowError(Error.USER_LIST_EMPTY);
  });
});
