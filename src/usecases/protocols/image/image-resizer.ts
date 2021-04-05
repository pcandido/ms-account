export interface ImageResizer {

  resize(image: Buffer, width: number, heigth: number): Promise<Buffer>

}
