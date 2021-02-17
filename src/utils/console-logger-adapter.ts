import { Logger } from './logger'

export class ConsoleLoggerAdapter implements Logger {

  debug(message: string): void {
    console.info(message)
  }
  info(message: string): void {
    console.info(message)
  }
  warn(message: string): void {
    console.warn(message)
  }
  error(message: string | Error): void {
    console.error(message)
  }
  fatal(message: string | Error): void {
    console.error(message)
  }

}
