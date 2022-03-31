import { Position } from '../../entities/Position.entity';

import { GameState } from '../GameState';
import { ArgumentsReadyState } from './ArgumentsReadyState';
import { GameReadyState } from './GameReadyState';

export class LayoutReadyState extends GameState {
  private readonly state = 'LayoutReadyState';

  public initArguments(rows: number, cols: number, mineCount: number): void {
    this.gameContext.setGameState(new ArgumentsReadyState());
    this.gameContext.initArguments(rows, cols, mineCount);
  }

  public initLayout(): void {
    this.gameContext.chessboard.initLayout();
  }

  public initContent(firstClickPosition: Position): void {
    this.gameContext.setGameState(new GameReadyState());
    this.gameContext.initContent(firstClickPosition);
  }

  public revealBlock(position: Position): void {
    this.initContent(position);
    this.gameContext.revealBlock(position);
  }

  public revealSiblingBlocks(position: Position): void {}
  public toggleFlag(position: Position): void {}
  public succeed(): void {}
  public fail(): void {}

  public restart(): void {
    this.gameContext.chessboard.reset();
    this.initLayout();
  }
}
