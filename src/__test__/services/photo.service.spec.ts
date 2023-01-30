import prisma from "../../../prisma/prisma";
import photoService from "../../services/photo.service";

const mockedPhoto = {
  id: 1,
  url: "http://localhost:5000/images/dummyImage.png",
  ownerId: 1,
};

const mockedUser = {
  id: 1,
  name: "name",
  email: "email",
  password: "hashedPassword",
};

jest.mock("../../../prisma/prisma", () => {
  return {
    photo: {
      create: jest.fn(() => mockedPhoto),
      findUnique: jest.fn((query) => {
        if (query.where.id != 1) {
            return null;
        }
        return mockedPhoto
      })
    },
    user: {
      findUnique: jest.fn((query) => {
        const { email, id } = query.where;
        if (email && email !== "email") {
          return null;
        }
        if (id && id != 1) {
          return null;
        }
        return [mockedPhoto];
      }),
      update: jest.fn(),
    },
  };
});

describe("upload photo service", () => {
  const testCases = [
    {
      msg: "should call prisma.photo.create",
      photoData: {
        filename: "dummyImage.png",
      } as unknown as Express.Multer.File,
      functionCallExpected: prisma.photo.create,
      withData: {
        data: {
          url: "http://localhost:5000/images/dummyImage.png",
          owner: {
            connect: {
              id: 1,
            },
          },
        },
      },
    },
  ];

  test.each(testCases)(
    "$msg",
    async ({ photoData, functionCallExpected, withData }) => {
      const photo = await photoService.uploadPhoto(1, photoData);
      expect(functionCallExpected).toHaveBeenCalledWith(withData);
      expect(photo).toBe(mockedPhoto);
    }
  );
});

describe("fetch photo service", () => {
  const testCases = [
    {
      msg: "should call prisma.user.findUnique",
      functionCallExpected: prisma.user.findUnique,
      withData: {
        where: {
            id: 1
        },
        select: {
            photos: true
        }
      },
    },
  ];

  test.each(testCases)(
    "$msg",
    async ({ functionCallExpected, withData }) => {
      const photo = await photoService.fetchPhotos(1);
      expect(functionCallExpected).toHaveBeenCalledWith(withData);
      expect(photo).toEqual([mockedPhoto]);
    }
  );
});

describe("update photo access service", () => {
  const testCases = [
    {
      msg: "should call prisma.user.update",
      allowedEmails: ["email1"],
      functionCallExpected: prisma.user.update,
      withData: {
        where: {
          email: "email1",
        },
        data: {
          photos: {
            connect: [{ id: 1 }],
          },
        },
      },
    },
    {
      msg: "should call prisma.photo.findUnique",
      allowedEmails: ["email1"],
      functionCallExpected: prisma.photo.findUnique,
      withData: {
        where: {
          id: 1,
        },
      },
    },
  ];

  test.each(testCases)(
    "$msg",
    async ({ allowedEmails, functionCallExpected, withData }) => {
      await photoService.updatePhotoAccess(1, 1, allowedEmails);
      expect(functionCallExpected).toHaveBeenCalledWith(withData);
    }
  );

  test("should give error if user id doesn't match", async () => {
    expect(async () => {
      await photoService.updatePhotoAccess(2, 1, ["email1"]);
    }).rejects.toThrowError(
      "you are not authorized to change access of given photo"
    );
  });

  test("should give error if user id doesn't match", async () => {
    expect(async () => {
      await photoService.updatePhotoAccess(1, 2, ["email1"]);
    }).rejects.toThrowError("photo is not found");
  });
});
