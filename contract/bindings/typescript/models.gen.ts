import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import { BigNumberish } from 'starknet';

type WithFieldOrder<T> = T & { fieldOrder: string[] };

// Type definition for `dojo_starter::models::Achievements` struct
export interface Achievements {
	player: string;
	won_10_games: boolean;
	won_100_games: boolean;
	won_first_game: boolean;
	first_in_leaderboard: boolean;
}

// Type definition for `dojo_starter::models::AchievementsValue` struct
export interface AchievementsValue {
	won_10_games: boolean;
	won_100_games: boolean;
	won_first_game: boolean;
	first_in_leaderboard: boolean;
}

// Type definition for `dojo_starter::models::BestRecords` struct
export interface BestRecords {
	player: string;
	beginner_best_time: BigNumberish;
	intermediate_best_time: BigNumberish;
	expert_best_time: BigNumberish;
}

// Type definition for `dojo_starter::models::BestRecordsValue` struct
export interface BestRecordsValue {
	beginner_best_time: BigNumberish;
	intermediate_best_time: BigNumberish;
	expert_best_time: BigNumberish;
}

// Type definition for `dojo_starter::models::BoardStatus` struct
export interface BoardStatus {
	player: string;
	board_id: BigNumberish;
	difficulty: BigNumberish;
	width: BigNumberish;
	height: BigNumberish;
	num_mines: BigNumberish;
	num_closed: BigNumberish;
	is_over: boolean;
	time_elapsed: BigNumberish;
	result: BigNumberish;
}

// Type definition for `dojo_starter::models::BoardStatusValue` struct
export interface BoardStatusValue {
	difficulty: BigNumberish;
	width: BigNumberish;
	height: BigNumberish;
	num_mines: BigNumberish;
	num_closed: BigNumberish;
	is_over: boolean;
	time_elapsed: BigNumberish;
	result: BigNumberish;
}

// Type definition for `dojo_starter::models::Boards` struct
export interface Boards {
	player: string;
	last_board_id: BigNumberish;
	played_total: BigNumberish;
	won_total: BigNumberish;
}

// Type definition for `dojo_starter::models::BoardsValue` struct
export interface BoardsValue {
	last_board_id: BigNumberish;
	played_total: BigNumberish;
	won_total: BigNumberish;
}

// Type definition for `dojo_starter::models::Cell` struct
export interface Cell {
	player: string;
	board: BigNumberish;
	cell_id: BigNumberish;
	is_bomb: boolean;
	amount_currency: BigNumberish;
}

// Type definition for `dojo_starter::models::CellValue` struct
export interface CellValue {
	is_bomb: boolean;
	amount_currency: BigNumberish;
}

// Type definition for `dojo_starter::models::Currency` struct
export interface Currency {
	player: string;
	amount: BigNumberish;
}

// Type definition for `dojo_starter::models::CurrencyValue` struct
export interface CurrencyValue {
	amount: BigNumberish;
}

// Type definition for `dojo_starter::systems::actions::actions::Moved` struct
export interface Moved {
	player: string;
	direction: Direction;
}

// Type definition for `dojo_starter::systems::actions::actions::MovedValue` struct
export interface MovedValue {
	direction: Direction;
}

// Type definition for `dojo_starter::models::Direction` enum
export enum Direction {
	Left,
	Right,
	Up,
	Down,
}

export interface SchemaType extends ISchemaType {
	dojo_starter: {
		Achievements: WithFieldOrder<Achievements>,
		AchievementsValue: WithFieldOrder<AchievementsValue>,
		BestRecords: WithFieldOrder<BestRecords>,
		BestRecordsValue: WithFieldOrder<BestRecordsValue>,
		BoardStatus: WithFieldOrder<BoardStatus>,
		BoardStatusValue: WithFieldOrder<BoardStatusValue>,
		Boards: WithFieldOrder<Boards>,
		BoardsValue: WithFieldOrder<BoardsValue>,
		Cell: WithFieldOrder<Cell>,
		CellValue: WithFieldOrder<CellValue>,
		Currency: WithFieldOrder<Currency>,
		CurrencyValue: WithFieldOrder<CurrencyValue>,
		Moved: WithFieldOrder<Moved>,
		MovedValue: WithFieldOrder<MovedValue>,
	},
}
export const schema: SchemaType = {
	dojo_starter: {
		Achievements: {
			fieldOrder: ['player', 'won_10_games', 'won_100_games', 'won_first_game', 'first_in_leaderboard'],
			player: "",
			won_10_games: false,
			won_100_games: false,
			won_first_game: false,
			first_in_leaderboard: false,
		},
		AchievementsValue: {
			fieldOrder: ['won_10_games', 'won_100_games', 'won_first_game', 'first_in_leaderboard'],
			won_10_games: false,
			won_100_games: false,
			won_first_game: false,
			first_in_leaderboard: false,
		},
		BestRecords: {
			fieldOrder: ['player', 'beginner_best_time', 'intermediate_best_time', 'expert_best_time'],
			player: "",
			beginner_best_time: 0,
			intermediate_best_time: 0,
			expert_best_time: 0,
		},
		BestRecordsValue: {
			fieldOrder: ['beginner_best_time', 'intermediate_best_time', 'expert_best_time'],
			beginner_best_time: 0,
			intermediate_best_time: 0,
			expert_best_time: 0,
		},
		BoardStatus: {
			fieldOrder: ['player', 'board_id', 'difficulty', 'width', 'height', 'num_mines', 'num_closed', 'is_over', 'time_elapsed', 'result'],
			player: "",
			board_id: 0,
			difficulty: 0,
			width: 0,
			height: 0,
			num_mines: 0,
			num_closed: 0,
			is_over: false,
			time_elapsed: 0,
			result: 0,
		},
		BoardStatusValue: {
			fieldOrder: ['difficulty', 'width', 'height', 'num_mines', 'num_closed', 'is_over', 'time_elapsed', 'result'],
			difficulty: 0,
			width: 0,
			height: 0,
			num_mines: 0,
			num_closed: 0,
			is_over: false,
			time_elapsed: 0,
			result: 0,
		},
		Boards: {
			fieldOrder: ['player', 'last_board_id', 'played_total', 'won_total'],
			player: "",
			last_board_id: 0,
			played_total: 0,
			won_total: 0,
		},
		BoardsValue: {
			fieldOrder: ['last_board_id', 'played_total', 'won_total'],
			last_board_id: 0,
			played_total: 0,
			won_total: 0,
		},
		Cell: {
			fieldOrder: ['player', 'board', 'cell_id', 'is_bomb', 'amount_currency'],
			player: "",
			board: 0,
			cell_id: 0,
			is_bomb: false,
			amount_currency: 0,
		},
		CellValue: {
			fieldOrder: ['is_bomb', 'amount_currency'],
			is_bomb: false,
			amount_currency: 0,
		},
		Currency: {
			fieldOrder: ['player', 'amount'],
			player: "",
			amount: 0,
		},
		CurrencyValue: {
			fieldOrder: ['amount'],
			amount: 0,
		},
		Moved: {
			fieldOrder: ['player', 'direction'],
			player: "",
		direction: Direction.Left,
		},
		MovedValue: {
			fieldOrder: ['direction'],
		direction: Direction.Left,
		},
	},
};
export enum ModelsMapping {
	Achievements = 'dojo_starter-Achievements',
	AchievementsValue = 'dojo_starter-AchievementsValue',
	BestRecords = 'dojo_starter-BestRecords',
	BestRecordsValue = 'dojo_starter-BestRecordsValue',
	BoardStatus = 'dojo_starter-BoardStatus',
	BoardStatusValue = 'dojo_starter-BoardStatusValue',
	Boards = 'dojo_starter-Boards',
	BoardsValue = 'dojo_starter-BoardsValue',
	Cell = 'dojo_starter-Cell',
	CellValue = 'dojo_starter-CellValue',
	Currency = 'dojo_starter-Currency',
	CurrencyValue = 'dojo_starter-CurrencyValue',
	Direction = 'dojo_starter-Direction',
	Moved = 'dojo_starter-Moved',
	MovedValue = 'dojo_starter-MovedValue',
}