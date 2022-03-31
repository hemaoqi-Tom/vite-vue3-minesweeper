import { Block } from './Block.entity';
import { Position } from './Position.entity';

import { ArgumentsError } from '../Error/ArgumentsError';

import { randomBetweenNExceptE } from '../utils/randomBetweenNExceptE';
import { reshapeToCoordinate } from '../utils/reshapeToCoordinate';

/**
 * 棋盘(Chessboard)类
 * @property { number } unrevealed 未翻开的格子数量
 * @property { 'none' | 'fail' | 'success' } status 棋盘的状态
 * * `none` 代表游戏还未结束
 * * `fail` 代表游戏失败
 * * `success` 代表游戏成功
 * @property { Block[][] } board 棋盘的格子
 * @property { number } flagCount 棋盘中插上小旗的格子数量
 * @property { number } rows 棋盘的行数
 * @property { number } cols 棋盘的列数
 * @property { number } mineCount 棋盘中炸弹格子数量
 */
export class Chessboard {
  private unrevealed: number = -1;
  public status: 'none' | 'fail' | 'success' = 'none';
  public board: Block[][] = [];
  public flagCount: number = 0;
  public rows: number;
  public cols: number;
  public mineCount: number;

  private constructor(rows: number, cols: number, mineCount: number) {
    this.rows = rows;
    this.cols = cols;
    this.mineCount = mineCount;
  }

  /**
   * 工厂方法, 对输入的参数进行检查, 创建 Chessboard 对象
   * @param { number } rows 棋盘的行数
   * @param { number } cols 棋盘的列数
   * @param { number } mineCount 棋盘中炸弹格子数量
   * @returns { Chessboard } 创建的 Chessboard 对象
   *
   * @throws 如果参数不符合要求, 抛出 ArgumentsError
   * @see {@link ArgumentsError}
   */
  static createChessBoard(
    rows: number,
    cols: number,
    mineCount: number
  ): Chessboard {
    const validationRules = [
      {
        rule: () => rows > 5,
        message: '棋盘不能少于 5 行',
      },
      {
        rule: () => cols > 5,
        message: '棋盘不能少于 5 列',
      },
      {
        rule: () => mineCount > 0,
        message: '雷的数量不能少于 0',
      },
      {
        rule: () => mineCount < rows * cols,
        message: '雷的数量不能多于棋盘的容量',
      },
    ];

    for (const validationRule of validationRules) {
      if (!validationRule.rule()) {
        throw new ArgumentsError(validationRule.message);
      }
    }

    return new Chessboard(rows, cols, mineCount);
  }

  /**
   * 访问棋盘中的某一个格子
   * @param { Position } position 格子坐标
   * @returns { Block | null } 如果坐标合法, 返回 Block, 否则返回 null
   */
  public access(position: Position): Block | null {
    if (position.verifyPosition(this.rows, this.cols)) {
      return this.board[position.x][position.y];
    }
    return null;
  }

  /**
   * 访问棋盘上某一个坐标的周围格子
   * * **格子的周围格子** 挨着该格子的 8 个格子(如果是靠边的格子, 可能是 5 个 or 3 个格子)
   * @param { Position } position 格子坐标
   * @returns { Block[] } 格子的周围格子
   */
  public getSiblingBlocks(position: Position): Block[] {
    const validSiblingPositions = position
      .getSiblingPositions()
      .filter((siblingPosition) =>
        siblingPosition.verifyPosition(this.rows, this.cols)
      );

    const siblingBlocks = validSiblingPositions.map(
      (validSiblingPosition) => this.access(validSiblingPosition) as Block
    );

    return siblingBlocks;
  }

  /** 初始化棋盘布局, 但不初始化数据 */
  public initLayout() {
    this.reset();

    for (let i = 0; i < this.rows; i++) {
      const blockRow = [] as Block[];
      for (let j = 0; j < this.cols; j++) {
        const block = new Block(new Position(i, j), this);
        blockRow.push(block);
      }
      this.board.push(blockRow);
    }

    this.unrevealed = this.rows * this.cols;
    this.flagCount = 0;
  }

  /** 初始化数据, 需要先初始化棋盘布局 */
  public initContent(firstClickPosition: Position) {
    // 初始点击的位置不生成雷, 需要提前排除
    const excludeIndex =
      firstClickPosition.x * this.cols + firstClickPosition.y;
    const totalCount = this.rows * this.cols;

    // 随机产生雷的位置
    const minePositions = reshapeToCoordinate(
      randomBetweenNExceptE(0, totalCount - 1, this.mineCount, excludeIndex),
      this.cols
    );

    // 向棋盘中填充雷
    for (const minePosition of minePositions) {
      const block = this.access(minePosition) as Block;
      block.mine = true;
      block.mineCount = -1;
    }

    // 计算棋盘中 Block 周围雷的数量
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const block = this.access(new Position(i, j)) as Block;
        if (!block.mine) {
          const siblingBlocks = this.getSiblingBlocks(block.position);
          block.mineCount = siblingBlocks.reduce(
            (mineCount, siblingBlock) => mineCount + Number(siblingBlock.mine),
            0
          );
        }
      }
    }
  }

  /** 重置棋盘布局 */
  public reset() {
    if (this.board.length > 0) {
      this.board.length = 0;
    }
  }

  /** 如果有格子打开了, 调用该方法通知棋盘减少 unrevealed */
  public onBlockRevealed() {
    this.unrevealed--;
  }

  /**
   * 如果有格子插上小旗 / 取消插上小旗, 调用该方法通知棋盘更改 flagCount
   * @param { boolean } newFlagged 插上小旗为 `true`, 反之为 `false`
   */
  public onBlockFlagged(newFlagged: boolean) {
    if (newFlagged) {
      this.flagCount++;
    } else {
      this.flagCount++;
    }
  }

  /**
   * 判断棋盘状态是否需要改变, 即判断是否出现游戏胜利 / 失败的情况
   * @param { Position } currentClickPosition 当前翻开的格子坐标
   */
  public judgeFailOrSuccess(currentClickPosition: Position) {
    const block = this.access(currentClickPosition) as Block;
    if (block.mine) {
      this.status = 'fail';
    }
    if (this.unrevealed === this.mineCount) {
      this.status = 'success';
    }
  }

  /**
   * 翻开棋盘中某个格子
   * @param { Position } position 格子坐标
   */
  public revealBlock(position: Position) {
    const block = this.access(position);
    if (!block) {
      return;
    }

    if (block.revealed) {
      return;
    }

    if (block.flagged) {
      return;
    }

    block.revealed = true;
    this.judgeFailOrSuccess(block.position);

    // 如果是 safeBlock, flooding
    if (block.isSafeBlock()) {
      const visited = [block.position] as Position[];
      const queue = block.position
        .getSiblingPositions()
        .filter((position) => position.verifyPosition(this.rows, this.cols));

      while (queue.length) {
        const position = queue.shift() as Position;
        if (position.verifyPosition(this.rows, this.cols)) {
          const floodingBlock = this.access(position) as Block;
          floodingBlock.revealed = true;
          visited.push(position);

          if (floodingBlock.isSafeBlock()) {
            const siblingPositions = floodingBlock.position
              .getSiblingPositions()
              .filter((position) =>
                position.verifyPosition(this.rows, this.cols)
              );

            for (const siblingPosition of siblingPositions) {
              const existInVisited = visited.some((position) =>
                position.equals(siblingPosition)
              );
              const existInQueue = queue.some((position) =>
                position.equals(siblingPosition)
              );

              if (!existInVisited && !existInQueue) {
                queue.push(siblingPosition);
              }
            }
          }
        }
      }
    }

    this.judgeFailOrSuccess(block.position);
  }

  /** 打开所有格子, 在棋盘状态是 fail or success 的时候打开, 仅用于查看结果 */
  public revealAllBlocks() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const block = this.access(new Position(i, j)) as Block;
        block.flagged = false;
        block.revealed = true;
      }
    }

    this.unrevealed = 0;
  }

  /**
   * 如果不安全格子的周围格子中，
   * 插入小旗的格子的数量 >= 该不安全格子的雷数,
   * 快捷翻开周围格子中未插入小旗的格子
   * @param { Position } position 格子坐标
   */
  public revealSiblingBlocks(position: Position) {
    const block = this.access(position) as Block;
    if (!block.revealed) {
      return;
    }

    if (!block.isUnsafeBlock()) {
      return;
    }

    const siblingBlocks = this.getSiblingBlocks(position);

    // 统计旁边的小旗 flag
    const flagged = siblingBlocks.reduce(
      (flagCount, siblingBlock) => flagCount + Number(siblingBlock.flagged),
      0
    );

    // 确认是否快速翻开
    if (flagged >= block.mineCount) {
      for (const siblingBlock of siblingBlocks) {
        if (!siblingBlock.flagged) {
          this.revealBlock(siblingBlock.position);
        }
      }
    }
  }
}
