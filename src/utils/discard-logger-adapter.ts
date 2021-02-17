import { Logger } from './logger'

export class DiscardLoggerAdapter implements Logger {
  debug(message: string): void {
    /* discard */
  }
  info(message: string): void {
    /* discard */
  }
  warn(message: string): void {
    /* discard */
  }
  error(message: string | Error): void {
    /* discard */
  }
  fatal(message: string | Error): void {
    /* discard */
  }

}
