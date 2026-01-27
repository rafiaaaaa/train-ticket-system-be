import { Request, Response } from "express";
import {
  getSeatService,
  getStationsService,
  getTrainSchedulesService,
} from "./train.service";
import { BadRequestError } from "../../shared/errors/BadRequestError";

export const getSeats = async (req: Request, res: Response) => {
  const { scheduleId } = req.params;

  if (typeof scheduleId !== "string") {
    throw new BadRequestError("Schedule ID are required");
  }

  const seats = await getSeatService(scheduleId);

  return res.status(200).json({
    success: true,
    data: seats,
  });
};

export const getTrainSchedules = async (req: Request, res: Response) => {
  const params = await req.query;

  const data = await getTrainSchedulesService(params);

  return res.status(200).json({
    succes: true,
    data,
  });
};

export const getStations = async (req: Request, res: Response) => {
  const query = await req.query;
  const stations = await getStationsService((query.q as string) || "");

  return res.status(200).json({
    success: true,
    data: stations,
  });
};
