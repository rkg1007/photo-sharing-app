export enum Error {
    USER_FOUND = "user already exists",
    USER_NOT_FOUND = "user doesn't exists",
    MISSING_VALUE = "missing one or more values",
    USER_LIST_EMPTY = "user list is empty. please provide user list",
    PASSWORD_NOT_MATCHED = "password doesn't match",
    NOT_AUTHORISED = "you are not authorized to perform this action",
    PHOTO_NOT_FOUND = "photo is not found",
    INVALID_AUTHORIZATION_TOKEN = "invalid authorization token",
    MISSING_AUTHORIZATION_TOKEN = "missing authorization token",
    INVALID_FILE_EXTENSION = "file extension is not supported.",
    NO_FIELD_CHANGED = "no field is changed",
}