export interface PasswordReset {

  reset(token: string, password: string): Promise<void>

}
