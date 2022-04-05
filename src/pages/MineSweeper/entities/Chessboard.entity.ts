import { Block } from './Block.entity';
import { Position } from './Position.entity';

import { ArgumentsError } from '../Error/ArgumentsError';

import { MineCount } from '../interfaces/MineCount.interface';

import { randomBetweenNExceptE } from '../utils/randomBetweenNExceptE';
import { reshapeToCoordinate } from '../utils/reshapeToCoordinate';

/**
 * 棋盘(Chessboard)类
 * @property { number } unrevealedCount 未翻开的格子数量
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
  private unrevealedCount: number = -1;
  private status: 'none' | 'fail' | 'success' = 'none';
  private board: Block[][] = [];
  private flagCount: number = 0;
  private rows: number;
  private cols: number;
  private mineCount: number;

  // private constructor
  // 只允许通过工厂方法创建 Chessboard, 不允许直接通过构造函数创建
  private constructor(rows: number, cols: number, mineCount: number) {
    this.rows = rows;
    this.cols = cols;
    this.mineCount = mineCount;
  }

  public getUnrevealedCount(): number {
    return this.unrevealedCount;
  }

  public setUnrevealedCount(unrevealedCount: number) {
    this.unrevealedCount = unrevealedCount;
  }

  public getStatus(): 'none' | 'fail' | 'success' {
    return this.status;
  }

  public setStatus(status: 'none' | 'fail' | 'success') {
    this.status = status;
  }

  public getBoard(): Block[][] {
    return this.board;
  }

  public setBoard(board: Block[][]) {
    this.board = board;
  }

  public getFlagCount(): number {
    return this.flagCount;
  }

  public setFlagCount(flagCount: number) {
    if (flagCount > 0) {
      this.flagCount = flagCount;
    }
  }

  public getRows(): number {
    return this.rows;
  }

  public setRows(rows: number) {
    this.rows = rows;
  }

  public getCols(): number {
    return this.cols;
  }

  public setCols(cols: number) {
    this.cols = cols;
  }

  public getMineCount(): number {
    return this.mineCount;
  }

  public setMineCount(mineCount: number) {
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
        console.log(123456);
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

    this.unrevealedCount = this.rows * this.cols;
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
      block.setMine(true);
      block.setMineCount(-1);
    }

    // 计算棋盘中 Block 周围雷的数量
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const block = this.access(new Position(i, j)) as Block;
        if (!block.getMine()) {
          const siblingBlocks = this.getSiblingBlocks(block.position);
          const mineCount = siblingBlocks.reduce(
            (mineCount, siblingBlock) =>
              mineCount + Number(siblingBlock.getMine()),
            0
          );
          block.setMineCount(mineCount as MineCount);
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

  /** 如果有格子打开了, 调用该方法通知棋盘减少 unrevealedCount */
  public onBlockRevealed() {
    this.unrevealedCount--;
  }

  /**
   * 如果有格子插上小旗 / 取消插上小旗, 调用该方法通知棋盘更改 flagCount
   * @param { boolean } newFlagged 插上小旗为 `true`, 反之为 `false`
   */
  public onBlockFlagged(flagged: boolean) {
    if (flagged) {
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
    if (block.getMine()) {
      this.status = 'fail';
    }
    if (this.unrevealedCount === this.mineCount) {
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

    if (block.getRevealed()) {
      return;
    }

    if (block.getFlagged()) {
      return;
    }

    block.setRevealed(true);
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
          floodingBlock.setRevealed(true);
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
        block.setFlagged(false);
        block.setRevealed(true);
      }
    }

    this.unrevealedCount = 0;
  }

  /**
   * 如果不安全格子的周围格子中，
   * 插入小旗的格子的数量 >= 该不安全格子的雷数,
   * 快捷翻开周围格子中未插入小旗的格子
   * @param { Position } position 格子坐标
   */
  public revealSiblingBlocks(position: Position) {
    const block = this.access(position) as Block;
    if (!block.getRevealed()) {
      return;
    }

    if (!block.isUnsafeBlock()) {
      return;
    }

    const siblingBlocks = this.getSiblingBlocks(position);

    // 统计旁边的小旗 flag
    const flagged = siblingBlocks.reduce(
      (flagCount, siblingBlock) =>
        flagCount + Number(siblingBlock.getFlagged()),
      0
    );

    // 确认是否快速翻开
    if (flagged >= block.getMineCount()) {
      for (const siblingBlock of siblingBlocks) {
        if (!siblingBlock.getFlagged()) {
          this.revealBlock(siblingBlock.position);
        }
      }
    }
  }
}
