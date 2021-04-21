export interface PasswordRecovery {

  recovery(email: string): Promise<void>

}
