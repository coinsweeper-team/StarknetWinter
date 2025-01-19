import { DojoProvider, DojoCall } from "@dojoengine/core";
import { Account, AccountInterface } from "starknet";

export function setupWorld(provider: DojoProvider) {
    // Build calldata for `setup_game`
    const build_setup_game_calldata = (difficulty: number): DojoCall => {
        return {
            contractName: "actions",
            entrypoint: "setup_game",
            calldata: [difficulty],
        };
    };

    // Action for `setup_game`
    const setup_game = async (
        snAccount: Account | AccountInterface,
        difficulty: number
    ) => {
        try {
            return await provider.execute(
                snAccount,
                build_setup_game_calldata(difficulty),
                "dojo_starter"
            );
        } catch (error) {
            console.error("Error executing setup_game:", error);
            throw error;
        }
    };

    // Build calldata for `gameEnd`
    const build_game_end_calldata = (
        board_id: number,
        result: number,
        time_elapsed: number,
        currency_amount: number
    ): DojoCall => {
        return {
            contractName: "actions",
            entrypoint: "gameEnd",
            calldata: [board_id, result, time_elapsed, currency_amount],
        };
    };

    // Action for `gameEnd`
    const game_end = async (
        snAccount: Account | AccountInterface,
        board_id: number,
        result: number,
        time_elapsed: number,
        currency_amount: number
    ) => {
        try {
            return await provider.execute(
                snAccount,
                build_game_end_calldata(board_id, result, time_elapsed, currency_amount),
                "dojo_starter"
            );
        } catch (error) {
            console.error("Error executing gameEnd:", error);
            throw error;
        }
    };

    return {
        actions: {
            setupGame: setup_game,
            gameEnd: game_end,
        },
    };
}
