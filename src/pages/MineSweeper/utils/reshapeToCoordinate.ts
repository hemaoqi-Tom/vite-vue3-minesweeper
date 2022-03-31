import { Position } from '../entities/Position.entity';

/**
 * 将 number[] 转换为 Position
 * @param { number[] } indexes 转换前的坐标
 * @param { number } cols 棋盘的列数
 * @returns { Position[] } 转换后的坐标数组
 */
export function reshapeToCoordinate(
  indexes: number[],
  cols: number
): Position[] {
  const coordinates = [] as Position[];

  for (let i = 0; i < indexes.length; i++) {
    const index = indexes[i];
    coordinates.push(new Position(Math.floor(index / cols), index % cols));
  }

  return coordinates;
}
