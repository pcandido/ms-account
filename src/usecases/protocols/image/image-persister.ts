export interface ImagePersister {

  persist(fileName: string, imageBuffer: Buffer): Promise<string>

}
