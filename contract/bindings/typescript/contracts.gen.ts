import { DojoProvider } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish, CairoOption, CairoCustomEnum, ByteArray } from "starknet";
import * as models from "./models.gen";

export function setupWorld(provider: DojoProvider) {

	const build_actions_addCurrency_calldata = (amount: BigNumberish) => {
		return {
			contractName: "actions",
			entrypoint: "addCurrency",
			calldata: [amount],
		};
	};

	const actions_addCurrency = async (snAccount: Account | AccountInterface, amount: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_addCurrency_calldata(amount),
				"dojo_starter",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_checkForAchievement_calldata = () => {
		return {
			contractName: "actions",
			entrypoint: "checkForAchievement",
			calldata: [],
		};
	};

	const actions_checkForAchievement = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_checkForAchievement_calldata(),
				"dojo_starter",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_gameEnd_calldata = (boardId: BigNumberish, result: models.GameResult, timeElapsed: BigNumberish, currencyAmount: BigNumberish) => {
		return {
			contractName: "actions",
			entrypoint: "gameEnd",
			calldata: [boardId, result, timeElapsed, currencyAmount],
		};
	};

	const actions_gameEnd = async (snAccount: Account | AccountInterface, boardId: BigNumberish, result: models.GameResult, timeElapsed: BigNumberish, currencyAmount: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_gameEnd_calldata(boardId, result, timeElapsed, currencyAmount),
				"dojo_starter",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_randomMineOrder_calldata = (numCells: BigNumberish, numMines: BigNumberish) => {
		return {
			contractName: "actions",
			entrypoint: "randomMineOrder",
			calldata: [numCells, numMines],
		};
	};

	const actions_randomMineOrder = async (snAccount: Account | AccountInterface, numCells: BigNumberish, numMines: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_randomMineOrder_calldata(numCells, numMines),
				"dojo_starter",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_setupBoardStatus_calldata = (difficulty: models.GameDifficulty, boardId: BigNumberish) => {
		return {
			contractName: "actions",
			entrypoint: "setup_board_status",
			calldata: [difficulty, boardId],
		};
	};

	const actions_setupBoardStatus = async (snAccount: Account | AccountInterface, difficulty: models.GameDifficulty, boardId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_setupBoardStatus_calldata(difficulty, boardId),
				"dojo_starter",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_setupCells_calldata = (boardId: BigNumberish) => {
		return {
			contractName: "actions",
			entrypoint: "setup_cells",
			calldata: [boardId],
		};
	};

	const actions_setupCells = async (snAccount: Account | AccountInterface, boardId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_setupCells_calldata(boardId),
				"dojo_starter",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_setupGame_calldata = (difficulty: BigNumberish) => {
		return {
			contractName: "actions",
			entrypoint: "setup_game",
			calldata: [difficulty],
		};
	};

	const actions_setupGame = async (snAccount: Account | AccountInterface, difficulty: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_setupGame_calldata(difficulty),
				"dojo_starter",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_spendCurrency_calldata = (amount: BigNumberish) => {
		return {
			contractName: "actions",
			entrypoint: "spendCurrency",
			calldata: [amount],
		};
	};

	const actions_spendCurrency = async (snAccount: Account | AccountInterface, amount: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_spendCurrency_calldata(amount),
				"dojo_starter",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};



	return {
		actions: {
			addCurrency: actions_addCurrency,
			buildAddCurrencyCalldata: build_actions_addCurrency_calldata,
			checkForAchievement: actions_checkForAchievement,
			buildCheckForAchievementCalldata: build_actions_checkForAchievement_calldata,
			gameEnd: actions_gameEnd,
			buildGameEndCalldata: build_actions_gameEnd_calldata,
			randomMineOrder: actions_randomMineOrder,
			buildRandomMineOrderCalldata: build_actions_randomMineOrder_calldata,
			setupBoardStatus: actions_setupBoardStatus,
			buildSetupBoardStatusCalldata: build_actions_setupBoardStatus_calldata,
			setupCells: actions_setupCells,
			buildSetupCellsCalldata: build_actions_setupCells_calldata,
			setupGame: actions_setupGame,
			buildSetupGameCalldata: build_actions_setupGame_calldata,
			spendCurrency: actions_spendCurrency,
			buildSpendCurrencyCalldata: build_actions_spendCurrency_calldata,
		},
	};
}