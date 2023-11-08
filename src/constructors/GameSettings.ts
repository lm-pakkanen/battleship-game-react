import { ShipType } from "../enums/ShipType";

interface ShipCounts {
  carrier: number;
  battleship: number;
  cruiser: number;
  submarine: number;
  destroyer: number;
}

interface Settings {
  player1Name: string;
  player2Name: string;
  boardSize: number;
  shipCounts: ShipCounts;
}

export const BOARD_SIZE_MIN = 5;
export const BOARD_SIZE_MAX = 10;

export const SHIP_COUNTS_MAX: Record<ShipType, number> = {
  carrier: 1,
  battleship: 2,
  cruiser: 3,
  submarine: 4,
  destroyer: 5,
};

export const SHIP_SIZES: Record<ShipType, number> = {
  carrier: 5,
  battleship: 4,
  cruiser: 3,
  submarine: 3,
  destroyer: 2,
};

export class GameSettings {
  private _player1Name: string;
  private _player2Name: string;
  private _boardSize: number;
  private _shipCounts: ShipCounts;

  constructor(
    player1Name: string,
    player2Name: string,
    boardSize: number,
    shipCounts: Partial<ShipCounts>
  ) {
    this._player1Name = player1Name;
    this._player2Name = player2Name;
    this._boardSize = boardSize;
    this._shipCounts = {
      carrier: shipCounts.carrier ?? 0,
      battleship: shipCounts.battleship ?? 0,
      cruiser: shipCounts.cruiser ?? 0,
      submarine: shipCounts.submarine ?? 0,
      destroyer: shipCounts.destroyer ?? 0,
    };
  }

  public static isBoardSizeValid(boardSize: number): boolean {
    if (typeof boardSize !== "number" || Number.isNaN(boardSize)) {
      return false;
    }

    return boardSize >= BOARD_SIZE_MIN && boardSize <= BOARD_SIZE_MAX;
  }

  public static isShipCountValid(
    shipKey: keyof ShipCounts,
    count: number
  ): boolean {
    return count >= 0 && count <= SHIP_COUNTS_MAX[shipKey];
  }

  public static isShipCountsValid(
    shipCounts: Partial<ShipCounts>,
    boardSize: number
  ): true | string {
    const {
      carrier = 0,
      battleship = 0,
      cruiser = 0,
      submarine = 0,
      destroyer = 0,
    } = shipCounts || {};

    if (!(carrier || battleship || cruiser || submarine || destroyer)) {
      return "At least one ship required.";
    }

    for (const key of [
      "carrier",
      "battleship",
      "cruiser",
      "submarine",
      "destroyer",
    ] as const) {
      if ((shipCounts[key] || 0) > SHIP_COUNTS_MAX[key]) {
        return `Too many ${key}. Maximum value is ${SHIP_COUNTS_MAX[key]}.`;
      }
    }

    const totalShipArea =
      carrier * SHIP_SIZES.carrier +
      battleship * SHIP_SIZES.battleship +
      cruiser * SHIP_SIZES.cruiser +
      submarine * SHIP_SIZES.submarine +
      destroyer * SHIP_SIZES.destroyer;

    if (boardSize * boardSize >= totalShipArea * 2) {
      return true;
    }

    return "Too many ships!";
  }

  public get settings(): Settings {
    return {
      player1Name: this._player1Name,
      player2Name: this._player2Name,
      boardSize: this._boardSize,
      shipCounts: this._shipCounts,
    };
  }
}
