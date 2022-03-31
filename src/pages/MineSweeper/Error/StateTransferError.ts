/**
 * 状态转换错误
 * @property { Error } 导致状态转换错误的错误
 * @property { string } message 状态转换错误信息
 */
export class StateTransferError extends Error {
  constructor(public readonly error: Error, message: string) {
    super(message);
  }
}
