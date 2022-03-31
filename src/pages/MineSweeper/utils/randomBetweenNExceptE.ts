/**
 * 在 [下限, 上限] 的范围内随机挑选一定数量的不重复整数, 且要求不包含指定数字
 * @param { number } lowerBound 下限
 * @param { number } upperBound 上限
 * @param { number } count 挑选数量
 * @param { number } exclude 不包含的指定数字
 * @returns { number[] } 随机挑选的整数
 */
export function randomBetweenNExceptE(
  lowerBound: number,
  upperBound: number,
  count: number,
  exclude: number
): number[] {
  // 从 randomPool 中挑选随机数
  const randomPool = Array.from(
    { length: upperBound - lowerBound + 1 },
    (item: number, index: number) => index + lowerBound
  );

  // 删除不加入 randomPool 的数字
  randomPool.splice(exclude - lowerBound, 1);

  if (count > upperBound - lowerBound + 1) {
    return randomPool;
  }

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * randomPool.length);
    const temp = randomPool[randomIndex];
    randomPool[randomIndex] = randomPool[randomPool.length - i - 1];
    randomPool[randomPool.length - i - 1] = temp;
  }

  return randomPool.slice(randomPool.length - count);
}
