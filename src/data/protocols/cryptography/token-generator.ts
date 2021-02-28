export interface TokenGenerator {

  generate(data: any): Promise<string>

}
