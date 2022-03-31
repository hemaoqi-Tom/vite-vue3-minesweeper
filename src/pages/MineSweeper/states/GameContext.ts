import { Chessboard } from '../entities/Chessboard.entity';
import { Position } from '../entities/Position.entity';

import { GameState } from './GameState';

/**
 * 游戏状态上下文
 * * 保存当前的游戏状态
 * * 实现状态间的数据共享
 * * 代理状态操作
 */
export class GameContext {
  public chessboard: Chessboard = Chessboard.createChessBoard(9, 9, 10);
  private gameState!: GameState;

  public getGameState(): GameState {
    return this.gameState;
  }

  public setGameState(gameState: GameState) {
    this.gameState = gameState;
    this.gameState.setGameContext(this);
  }

  public initArguments(rows: number, cols: number, mineCount: number) {
    this.gameState.initArguments(rows, cols, mineCount);
  }

  public initLayout() {
    this.gameState.initLayout();
  }

  public initContent(firstClickPosition: Position) {
    this.gameState.initContent(firstClickPosition);
  }

  public revealBlock(position: Position) {
    this.gameState.revealBlock(position);
  }

  public revealSiblingBlocks(position: Position) {
    this.gameState.revealSiblingBlocks(position);
  }

  public toggleFlag(position: Position) {
    this.gameState.toggleFlag(position);
  }

  public succeed() {
    this.gameState.succeed();
  }

  public fail() {
    this.gameState.fail();
  }

  public restart() {
    this.gameState.restart();
  }
}
