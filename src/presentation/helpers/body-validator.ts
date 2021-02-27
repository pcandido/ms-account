import { MissingParamError } from '@presentation/errors'

export const bodyValidator = (body: any, requiredFields: string[]): void => {

  for (const field of requiredFields) {
    if (!body[field])
      throw new MissingParamError(field)
  }

}
