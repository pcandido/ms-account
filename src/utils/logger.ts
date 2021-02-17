export interface Logger {
  debug(message: string): void
  info(message: string): void
  warn(message: string): void
  error(message: string | Error): void
  fatal(message: string | Error): void
}
