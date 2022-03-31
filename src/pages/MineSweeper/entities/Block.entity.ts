import { Chessboard } from './Chessboard.entity';
import { Position } from './Position.entity';

import { MineCount } from '../interfaces/MineCount.interface';

/**
 * 格子(block)类, 用于抽象扫雷游戏中的方块格子
 * @property { boolean } revealed {@link Block.revealed} 格子是否打开(revealed)
 * @property { boolean } mine {@link Block.mine} 格子是否为炸弹(mine)
 * @property { number } mineCount {@link Block.mineCount} 格子周围格子(sibling blocks)的炸弹数量(mine count)
 * @property { boolean } flagged {@link Block.flagged} 格子是否插上小旗(flag)
 * @property { Position } position {@link Block.position} 格子在棋盘中的坐标(position)
 * @property { Chessboard } chessboard {@link Block.chessboard} 格子所属的棋盘(chessboard)
 *
 * @see {@link Position} 坐标类
 * @see {@link Chessboard} 棋盘类
 * @see {@link Chessboard.getSiblingBlocks} 周围格子
 */
export class Block {
  private _revealed = false;
  private _mine = false;
  private _mineCount: MineCount = -1;
  private _flagged = false;

  constructor(
    public readonly position: Position,
    // 注入 chessboard 对象
    // 当 Block被翻开 / 插上小旗时
    // 通知 chessboard 更新其内部的 unrevealed 和 flagCount
    public readonly chessboard: Chessboard
  ) {}

  public get revealed(): boolean {
    return this._revealed;
  }

  public set revealed(newRevealed: boolean) {
    if (!this._revealed && !this._flagged && newRevealed) {
      this._revealed = newRevealed;
      this.chessboard.onBlockRevealed();
    }
  }

  public get mine(): boolean {
    return this._mine;
  }

  public set mine(newMine: boolean) {
    if (newMine) {
      this._mine = newMine;
      this._mineCount = -1;
    }
  }

  public get mineCount(): MineCount {
    return this._mineCount;
  }

  public set mineCount(newMineCount: number) {
    if (newMineCount >= -1 && newMineCount <= 8) {
      this._mineCount = newMineCount as MineCount;
    }
  }

  public get flagged(): boolean {
    return this._flagged;
  }

  public set flagged(newFlagged: boolean) {
    if (!this._revealed) {
      this._flagged = newFlagged;
      this.chessboard.onBlockFlagged(newFlagged);
    }
  }

  /**
   * 是否为安全格子
   * * **安全格子**: 如果一个格子的周围格子均不为炸弹, 则该格子为安全格子
   * * **周围格子**: @see {@link Chessboard.getSiblingBlocks}
   * * **炸弹**: @see {@link Block}
   * @returns { boolean } 是否为 SafeBlock
   */
  public isSafeBlock(): boolean {
    return this._mineCount === 0;
  }

  /**
   * 是否为不安全格子
   * * **不安全格子**: 如果一个格子的周围格子存在炸弹, 则该格子为不安全格子
   * * **周围格子**: @see {@link Chessboard.getSiblingBlocks}
   * * **炸弹**: @see {@link Block.isMine}
   * @returns { boolean } 是否为不安全格子
   */
  public isUnsafeBlock(): boolean {
    return this._mineCount > 0;
  }

  /**
   * 是否为炸弹
   * * **炸弹** 如果一个格子的 mine 属性为 `true`, 则该格子为炸弹
   * @returns { boolean } 是否为炸弹
   */
  public isMine(): boolean {
    return this._mine;
  }
}
