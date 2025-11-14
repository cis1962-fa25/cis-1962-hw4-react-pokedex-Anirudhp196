import type { ReactNode } from 'react';
import type { Pokemon } from '../types/types';

interface PokemonDetailProps {
    pokemon: Pokemon;
    onClose: () => void;
}

function PokemonDetail({ pokemon, onClose }: PokemonDetailProps): ReactNode {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
                <button
                    onClick={onClose}
                    className="float-right text-2xl font-bold text-gray-600 hover:text-black"
                >
                    ✕
                </button>

                <div className="flex gap-8">
                    <div className="flex-shrink-0">
                        <img
                            src={pokemon.sprites.front_default}
                            alt={pokemon.name}
                            className="w-40 h-40 object-contain"
                        />
                    </div>

                    <div className="flex-grow">
                        <h2 className="text-3xl font-bold mb-2">{pokemon.name}</h2>
                        <p className="text-gray-600 mb-4">{pokemon.description}</p>

                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Types</h3>
                            <div className="flex gap-2">
                                {pokemon.types.map((type) => (
                                    <span
                                        key={type.name}
                                        className="px-3 py-1 rounded text-white text-sm"
                                        style={{ backgroundColor: type.color }}
                                    >
                                        {type.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <h3 className="font-semibold mb-2">Stats</h3>
                                <ul className="text-sm space-y-1">
                                    <li>HP: {pokemon.stats.hp}</li>
                                    <li>Attack: {pokemon.stats.attack}</li>
                                    <li>Defense: {pokemon.stats.defense}</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2"></h3>
                                <ul className="text-sm space-y-1">
                                    <li>Sp. Attack: {pokemon.stats.specialAttack}</li>
                                    <li>Sp. Defense: {pokemon.stats.specialDefense}</li>
                                    <li>Speed: {pokemon.stats.speed}</li>
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Moves</h3>
                            <div className="flex flex-wrap gap-2">
                                {pokemon.moves.map((move) => (
                                    <span
                                        key={move.name}
                                        className="text-xs px-2 py-1 bg-gray-200 rounded"
                                    >
                                        {move.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PokemonDetail;
