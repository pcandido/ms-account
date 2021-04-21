export interface TokenGenerator {

  generate(data: any, expiresInMinutes: number): string

}
