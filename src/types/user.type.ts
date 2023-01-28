export type ICreateUser = {
    name: string,
    email: string,
    password: string
}

export type IUpdateUser = {
    name?: string,
    email?: string,
    password?: string
}
