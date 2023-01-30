import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequest } from "../errors";
import photoService from "../services/photo.service";
import { asyncWrapper } from "../utils";

export const uploadPhoto = asyncWrapper(async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const file = req.file as Express.Multer.File;
    const photo = await photoService.uploadPhoto(userId, file);
    res.status(StatusCodes.OK).json({ data: photo });
});

export const fetchPhotos = asyncWrapper(async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const photos = await photoService.fetchPhotos(userId);
    res.status(StatusCodes.OK).json({ data: photos }); 
})

export const updatePhotoAccess = asyncWrapper(async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const photoId = Number(req.params.photoId);

    const { allowedUsers } = req.body;
    if (!allowedUsers || allowedUsers.length == 0) {
        throw new BadRequest("please send users list to allow access to users");
    }

    const msg = await photoService.updatePhotoAccess(userId, photoId, allowedUsers);
    res.status(StatusCodes.OK).json({ data: { msg } });
})