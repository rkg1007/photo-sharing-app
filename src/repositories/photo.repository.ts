import prisma from "../../prisma/prisma";

const findPhoto = (photoId: number) => {
    return prisma.photo.findUnique({
        where: {
            id: photoId
        }
    })
}

const fetchPhotos = (userEmail: string) => {
    return prisma.user.findUnique({
        where: {
            email: userEmail
        },
        select: {
            photos: true
        }
    })
}

const uploadPhoto = (photoUrl: string, userEmail: string) => {
    return prisma.photo.create({
      data: {
        url: photoUrl,
        owner: {
          connect: {
            email: userEmail,
          },
        },
      },
    });
}

const updatePhotoAccess = (photoId: number, userEmail: string) => {
    return prisma.user.update({
      where: {
        email: userEmail,
      },
      data: {
        photos: {
          connect: [{ id: photoId }],
        },
      },
    });
}

export default {
    findPhoto,
  fetchPhotos,
  uploadPhoto,
  updatePhotoAccess,
};