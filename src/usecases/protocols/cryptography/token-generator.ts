import { TokenSet } from '@domain/models'

export interface TokenGenerator {

  generate(data: any): TokenSet

}
