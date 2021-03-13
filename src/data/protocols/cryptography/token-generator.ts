import { AuthenticatedTokens } from '@domain/usecases'

export interface TokenGenerator {

  generate(data: any): AuthenticatedTokens

}
