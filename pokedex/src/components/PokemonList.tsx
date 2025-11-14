import { useState, useEffect, useMemo } from 'react';
import type { Pokemon } from '../types/types';
import PokemonAPI from '../api/PokemonAPI';
import PokemonCard from './PokemonCard';
import PokemonDetail from './PokemonDetail';

function PokemonList() {
    const [pokemon, setPokemon] = useState<Pokemon[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
    const [error, setError] = useState<string | null>(null);

    const limit = 20; 
    const api = useMemo(() => new PokemonAPI(), []);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                setLoading(true);
                setError(null);
                const offset = currentPage * limit;
                const data = await api.getPokemonList(limit, offset);
                setPokemon(data);
            } catch (error) {
                setError('Error fetching pokemon: ' + String(error));
            } finally {
                setLoading(false);
            }
        }
        fetchPokemon();
    }, [api, currentPage]);

    const handleCardClick = async(name: string) => {
        try {
            setLoading(true);
            const data = await api.getPokemonByName(name);
            setSelectedPokemon(data);
        } catch (error) {
            console.error('Error fetching pokemon details:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Pokédex</h1>
                    <p className="text-gray-600">Explore and catch Pokémon</p>
                </div>

                {loading && <div className="text-center py-8"><p className="text-lg text-gray-600">Loading...</p></div>}
                {error && <div className="text-center py-4"><p className="text-lg text-red-600 bg-red-50 p-4 rounded">{error}</p></div>}

                {!loading && !error && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {pokemon.map((p) => (
                            <PokemonCard
                                key={p.name}
                                pokemon={p}
                                onClick={() => handleCardClick(p.name)}
                            />
                        ))}
                    </div>
                )}

                <div className="flex gap-4 justify-center mt-8">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                        className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    <span className="px-6 py-2 bg-gray-200 rounded-lg font-semibold text-gray-700">
                        Page {currentPage + 1}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                    >
                        Next
                    </button>
                </div>

                {selectedPokemon && (
                    <PokemonDetail
                        pokemon={selectedPokemon}
                        onClose={() => setSelectedPokemon(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default PokemonList;