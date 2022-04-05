import { Position } from '../entities/Position.entity';

import { GameContext } from './GameContext';
import { LaunchedState } from './game-states/LaunchedState';
import { ArgumentsReadyState } from './game-states/ArgumentsReadyState';
import { LayoutReadyState } from './game-states/LayoutReadyState';
import { GameReadyState } from './game-states/GameReadyState';
import { GameSuccessState } from './game-states/GameSuccessState';
import { GameFailState } from './game-states/GameFailState';

/**
 * 游戏状态类
 * @abstract
 * @property { GameContext } 其对应的游戏状态上下文对象
 */
export abstract class GameState {
  protected gameContext!: GameContext;

  public getGameContext() {
    return this.gameContext;
  }

  public setGameContext(gameContext: GameContext) {
    this.gameContext = gameContext;
  }

  /**
   * 初始化游戏参数
   * @see {@link LaunchedState.initArguments}
   * @see {@link ArgumentsReadyState.initArguments}
   * @see {@link LayoutReadyState.initArguments}
   * @see {@link GameReadyState.initArguments}
   * @see {@link GameFailState.initArguments}
   * @see {@link GameSuccessState.initArguments}
   */
  public abstract initArguments(
    rows: number,
    cols: number,
    mineCount: number
  ): void;

  /**
   * 初始化游戏布局
   * @see {@link ArgumentsReadyState.initLayout}
   * @see {@link LayoutReadyState.initLayout}
   */
  public abstract initLayout(): void;

  /**
   * 初始化游戏内容
   * @see {@link LayoutReadyState.initContent}
   * @see {@link GameReadyState.initContent}
   */
  public abstract initContent(firstClickPosition: Position): void;

  /**
   * 翻开格子
   * @see {@link GameReadyState.revealBlock}
   */
  public abstract revealBlock(position: Position): void;

  /**
   * 翻开周围的格子
   * @see {@link GameReadyState.revealSiblingBlocks}
   */
  public abstract revealSiblingBlocks(position: Position): void;

  /**
   * 向格子插入小旗 / 取消插入小旗
   * @see {@link GameReadyState.toggleFlag}
   */
  public abstract toggleFlag(position: Position): void;

  /**
   * 游戏胜利
   * @see {@link GameReadyState.succeed}
   * @see {@link GameSuccessState.succeed}
   */
  public abstract succeed(): void;

  /**
   * 游戏失败
   * @see {@link GameReadyState.fail}
   * @see {@link GameFailState.fail}
   */
  public abstract fail(): void;

  /**
   * 游戏重新开始
   * @see {@link LayoutReadyState.restart}
   * @see {@link GameReadyState.restart}
   * @see {@link GameSuccessState.restart}
   * @see {@link GameFailState.restart}
   */
  public abstract restart(): void;
}
