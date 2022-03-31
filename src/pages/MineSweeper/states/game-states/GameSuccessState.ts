import { Position } from '../../entities/Position.entity';

import { GameState } from '../GameState';
import { ArgumentsReadyState } from './ArgumentsReadyState';
import { LayoutReadyState } from './LayoutReadyState';

export class GameSuccessState extends GameState {
  private readonly state = 'GameSuccessState';

  public initArguments(rows: number, cols: number, mineCount: number): void {
    this.gameContext.setGameState(new ArgumentsReadyState());
    this.gameContext.initArguments(rows, cols, mineCount);
  }

  public initLayout(): void {}
  public initContent(firstClickPosition: Position): void {}
  public revealBlock(position: Position): void {}
  public revealSiblingBlocks(position: Position): void {}
  public toggleFlag(position: Position): void {}

  public succeed(): void {
    this.gameContext.chessboard.revealAllBlocks();
  }

  public fail(): void {}

  public restart(): void {
    this.gameContext.setGameState(new LayoutReadyState());
    this.gameContext.restart();
  }
}
