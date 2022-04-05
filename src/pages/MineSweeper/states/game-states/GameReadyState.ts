import { Position } from '../../entities/Position.entity';

import { GameState } from '../GameState';
import { ArgumentsReadyState } from './ArgumentsReadyState';
import { GameFailState } from './GameFailState';
import { GameSuccessState } from './GameSuccessState';
import { LayoutReadyState } from './LayoutReadyState';

export class GameReadyState extends GameState {
  private readonly state = 'GameReadyState';

  public initArguments(rows: number, cols: number, mineCount: number): void {
    this.gameContext.setGameState(new ArgumentsReadyState());
    this.gameContext.initArguments(rows, cols, mineCount);
  }

  public initLayout(): void {}

  public initContent(firstClickPosition: Position): void {
    this.gameContext.chessboard.initContent(firstClickPosition);
  }

  public revealBlock(position: Position): void {
    this.gameContext.chessboard.revealBlock(position);
    this.gameContext.chessboard.judgeFailOrSuccess(position);
    const status = this.gameContext.chessboard.getStatus();
    if (status === 'success') {
      this.succeed();
    } else if (status === 'fail') {
      this.fail();
    }
  }

  public revealSiblingBlocks(position: Position): void {
    this.gameContext.chessboard.revealSiblingBlocks(position);
    this.gameContext.chessboard.judgeFailOrSuccess(position);
    const status = this.gameContext.chessboard.getStatus();
    if (status === 'success') {
      this.succeed();
    } else if (status === 'fail') {
      this.fail();
    }
  }

  public toggleFlag(position: Position): void {
    const block = this.gameContext.chessboard.access(position);
    if (!block) {
      return;
    }
    block.setFlagged(!block.getFlagged());
  }

  public succeed(): void {
    this.gameContext.setGameState(new GameSuccessState());
    this.gameContext.succeed();
  }

  public fail(): void {
    this.gameContext.setGameState(new GameFailState());
    this.gameContext.fail();
  }

  public restart(): void {
    this.gameContext.setGameState(new LayoutReadyState());
    this.gameContext.restart();
  }
}
