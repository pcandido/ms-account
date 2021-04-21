export interface PasswordRecovery {

  recover(email: string): Promise<void>

}
