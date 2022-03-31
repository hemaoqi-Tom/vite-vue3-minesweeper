import { Chessboard } from '../../entities/Chessboard.entity';
import { Position } from '../../entities/Position.entity';

import { ArgumentsError } from '../../Error/ArgumentsError';
import { StateTransferError } from '../../Error/StateTransferError';

import { GameState } from '../GameState';
import { LaunchedState } from './LaunchedState';
import { LayoutReadyState } from './LayoutReadyState';

export class ArgumentsReadyState extends GameState {
  private readonly state = 'ArgumentsReadyState';

  public initArguments(rows: number, cols: number, mineCount: number): void {
    try {
      const chessboard = Chessboard.createChessBoard(rows, cols, mineCount);
      this.gameContext.chessboard = chessboard;
    } catch (e: unknown) {
      this.gameContext.setGameState(new LaunchedState());

      const errorMessage = '转换到 ArgumentsReadyState 失败';
      throw new StateTransferError(e as ArgumentsError, errorMessage);
    }
  }

  public initLayout(): void {
    this.gameContext.setGameState(new LayoutReadyState());
    this.gameContext.initLayout();
  }

  public initContent(firstClickPosition: Position): void {}
  public revealBlock(position: Position): void {}
  public revealSiblingBlocks(position: Position): void {}
  public toggleFlag(position: Position): void {}
  public succeed(): void {}
  public fail(): void {}
  public restart(): void {}
}
