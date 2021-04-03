import { InvalidParamError } from '@controllers/errors'
import { Validator } from '@controllers/protocols'

export class ImageFieldValidator implements Validator {

  constructor(
    private fieldName: string,
    private sizeLimitMB: number,
  ) { }

  validate(input: any): void {
    const value = input[this.fieldName]

    if (!value) return

    if (!value.mimeType || !value.size || !value.buffer)
      throw new InvalidParamError(this.fieldName)

    if (!value.mimeType.match(/^image\//g))
      throw new InvalidParamError(this.fieldName)

    if (value.size > this.sizeLimitMB * 1024 * 1024)
      throw new InvalidParamError(this.fieldName)

  }

}
