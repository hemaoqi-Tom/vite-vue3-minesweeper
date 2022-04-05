<script setup lang="ts">
import { Block } from './entities/Block.entity';

import { useGameContext } from './hooks/useGameContext';
import { useTheme } from './hooks/useTheme';

import { GameReadyState } from './states/game-states/GameReadyState';
import { GameFailState } from './states/game-states/GameFailState';
import { GameSuccessState } from './states/game-states/GameSuccessState';

import FlagSVG from './SVGs/FlagSVG.vue';
import MineSVG from './SVGs/MineSVG.vue';
import SunSVG from './SVGs/SunSVG.vue';
import MoonSVG from './SVGs/MoonSVG.vue';

import './themes/light.scss';
import './themes/dark.scss';

const { theme, changeThemeSwitch } = useTheme();
const {
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
} = useGameContext();
</script>

<template>
  <div id="mine-sweeper" :class="theme">
    <!-- banner -->
    <div
      class="banner d-flex align-center"
      :class="
        currentGameState instanceof GameSuccessState
          ? 'success'
          : currentGameState instanceof GameFailState
          ? 'fail'
          : ''
      "
    >
      <!-- 应用标题 -->
      <h1 class="banner-heading d-flex align-center">
        <MineSVG :theme="theme" class="banner-heading__icon" />
        <span>MineSweeper</span>
      </h1>

      <div class="spacer"></div>

      <!-- 工具箱, 显示游戏运行时信息 -->
      <!-- eslint-disable -->
      <div v-if="showToolbox" class="toolbox d-flex align-center">
        <span class="toolbox-remaining-mine-count">
          {{
            currentGameState instanceof GameReadyState ?
              `[剩余炸弹数] ${ mineCount - flagCount }` :
              (
                currentGameState instanceof GameFailState ?
                  '本局游戏失败' :
                  '本局游戏胜利'
              )
          }}
        </span>
        
        <button class="toolbox-restart" @click="handleSubmitArguments(rows, cols, mineCount)">
          重开一局
        </button>
      </div>
      <!-- eslint-enable -->

      <!-- 游戏设置 -->
      <div class="configuration">
        <span class="configuration-dropdown-trigger">游戏设置</span>
        <div class="configuration-dropdown-content">
          <!-- 预设难度, 一键开始游戏 -->
          <div class="presets">
            <h2 class="configuration-dropdown-content__title presets-title">
              预设游戏难度
            </h2>
            <button
              class="configuration-dropdown-content__button presets-beginner"
              @click="handleSubmitPreset(9, 9, 10)"
            >
              初级
            </button>
            <button
              class="configuration-dropdown-content__button presets-medium"
              @click="handleSubmitPreset(16, 16, 40)"
            >
              中级
            </button>
            <button
              class="configuration-dropdown-content__button presets-hard"
              @click="handleSubmitPreset(16, 30, 99)"
            >
              高级
            </button>
            <button
              class="configuration-dropdown-content__button presets-heil"
              @click="handleSubmitPreset(16, 30, 199)"
            >
              地狱
            </button>
          </div>

          <!-- 自定义难度 -->
          <!-- eslint-disable -->
          <div class="customization">
            <h2 class="configuration-dropdown-content__title presets-title">
              自定义
            </h2>
            <div class="customization-input-wrapper">
              <!-- 输入行 -->
              <div
                class="customization-input customization-input__rows d-flex align-center"
              >
                <label
                  class="customization-input-label"
                  for="customization-input__rows-input"
                >
                  行数：
                </label>

                <input
                  id="customization-input__rows-input"
                  v-model="rows"
                  type="number"
                />
              </div>

              <!-- 输入列 -->
              <div
                class="customization-input customization-input__cols d-flex align-center"
              >
                <label
                  class="customization-input-label"
                  for="customization-input__cols-input"
                >
                  列数：
                </label>

                <input
                  id="customization-input__cols-input"
                  v-model="cols"
                  type="number"
                />
              </div>

              <!-- 输入炸弹 -->
              <div
                class="customization-input customization-input__mine-count d-flex align-center"
              >
                
                <label 
                  class="customization-input-label" 
                  for="customization-input__mine-count-input"
                >
                  炸弹：
                </label>
                
                <input
                  id="customization-input__mine-count-input"
                  v-model="mineCount"
                  type="number"
                />
              </div>

              <!-- 生成游戏 -->
              <div class="customization-submit">
                <button
                  class="customization-submit-button"
                  @click="handleSubmitArguments(rows, cols, mineCount)"
                >
                  使用自定义雷区开始游戏
                </button>
              </div>
            </div>
          </div>
          <!-- eslint-enable -->
        </div>
      </div>

      <!-- 切换主题 -->
      <div class="change-theme d-flex align-center">
        <SunSVG />
        <label class="change-theme-switch__wrapper">
          <input
            v-model="changeThemeSwitch"
            class="change-theme-switch__switcher"
            type="checkbox"
          />
          <div class="change-theme-switch__slider"></div>
        </label>
        <MoonSVG />
      </div>
    </div>

    <!-- main -->
    <div class="main d-flex align-center justify-center">
      <div v-if="showChessboard" class="chessboard">
        <div class="chessboard-inner-wrapper">
          <div
            v-for="(chessboardRow, row) in chessboard.getBoard()"
            :key="row"
            class="chessboard-row d-flex align-start"
          >
            <div
              v-for="(block, col) in chessboardRow"
              :key="col"
              class="chessboard-block d-inline-flex align-center justify-center"
              :class="[
                // 是否 focus, 会有深色特效
                focusedPositions.some((focusedPosition) =>
                  focusedPosition.equals(block.position)
                )
                  ? 'focused'
                  : '',
                // 旁边有几颗雷, 字体颜色
                block.getRevealed() && block.isUnsafeBlock()
                  ? 'mine' + block.getMineCount()
                  : '',
                // 没有打开的格子加上颜色
                !block.getRevealed() && !block.getFlagged() ? 'unrevealed' : '',
                // 没有打开的旗格
                !block.getRevealed() && block.getFlagged() ? 'flagged' : '',
              ]"
              @click="handleClickBlock(block as Block)"
              @contextmenu.prevent="handleToggleFlag(block as Block)"
              @mouseover="handleMouseOver(block as Block)"
              @mouseout="handleMouseOut"
            >
              <div
                v-if="!block.getRevealed() && !block.getFlagged()"
                class="chessboard-block__unrevealed"
              ></div>
              <div
                v-else-if="!block.getRevealed() && block.getFlagged()"
                class="chessboard-block__flagged d-flex align-center justify-center"
              >
                <FlagSVG />
              </div>
              <div
                v-else-if="block.getMine()"
                class="chessboard-block__mine d-flex align-center justify-center"
              >
                <MineSVG :theme="theme" />
              </div>
              <div
                v-else-if="block.getMineCount() === 0"
                class="chessboard-block__safe"
              ></div>
              <div v-else class="chessboard-block__unsafe">
                {{ block.getMineCount() }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.banner {
  height: 64px;
  padding: 0 32px;
  transition: background-color 0.4s ease-in-out;

  .banner-heading {
    margin: 0;
    font: {
      size: 28px;
      weight: 400;
    }

    .banner-heading__icon {
      margin: {
        right: 16px;
      }
    }
  }

  .toolbox {
    height: 48px;

    .toolbox-remaining-mine-count {
      margin-right: 16px;
    }

    .toolbox-restart {
      height: 48px;
      padding: 0 24px;
      outline: none;
      border: none;
      background-color: transparent;
      font: {
        size: 16px;
        weight: 400;
      }
      transition: background-color 0.2s ease-in-out;
    }
  }

  .configuration {
    display: inline-block;
    position: relative;
    height: 48px;
    padding: 0 24px;

    transition: 0.2s;
    cursor: default;

    .configuration-dropdown-trigger {
      line-height: 48px;
      font: {
        size: 16px;
        weight: 400;
      }
    }

    .configuration-dropdown-content {
      position: absolute;
      top: 48px;
      right: 0px;
      padding: 16px;
      min-width: 256px;

      visibility: hidden;
      opacity: 0;
      // debug
      // visibility: visible;
      // opacity: 1;
      transition: visibility 0s, opacity 0.2s linear;
      box-shadow: 0 0 10px #0005;

      .configuration-dropdown-content__title {
        text-align: center;
        margin: 16px 0;
        font: {
          size: 20px;
          weight: 500;
        }
      }

      .configuration-dropdown-content__button {
        margin: 4px 2%;
        padding: 0;
        width: 46%;
        height: 48px;

        font: {
          size: 14px;
        }
        cursor: pointer;
        border: none;
        outline: none;
        border-radius: 6px;
        transition: background-color 0.2s ease-in-out;
      }

      .presets {
        padding-bottom: 16px;
      }

      .customization {
        .customization-input {
          height: 48px;
          display: flex;

          .customization-input-label {
            font-size: 16px;
            min-width: 50px;
          }

          input {
            padding: 0 8px;
            height: 36px;

            outline: none;
            border: none;
            background-color: transparent;
            font-size: 16px;
            flex-grow: 1;
          }
        }

        .customization-submit {
          .customization-submit-button {
            width: 100%;
            height: 48px;
            margin-top: 16px;

            outline: none;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out;
          }
        }
      }
    }

    &:hover .configuration-dropdown-content {
      visibility: visible;
      opacity: 1;
    }
  }

  .change-theme {
    margin-left: 24px;

    .change-theme-switch__wrapper {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 28px;
      margin: 0 8px;

      .change-theme-switch__switcher {
        display: none;
      }

      .change-theme-switch__slider {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        cursor: pointer;
        background-color: #eee;
        transition: 0.4s;
        border-radius: 28px;

        &::before {
          position: absolute;
          height: 20px;
          width: 20px;
          left: 4px;
          bottom: 4px;

          content: '';
          background-color: #fff;
          transition: 0.2s;
          border-radius: 50%;
        }
      }

      .change-theme-switch__switcher:checked + .change-theme-switch__slider {
        background-color: #1c1c1e;
      }

      .change-theme-switch__switcher:focus + .change-theme-switch__slider {
        box-shadow: 0 0 1px #1c1c1e;
      }

      .change-theme-switch__switcher:checked
        + .change-theme-switch__slider::before {
        transform: translateX(22px);
      }
    }
  }
}

.main {
  padding: 32px;
  min-height: calc(100vh - 128px);

  .chessboard {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    .chessboard-inner-wrapper {
      display: block;
    }

    .chessboard-block {
      width: 32px;
      height: 32px;
      margin: 1px;
      cursor: pointer;
      font-size: 22px;
    }

    .focused {
      transition: 0.2s;
      opacity: 0.8;
    }
  }
}
</style>
