import { Chessboard } from '../entities/Chessboard.entity';
import { Position } from '../entities/Position.entity';

import { GameState } from './GameState';

/**
 * 游戏状态上下文
 * * 保存当前的游戏状态
 * * 实现状态间的数据共享
 * * 代理状态操作: 对外统一提供操作游戏逻辑的接口
 * @property { Chessboard } 游戏的棋盘对象, 在所有的 `GameState` 子类之间共享
 * @property { GameState } 其对应的游戏状态对象, 用于存储当前状态
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

  /**
   * 初始化游戏参数
   * @param { number } rows 行数
   * @param { number } cols 列数
   * @param { number } mineCount 炸弹数
   * @see {@link GameState.initArguments}
   */
  public initArguments(rows: number, cols: number, mineCount: number) {
    this.gameState.initArguments(rows, cols, mineCount);
  }

  /**
   * 初始化游戏布局
   * @see {@link GameState.initLayout}
   */
  public initLayout() {
    this.gameState.initLayout();
  }

  /**
   * 初始化游戏内容
   * @param { Position } firstClickPosition 第一次点击位置
   * @see {@link GameState.initContent}
   */
  public initContent(firstClickPosition: Position) {
    this.gameState.initContent(firstClickPosition);
  }

  /**
   * 翻开格子
   * @param { Position } position 翻开的格子的坐标
   * @see {@link GameState.revealBlock}
   */
  public revealBlock(position: Position) {
    this.gameState.revealBlock(position);
  }

  /**
   * 翻开周围的格子
   * @param { Position } position 翻开该坐标周围的格子
   * @see {@link GameState.revealSiblingBlocks}
   */
  public revealSiblingBlocks(position: Position) {
    this.gameState.revealSiblingBlocks(position);
  }

  /**
   * 向格子插入小旗 / 取消插入小旗
   * @param { Position } position 插入小旗 / 取消插入小旗的位置
   * @see {@link GameState.toggleFlag}
   */
  public toggleFlag(position: Position) {
    this.gameState.toggleFlag(position);
  }

  /**
   * 游戏胜利
   * @see {@link GameState.succeed}
   */
  public succeed() {
    this.gameState.succeed();
  }

  /**
   * 游戏失败
   * @see {@link GameState.fail}
   */
  public fail() {
    this.gameState.fail();
  }

  /**
   * 游戏重新开始
   * @see {@link GameState.restart}
   */
  public restart() {
    this.gameState.restart();
  }
}
