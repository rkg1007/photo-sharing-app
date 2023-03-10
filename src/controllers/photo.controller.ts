import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Error } from "../constants";
import { BadRequest } from "../errors";
import photoService from "../services/photo.service";
import { validate } from "../utils";

export const uploadPhoto = async (req: Request, res: Response) => {
  const userEmail = req.params.email;
  const file = req.file as Express.Multer.File;
  const photo = await photoService.uploadPhoto(userEmail, file);
  res.send({ statusCode: StatusCodes.OK, photo });
};

export const fetchPhotos = async (req: Request, res: Response) => {
  const userEmail = req.params.email 
  const photos = await photoService.fetchPhotos(userEmail);
  res.send({ statusCode: StatusCodes.OK, photos })
};

export const updatePhotoAccess = 
  async (req: Request, res: Response) => {
    const userEmail = req.params.email;
    const photoId = Number(req.params.photoId);

    validate([{ type: "id", value: photoId }])

    const { allowedUsers } = req.body;
    if (!allowedUsers || allowedUsers.length == 0) {
      throw new BadRequest(Error.USER_LIST_EMPTY);
    }

    for (let email of allowedUsers) {
      validate([{ type: "email", value: email }])
    }

    const msg = await photoService.updatePhotoAccess(
      userEmail,
      photoId,
      allowedUsers
    );
    res.send({ statusCode: StatusCodes.OK, msg })
  };
