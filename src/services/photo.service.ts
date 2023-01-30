import prisma from "../../prisma/prisma";
import { Error } from "../constants";
import { NotFound, Unauthorized } from "../errors";

const uploadPhoto = async (userId: number, file: Express.Multer.File) => {
    const photoUrl = `http://localhost:5000/images/${file.filename}`;
    const photo = await prisma.photo.create({
        data: {
            url: photoUrl,
            owner: {
                connect: {
                    id: userId
                }
            }
        }
    });

    return photo;
}

const fetchPhotos = async (userId: number) => {
    const photos = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            photos: true
        }
    });
    return photos;
}

const updatePhotoAccess = async (userId: number, photoId: number, allowedUsers: string[]) => {

    const photo = await prisma.photo.findUnique({
        where: {
            id: photoId
        }
    });

    if (!photo) {
        throw new NotFound(Error.PHOTO_NOT_FOUND);
    }
    if (photo.ownerId !== userId) {
        throw new Unauthorized(Error.NOT_AUTHORISED);
    }

    let noOfUserNotFound = 0
    for (const userEmail of allowedUsers) {
        try {
            await prisma.user.update({
                where: {
                    email: userEmail
                },
                data: {
                    photos: {
                        connect: [{ id: photoId }]
                    }
                }
            });
        } catch (error) {
            noOfUserNotFound++;
        }   
    }
    return `access provided`;
}

export default {
  uploadPhoto,
  fetchPhotos,
  updatePhotoAccess,
};