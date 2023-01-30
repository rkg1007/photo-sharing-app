import { EMAIL_REGEX, Error } from "../constants";
import { BadRequest } from "../errors";

type ValidatSchema = {
  type: string;
  value: any;
};

export const validate = (req: ValidatSchema[]) => {
  for (let field of req) {
    const { type, value } = field;
    switch (type) {
      case "email":
        const isEmailValid = validateEmail(value);
        if (!isEmailValid) {
          throw new BadRequest(Error.INVALID_EMAIL);
        }
        break;
      case "password":
        const isPasswordValid = validatePassword(value);
        if (!isPasswordValid) {
          throw new BadRequest(Error.INVALID_PASSWORD);
        }
        break;
      case "name":
        const isNameValid = validateName(value);
        if (!isNameValid) {
          throw new BadRequest(Error.INVALID_NAME);
        }
        break;
      case "id": 
        const isValidId = Number.isInteger(value) && value > 0;
        if (!isValidId) {
            throw new BadRequest(Error.INVALID_ID);
        }
        break;
    }
  }
  return { isValid: true };
};

const validateEmail = (email: string) => {
  return EMAIL_REGEX.test(email);
};

const validateName = (name: string) => {
  for (const ch of name) {
    if (!validateAlphaNumeric(ch)) {
      return false;
    }
  }
  return name.length >= 3 && name.length <= 25;
};

const validatePassword = (password: string) => {
  const checkPoints = {
    smallCase: false,
    capitalCase: false,
    specialCase: false,
    numericalDigit: false,
    minLength: password.length >= 8,
    maxLength: password.length <= 20,
  };

  for (const ch of password) {
    if (isSmallCase(ch)) {
      checkPoints.smallCase = true;
    } else if (isCapitalCase(ch)) {
      checkPoints.capitalCase = true;
    } else if (isNumericalDigit(ch)) {
      checkPoints.numericalDigit = true;
    } else if (isSpecialChar(ch)) {
      checkPoints.specialCase = true;
    }
  }

  let isValid = true;
  for (const checkPoint of Object.values(checkPoints)) {
    isValid = isValid && checkPoint;
  }

  return isValid;
};

const validateAlphaNumeric = (text: string) => {
  for (const ch of text) {
    if (!isAlphaNumeric(ch)) {
      return false;
    }
  }
  return true;
};

const isAlphaNumeric = (ch: string) => {
  return isSmallCase(ch) || isCapitalCase(ch) || isNumericalDigit(ch);
};

const isSmallCase = (ch: string) => {
  return ch.length == 1 && ch >= "a" && ch <= "z";
};

const isCapitalCase = (ch: string) => {
  return ch.length == 1 && ch >= "A" && ch <= "Z";
};

const isNumericalDigit = (ch: string) => {
  return ch.length == 1 && ch >= "0" && ch <= "9";
};

const isSpecialChar = (ch: string) => {
  const specialChars = "!$%&*?@#&<>{}[]_%-?/\\|";
  return ch.length == 1 && specialChars.includes(ch);
};
