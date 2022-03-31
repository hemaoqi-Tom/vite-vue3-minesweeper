import { Position } from '../entities/Position.entity';

import { GameContext } from './GameContext';

export abstract class GameState {
  protected gameContext!: GameContext;

  public getGameContext() {
    return this.gameContext;
  }

  public setGameContext(gameContext: GameContext) {
    this.gameContext = gameContext;
  }

  public abstract initArguments(
    rows: number,
    cols: number,
    mineCount: number
  ): void;
  public abstract initLayout(): void;
  public abstract initContent(firstClickPosition: Position): void;
  public abstract revealBlock(position: Position): void;
  public abstract revealSiblingBlocks(position: Position): void;
  public abstract toggleFlag(position: Position): void;
  public abstract succeed(): void;
  public abstract fail(): void;
  public abstract restart(): void;
}
