export interface ImagePersister {

  persist(accountId: string, imageBuffer: Buffer): Promise<string>
  
}
