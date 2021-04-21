import { TokenSet } from '@domain/models'

export interface TokenSetGenerator {

  generateSet(data: any, remember: boolean): TokenSet

}
