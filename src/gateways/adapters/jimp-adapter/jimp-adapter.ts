import Jimp from 'jimp'
import { ImageResizer } from '@usecases/protocols/image/image-resizer'

export class JimpAdapter implements ImageResizer {

  async resize(image: Buffer, width: number, heigth: number): Promise<Buffer> {
    const jimpImage = await Jimp.read(image)
    const mimeType = jimpImage.getMIME()
    const scaled = await jimpImage.scaleToFit(width, heigth)
    return await scaled.getBufferAsync(mimeType)
  }

}
