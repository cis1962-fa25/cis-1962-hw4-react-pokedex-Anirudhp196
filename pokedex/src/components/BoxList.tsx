import type { BoxEntry, Pokemon } from '../types/types';

function BoxCardPlaceholder() {
    return (
        <div className="rounded-xl shadow-lg p-6 bg-white border border-gray-200 w-full max-w-xs flex flex-col gap-3 animate-pulse">
            <div className="w-24 h-24 bg-gray-200 rounded-full self-center" />
            <div className="h-4 bg-gray-200 rounded w-3/4 self-center" />
            <div className="h-3 bg-gray-200 rounded" />
            <div className="h-3 bg-gray-200 rounded" />
            <div className="h-3 bg-gray-200 rounded" />
        </div>
    );
}

import BoxCard from './BoxCard';

// Minimal Pokemon object builder for BoxCard
const createStubPokemon = (pokemonId: number, pokemonInfo?: { name: string; sprite: string }): Pokemon => ({
    id: pokemonId,
    name: pokemonInfo?.name || `Pokemon #${pokemonId}`,
    description: '',
    types: [],
    moves: [],
    sprites: {
        front_default: pokemonInfo?.sprite || '',
        back_default: pokemonInfo?.sprite || '',
        front_shiny: pokemonInfo?.sprite || '',
        back_shiny: pokemonInfo?.sprite || '',
    },
    stats: {
        hp: 0,
        speed: 0,
        attack: 0,
        defense: 0,
        specialAttack: 0,
        specialDefense: 0,
    },
});

interface BoxListProps {
    entries: BoxEntry[];
    loading: boolean;
    error: string | null;
    pokemonIdMap: Map<number, { name: string; sprite: string }>;
    onEdit: (entry: BoxEntry) => void;
    onDelete: (entryId: string) => void;
}

function BoxList({ entries, loading, error, pokemonIdMap, onEdit, onDelete }: BoxListProps) {
    if (loading) {
        return (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full animate-spin" />
                <div className="flex flex-wrap justify-center gap-4">
                    {Array.from({ length: 3 }).map((_, idx) => (
                        <BoxCardPlaceholder key={idx} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-4">
                <p className="text-lg text-red-600 bg-red-50 p-4 rounded">{error}</p>
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <div className="w-full h-[60vh] flex flex-col justify-center items-center text-center gap-2">
                <p className="text-2xl text-gray-500 font-semibold">Your Box is empty</p>
                <p className="text-gray-500 max-w-sm">Catch some Pokémon to see them here!</p>
            </div>
        );
    }

    return (
        <div className="w-full px-4">
            <p className="text-center mb-6 text-gray-600 text-lg font-semibold">
                You have {entries.length} Pokémon in your Box
            </p>
            <div className="flex flex-wrap gap-6 justify-center items-start">
                {entries.map((entry) => {
                    const pokemonInfo = pokemonIdMap.get(entry.pokemonId);
                    const pokemon = createStubPokemon(entry.pokemonId, pokemonInfo);
                    return (
                        <BoxCard
                            key={entry.id}
                            entry={entry}
                            pokemon={pokemon}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default BoxList;

