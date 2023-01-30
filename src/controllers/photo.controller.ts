import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Error } from "../constants";
import { BadRequest } from "../errors";
import photoService from "../services/photo.service";

export const uploadPhoto = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const file = req.file as Express.Multer.File;
  const photo = await photoService.uploadPhoto(userId, file);
  res.send({ statusCode: StatusCodes.OK, photo });
};

export const fetchPhotos = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const photos = await photoService.fetchPhotos(userId);
  res.send({ statusCode: StatusCodes.OK, photos })
};

export const updatePhotoAccess = 
  async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const photoId = Number(req.params.photoId);

    const { allowedUsers } = req.body;
    if (!allowedUsers || allowedUsers.length == 0) {
      throw new BadRequest(Error.USER_LIST_EMPTY);
    }

    const msg = await photoService.updatePhotoAccess(
      userId,
      photoId,
      allowedUsers
    );
    res.send({ statusCode: StatusCodes.OK, msg })
  };
