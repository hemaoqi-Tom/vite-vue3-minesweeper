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
  private revealed = false;
  private mine = false;
  private mineCount: MineCount = -1;
  private flagged = false;

  constructor(
    public readonly position: Position,
    // 注入 chessboard 对象
    // 当 Block被翻开 / 插上小旗时
    // 通知 chessboard 更新其内部的 unrevealed 和 flagCount
    public readonly chessboard: Chessboard
  ) {}

  public getRevealed(): boolean {
    return this.revealed;
  }

  public setRevealed(revealed: boolean) {
    if (!this.revealed && !this.flagged && revealed) {
      this.revealed = revealed;
      this.chessboard.onBlockRevealed();
    }
  }

  public getMine(): boolean {
    return this.mine;
  }

  public setMine(mine: boolean) {
    if (mine) {
      this.mine = mine;
      this.mineCount = -1;
    }
  }

  public getMineCount(): MineCount {
    return this.mineCount;
  }

  public setMineCount(mineCount: MineCount) {
    if (mineCount >= -1 && mineCount <= 8) {
      this.mineCount = mineCount;
    }
  }

  public getFlagged(): boolean {
    return this.flagged;
  }

  public setFlagged(flagged: boolean) {
    if (!this.revealed) {
      this.flagged = flagged;
      this.chessboard.onBlockFlagged(flagged);
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
    return this.mineCount === 0;
  }

  /**
   * 是否为不安全格子
   * * **不安全格子**: 如果一个格子的周围格子存在炸弹, 则该格子为不安全格子
   * * **周围格子**: @see {@link Chessboard.getSiblingBlocks}
   * * **炸弹**: @see {@link Block.isMine}
   * @returns { boolean } 是否为不安全格子
   */
  public isUnsafeBlock(): boolean {
    return this.mineCount > 0;
  }

  /**
   * 是否为炸弹
   * * **炸弹** 如果一个格子的 mine 属性为 `true`, 则该格子为炸弹
   * @returns { boolean } 是否为炸弹
   */
  public isMine(): boolean {
    return this.mine;
  }
}
