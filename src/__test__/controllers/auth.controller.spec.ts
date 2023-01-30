import { loginUser } from "../../controllers";
import { Request, Response } from "express";
import authService from "../../services/auth.service";
import { BadRequest } from "../../errors";

const mockedCredentials = {
    email: "dummy email",
    password: "dummy password"
}

const req = {
    body: mockedCredentials
} as unknown as Request;

const res = {} as unknown as Response;
res.status = jest.fn(() => res);
res.json = jest.fn(() => res);

const next = jest.fn();

jest.mock("../../services/auth.service", () => {
    return {
        login: jest.fn()
    }
})

describe("login controller", () => {
    test("should call authService.login", async () => {
        await loginUser(req, res, next);
        expect(authService.login).toHaveBeenCalledWith(mockedCredentials);
    });

    test("should call res.status and res.json", async () => {
        await loginUser(req, res, next);
        expect(res.status).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalled();
    });

    test("should call next with error if email is missing", async () => {
        delete req.body.email;
        await loginUser(req, res, next)
        expect(next).toHaveBeenCalledWith(
          new BadRequest(
            "missing either one or more values from email and password"
          )
        );
    });

    test("should call next with error if password is missing", async () => {
      req.body.email = "email";
      delete req.body.password;
      await loginUser(req, res, next);
      expect(next).toHaveBeenCalledWith(
        new BadRequest(
          "missing either one or more values from email and password"
        )
      );
    });
})