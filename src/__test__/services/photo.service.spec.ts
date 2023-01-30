import prisma from "../../../prisma/prisma";
import { Error } from "../../constants";
import photoRepository from "../../repositories/photo.repository";
import photoService from "../../services/photo.service";

const mockedPhoto = {
  id: 1,
  url: "http://localhost:5000/images/dummyImage.png",
  ownerId: 1,
};

const mockedUser = {
  id: 1,
  name: "name",
  email: "email@email.com",
  password: "hashedPassword",
};

jest.mock("../../repositories/photo.repository", () => {
  return {
    uploadPhoto: jest.fn((photoUrl, userEmail) => {
      if (userEmail != "email@email.com") {
        return null;
      }
      return mockedPhoto;
    }),
    fetchPhotos: jest.fn(() => [mockedPhoto]),
    updatePhotoAccess: jest.fn(),
    findPhoto: jest.fn(() => mockedPhoto)
  };
});
jest.mock("../../repositories/user.repository", () => {
  return {
    getUserById: jest.fn(() => mockedUser)
  };
});

describe("upload photo service", () => {
  const testCases = [
    {
      msg: "should call prisma.photo.create",
      photoData: {
        filename: "dummyImage.png",
      } as unknown as Express.Multer.File,
      functionCallExpected: photoRepository.uploadPhoto,
      withData: [
        "http://localhost:5000/images/dummyImage.png",
        "email@email.com",
      ],
    },
  ];

  test.each(testCases)(
    "$msg",
    async ({ photoData, functionCallExpected, withData }) => {
      const photo = await photoService.uploadPhoto(
        "email@email.com",
        photoData
      );
      expect(functionCallExpected).toHaveBeenCalledWith(...withData);
    }
  );
});

describe("fetch photo service", () => {
  const testCases = [
    {
      msg: "should call prisma.user.findUnique",
      functionCallExpected: photoRepository.fetchPhotos,
      withData: "email@email.com",
    },
  ];

  test.each(testCases)(
    "$msg",
    async ({ functionCallExpected, withData }) => {
      const photo = await photoService.fetchPhotos("email@email.com");
      expect(functionCallExpected).toHaveBeenCalledWith(withData);
      expect(photo).toEqual([mockedPhoto]);
    }
  );
});

describe("update photo access service", () => {
  const testCases = [
    {
      msg: "should call prisma.user.update",
      allowedEmails: ["email1@email.com"],
      functionCallExpected: photoRepository.updatePhotoAccess,
      withData: [1, "email1@email.com"]
    },
  ];

  test.each(testCases)(
    "$msg",
    async ({ allowedEmails, functionCallExpected, withData }) => {
      await photoService.updatePhotoAccess("email@email.com", 1, allowedEmails);
      expect(functionCallExpected).toHaveBeenCalledWith(...withData);
    }
  );
});
