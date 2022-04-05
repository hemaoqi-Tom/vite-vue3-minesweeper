import { computed, reactive, Ref, ref, toRef } from 'vue';

import { Block } from '../entities/Block.entity';
import { Position } from '../entities/Position.entity';

import { StateTransferError } from '../Error/StateTransferError';

import { GameContext } from '../states/GameContext';
import { GameFailState } from '../states/game-states/GameFailState';
import { GameReadyState } from '../states/game-states/GameReadyState';
import { GameSuccessState } from '../states/game-states/GameSuccessState';
import { LaunchedState } from '../states/game-states/LaunchedState';
import { LayoutReadyState } from '../states/game-states/LayoutReadyState';

/** 封装和游戏状态相关的响应式变量 */
export function useGameContext() {
  const gameContext = new GameContext();
  gameContext.setGameState(new LaunchedState());

  const currentGameContext = reactive(gameContext);
  const currentGameState = computed(() => currentGameContext.getGameState());
  const rows = computed({
    get: () =>
      currentGameContext.chessboard
        ? currentGameContext.chessboard.getRows()
        : 9,
    set: (rows) => {
      if (currentGameContext.chessboard) {
        currentGameContext.chessboard.setRows(rows);
      }
    },
  });
  const cols = computed({
    get: () =>
      currentGameContext.chessboard
        ? currentGameContext.chessboard.getCols()
        : 9,
    set: (cols) => {
      if (currentGameContext.chessboard) {
        currentGameContext.chessboard.setCols(cols);
      }
    },
  });
  const mineCount = computed({
    get: () =>
      currentGameContext.chessboard
        ? currentGameContext.chessboard.getMineCount()
        : 10,
    set: (mineCount) => {
      if (currentGameContext.chessboard) {
        currentGameContext.chessboard.setMineCount(mineCount);
      }
    },
  });
  const flagCount = computed(() =>
    currentGameContext.chessboard
      ? currentGameContext.chessboard.getFlagCount()
      : 0
  );
  const chessboard = computed(() => currentGameContext.chessboard);

  // 游戏当前状态为 showChessboardStates 列出的状态时, 显示棋盘
  const showChessboard = computed(() => {
    const showChessboardStates = [
      LayoutReadyState,
      GameReadyState,
      GameSuccessState,
      GameFailState,
    ];

    return showChessboardStates.some(
      (showChessboardState) =>
        currentGameContext.getGameState() instanceof showChessboardState
    );
  });

  // 游戏当前状态为 showToolboxStates 列出的状态时, 显示工具栏
  const showToolbox = computed(() => {
    const showToolboxStates = [GameReadyState, GameSuccessState, GameFailState];

    return showToolboxStates.some(
      (showToolboxState) =>
        currentGameContext.getGameState() instanceof showToolboxState
    );
  });

  const focusedPositions = ref<Position[]>([]) as Ref<Position[]>;

  // 用户提交预设方案
  function handleSubmitPreset(rows: number, cols: number, mineCount: number) {
    currentGameContext.initArguments(rows, cols, mineCount);
    currentGameContext.initLayout();
  }

  // 用户提交自定义方案
  function handleSubmitArguments(
    rows: number,
    cols: number,
    mineCount: number
  ) {
    try {
      currentGameContext.initArguments(rows, cols, mineCount);
    } catch (e: unknown) {
      const stateTransferError = e as StateTransferError;
      alert(stateTransferError.error.message);
    }

    currentGameContext.initLayout();
  }

  // 用户点击格子
  function handleClickBlock(block: Block) {
    if (!block.getRevealed()) {
      // 点击的是没有翻开的格子
      if (block.getFlagged()) {
        // 点击的是插入小旗的格子
      } else {
        // 点击的是没有插入小旗的格子
        currentGameContext.revealBlock(block.position);
      }
    } else if (block.isUnsafeBlock()) {
      // 点击的是翻开的不安全格子
      currentGameContext.revealSiblingBlocks(block.position);
    }
  }

  // 用户插入小旗 / 取消插入小旗
  function handleToggleFlag(block: Block) {
    if (!block.getRevealed()) {
      currentGameContext.toggleFlag(block.position);
    }
  }

  // 高亮格子
  function handleMouseOver(block: Block) {
    if (!block.getRevealed()) {
      focusedPositions.value.push(block.position);
    } else if (block.isUnsafeBlock()) {
      const rows = computed(() => currentGameContext.chessboard.getRows());
      const cols = computed(() => currentGameContext.chessboard.getCols());
      const siblingUnrevealedPositions = block.position
        .getSiblingPositions()
        .filter((position) => position.verifyPosition(rows.value, cols.value))
        .filter(
          (position) =>
            !currentGameContext.chessboard.access(position)!.getRevealed()
        );

      focusedPositions.value.push(...siblingUnrevealedPositions);
    }
  }

  // 取消高亮格子
  function handleMouseOut() {
    focusedPositions.value.length = 0;
  }

  return {
    currentGameContext,
    currentGameState,
    rows,
    cols,
    mineCount,
    flagCount,
    chessboard,
    showChessboard,
    showToolbox,
    focusedPositions,
    handleSubmitPreset,
    handleSubmitArguments,
    handleClickBlock,
    handleToggleFlag,
    handleMouseOver,
    handleMouseOut,
  };
}
