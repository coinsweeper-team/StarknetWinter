import { useEffect, useMemo, useState } from "react";
import { ParsedEntity, QueryBuilder } from "@dojoengine/sdk";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { AccountInterface, addAddressPadding, CairoCustomEnum } from "starknet";

import { ModelsMapping, SchemaType } from "./typescript/models.gen.ts";
import { useSystemCalls } from "./useSystemCalls.ts";
import { useAccount } from "@starknet-react/core";
import { WalletAccount } from "./wallet-account.tsx";
import { HistoricalEvents } from "./historical-events.tsx";
import { useDojoSDK, useModel } from "@dojoengine/sdk/react";

function App() {
    const { useDojoStore, client, sdk } = useDojoSDK();
    const { account } = useAccount();
    const state = useDojoStore((state) => state);
    const entities = useDojoStore((state) => state.entities);
    const [timer, setTimer] = useState(0);
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

    const entityId = useMemo(() => {
        if (account) {
            return getEntityIdFromKeys([BigInt(account.address)]);
        }
        return BigInt(0);
    }, [account]);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const subscribe = async (account: AccountInterface) => {
            const subscription = await sdk.subscribeEntityQuery({
                query: new QueryBuilder<SchemaType>()
                    .namespace("dojo_starter", (n) =>
                        n
                            .entity("Cell", (e) =>
                                e.eq(
                                    "player",
                                    addAddressPadding(account.address)
                                )
                            )
                            .entity("BoardStatus", (e) =>
                                e.eq(
                                    "player",
                                    addAddressPadding(account.address)
                                )
                            )
                            .entity("Currency", (e) =>
                                e.eq(
                                    "player",
                                    addAddressPadding(account.address)
                                )
                            )
                    )
                    .build(),
                callback: ({ error, data }) => {
                    if (error) {
                        console.error("Error setting up entity sync:", error);
                    } else if (
                        data &&
                        (data[0] as ParsedEntity<SchemaType>).entityId !== "0x0"
                    ) {
                        state.updateEntity(data[0] as ParsedEntity<SchemaType>);
                    }
                },
            });

            unsubscribe = () => subscription.cancel();
        };

        if (account) {
            subscribe(account);
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [sdk, account]);

    useEffect(() => {
        const fetchEntities = async (account: AccountInterface) => {
            try {
                await sdk.getEntities({
                    query: new QueryBuilder<SchemaType>()
                        .namespace("dojo_starter", (n) =>
                            n
                                .entity("Cell", (e) =>
                                    e.eq(
                                        "player",
                                        addAddressPadding(account.address)
                                    )
                                )
                                .entity("BoardStatus", (e) =>
                                    e.eq(
                                        "player",
                                        addAddressPadding(account.address)
                                    )
                                )
                                .entity("Currency", (e) =>
                                    e.eq(
                                        "player",
                                        addAddressPadding(account.address)
                                    )
                                )
                        )
                        .build(),
                    callback: (resp) => {
                        if (resp.error) {
                            console.error(
                                "resp.error.message:",
                                resp.error.message
                            );
                            return;
                        }
                        if (resp.data) {
                            state.setEntities(
                                resp.data as ParsedEntity<SchemaType>[]
                            );
                        }
                    },
                });
            } catch (error) {
                console.error("Error querying entities:", error);
            }
        };

        if (account) {
            fetchEntities(account);
        }
    }, [sdk, account]);

    const boardStatus = useModel(entityId as string, ModelsMapping.BoardStatus);
    const currency = useModel(entityId as string, ModelsMapping.Currency);

    const handleStartGame = async (difficulty: string) => {
        if (!account) return;

        try {
            difficultyEnum: new CairoCustomEnum({
                difficulty: "()",
            });
            // const difficultyEnum = {
            //     'beginner': { Beginner: {} },
            //     'intermediate': { Intermediate: {} },
            //     'expert': { Expert: {} }
            // }[difficulty];

            await client.actions.setup_game(account, difficultyEnum);
            startTimer();
        } catch (error) {
            console.error('Error starting game:', error);
        }
    };

    const startTimer = () => {
        if (timerInterval) clearInterval(timerInterval);
        setTimer(0);
        const interval = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);
        setTimerInterval(interval);
    };

    useEffect(() => {
        return () => {
            if (timerInterval) {
                clearInterval(timerInterval);
            }
        };
    }, [timerInterval]);

    return (
        <div className="bg-black min-h-screen w-full p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <WalletAccount />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
                        <div className="grid grid-cols-3 gap-2 w-full h-48">
                            <div className="col-span-3 text-center text-base text-white">
                                Currency: {currency?.amount || 0}
                            </div>
                            <div className="col-span-3 text-center text-base text-white">
                                Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                            </div>
                            <div className="col-span-3 flex justify-center gap-2">
                                <button 
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                                    onClick={() => handleStartGame('beginner')}
                                >
                                    Beginner
                                </button>
                                <button 
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                                    onClick={() => handleStartGame('intermediate')}
                                >
                                    Inter
                                </button>
                                <button 
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                    onClick={() => handleStartGame('expert')}
                                >
                                    Expert
                                </button>
                            </div>
                        </div>
                    </div>

                    {boardStatus && (
                        <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(${boardStatus.width || 8}, minmax(0, 1fr))`,
                                gap: '1px',
                                backgroundColor: '#ccc',
                                padding: '1px'
                            }}>
                                {Object.values(entities)
                                    .filter(entity => 
                                        entity.models?.dojo_starter?.Cell &&
                                        entity.models.dojo_starter.Cell.board === boardStatus.board_id
                                    )
                                    .map(entity => {
                                        const cell = entity.models.dojo_starter.Cell;
                                        return (
                                            <div
                                                key={cell.cell_id}
                                                className="aspect-square bg-gray-200 hover:bg-gray-300 cursor-pointer flex items-center justify-center font-bold"
                                                onClick={() => {
                                                    console.log('Cell clicked:', cell);
                                                }}
                                            >
                                                {cell.amount_currency > 0 ? cell.amount_currency : ''}
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-700">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="border border-gray-700 p-2">Entity ID</th>
                                <th className="border border-gray-700 p-2">Board ID</th>
                                <th className="border border-gray-700 p-2">Difficulty</th>
                                <th className="border border-gray-700 p-2">Mines</th>
                                <th className="border border-gray-700 p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(entities)
                                .filter(([_, entity]) => entity.models?.dojo_starter?.BoardStatus)
                                .map(([entityId, entity]) => {
                                    const board = entity.models.dojo_starter.BoardStatus;
                                    return (
                                        <tr key={entityId} className="text-gray-300">
                                            <td className="border border-gray-700 p-2">{entityId}</td>
                                            <td className="border border-gray-700 p-2">{board.board_id}</td>
                                            <td className="border border-gray-700 p-2">{board.difficulty}</td>
                                            <td className="border border-gray-700 p-2">{board.num_mines}</td>
                                            <td className="border border-gray-700 p-2">
                                                {board.is_over ? 'Completed' : 'In Progress'}
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>

                <HistoricalEvents />
            </div>
        </div>
    );
}

export default App;