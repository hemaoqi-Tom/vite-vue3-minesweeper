/**
 * 坐标(position)类
 * @property { number } x 格子在棋盘中的 x 坐标
 * @property { number } y 格子在棋盘中的 y 坐标
 */
export class Position {
  static readonly DIRECTIONS = (
    [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
      [-1, -1],
      [1, 1],
      [-1, 1],
      [1, -1],
    ] as [number, number][]
  ).map((positionLike) => new Position(...positionLike));

  constructor(public readonly x: number, public readonly y: number) {}

  /**
   * 和其他坐标相加
   * @param { Position } otherPosition 其他坐标
   * @returns { Position } 相加后的坐标
   */
  public addPosition(otherPosition: Position) {
    return new Position(this.x + otherPosition.x, this.y + otherPosition.y);
  }

  /**
   * 获取坐标的周围坐标
   *
   * ⚠ 坐标可能越界, 建议使用 verifyPosition 进行边界检查
   * @see {@link Position.verifyPosition}
   * @example
   * ```typescript
   * const position = new Position(1, 3);
   * const siblingPositions = position
   *   .getSiblingPositions()
   *   .filter((siblingPosition) => siblingPosition.verifyPosition(rows, cols));
   * ```
   * @returns { Position[] } 周围坐标
   */
  public getSiblingPositions(): Position[] {
    return Position.DIRECTIONS.map((direction) => direction.addPosition(this));
  }

  /**
   * 坐标的边界检查
   * @param { number } r 棋盘的行数
   * @param { number } c 棋盘的列数
   * @returns { boolean } 坐标是否合法
   */
  public verifyPosition(r: number, c: number): boolean {
    return this.x >= 0 && this.x < r && this.y >= 0 && this.y < c;
  }

  /**
   * 判断两个坐标是否相同
   * @param { Position } otherPosition 其他坐标
   * @returns { boolean } 是否相同
   */
  public equals(otherPosition: Position): boolean {
    return this.x === otherPosition.x && this.y === otherPosition.y;
  }
}
