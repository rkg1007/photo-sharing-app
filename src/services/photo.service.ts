import prisma from "../../prisma/prisma";
import { Error } from "../constants";
import { NotFound, Unauthorized } from "../errors";
import photoRepository from "../repositories/photo.repository";
import userRepository from "../repositories/user.repository";

const uploadPhoto = async (userEmail: string, file: Express.Multer.File) => {
    const photoUrl = `http://localhost:5000/images/${file.filename}`;
    const photo = await photoRepository.uploadPhoto(photoUrl, userEmail)
    return photo;
}

const fetchPhotos = async (userEmail: string) => {
    const photos = await photoRepository.fetchPhotos(userEmail)
    return photos;
}

const updatePhotoAccess = async (userEmail: string, photoId: number, allowedUsers: string[]) => {

    const photo = await photoRepository.findPhoto(photoId);

    if (!photo) {
        throw new NotFound(Error.PHOTO_NOT_FOUND);
    }

    const photoOwner = await userRepository.getUserById(photo.ownerId);
    if (photoOwner?.email !== userEmail) {
        throw new Unauthorized(Error.NOT_AUTHORISED);
    }

    let noOfUserNotFound = 0
    for (const userEmail of allowedUsers) {
        try {
            await photoRepository.updatePhotoAccess(photoId, userEmail)
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