export interface Logger {
  info(message: string | Error): void
  warn(message: string | Error): void
  error(message: string | Error): void
}

export class DoNothingLogger implements Logger {
  info(message: string | Error): void {
    //do nothing
  }
  warn(message: string | Error): void {
    //do nothing
  }
  error(message: string | Error): void {
    //do nothing
  }
}

export class ConsoleLogger implements Logger {
  info(message: string | Error): void {
    console.info(message)
  }
  warn(message: string | Error): void {
    console.warn(message)
  }
  error(message: string | Error): void {
    console.error(message)
  }
}
