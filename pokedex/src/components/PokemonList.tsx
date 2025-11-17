import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Pokemon, InsertBoxEntry, BoxEntry, UpdateBoxEntry } from '../types/types';
import PokemonAPI from '../api/PokemonAPI';
import PokemonCard from './PokemonCard';
import PokemonDetail from './PokemonDetail';
import BoxForm from './BoxForm';
import BoxList from './BoxList';

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }
    return typeof error === 'string' ? error : 'Unexpected error';
};

function PokemonList() {
    const [pokemon, setPokemon] = useState<Pokemon[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<'pokemon' | 'box'>('pokemon');

    const [isBoxFormOpen, setIsBoxFormOpen] = useState(false);
    const [boxPokemonId, setBoxPokemonId] = useState<number | null>(null);
    const [editingEntry, setEditingEntry] = useState<BoxEntry | null>(null);
    const [boxFormLoading, setBoxFormLoading] = useState(false);
    const [boxFormError, setBoxFormError] = useState<string | null>(null);

    const [boxEntries, setBoxEntries] = useState<BoxEntry[]>([]);
    const [boxLoading, setBoxLoading] = useState(false);
    const [boxError, setBoxError] = useState<string | null>(null);
    const [pokemonIdMap, setPokemonIdMap] = useState<Map<number, { name: string; sprite: string }>>(new Map());

    const limit = 20; 
    const api = useMemo(() => new PokemonAPI(), []);

    useEffect(() => {
        const buildPokemonIdMap = async () => {
            try {
                const batch = 200;
                const pokemonList = await api.getPokemonList(batch, 0);
                const map = new Map<number, { name: string; sprite: string }>();
                pokemonList.forEach((p) => {
                    map.set(p.id, {
                        name: p.name,
                        sprite: p.sprites.front_default
                    });
                });
                setPokemonIdMap(map);
            } catch {
                setPokemonIdMap(new Map());
            }
        };
        buildPokemonIdMap();
    }, [api]);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                setLoading(true);
                setError(null);
                const offset = currentPage * limit;
                const data = await api.getPokemonList(limit, offset);
                setPokemon(data);
            } catch (error: unknown) {
                const message = getErrorMessage(error) || 'Unable to load Pokémon right now.';
                setError(message);
            } finally {
                setLoading(false);
            }
        }
        fetchPokemon();
    }, [api, currentPage]);

    const fetchBoxEntries = useCallback(async () => {
        setBoxLoading(true);
        setBoxError(null);
        try {
            const boxData = await api.getBoxEntries();
            if (!Array.isArray(boxData) || boxData.length === 0) {
                setBoxEntries([]);
                return;
            }

            const firstItem = boxData[0];
            if (typeof firstItem === 'object') {
                setBoxEntries(boxData as BoxEntry[]);
                return;
            }

            const ids = boxData as string[];
            const entries = await Promise.all(
                ids.map((id) => api.getBoxEntryById(id))
            );
            setBoxEntries(entries);
        } catch (error: unknown) {
            const msg = getErrorMessage(error);
            if (msg.includes('401') || msg.toLowerCase().includes('unauthorized')) {
                setBoxError('Authentication error: Please log in again.');
            } else {
                setBoxError('Failed to load Box entries. Please try again.');
            }
        } finally {
            setBoxLoading(false);
        }
    }, [api]);

    useEffect(() => {
        if (view === 'box') {
            fetchBoxEntries();
        }
    }, [view, fetchBoxEntries]);

    const handleCardClick = async (name: string) => {
        try {
            const data = await api.getPokemonByName(name);
            setSelectedPokemon(data);
        } catch (error: unknown) {
            const message = getErrorMessage(error) || 'Unable to load Pokémon details.';
            setError(message);
        }
    };

    const handleBoxFormSubmit = async (
        entry: InsertBoxEntry | UpdateBoxEntry,
        isEdit?: boolean,
        entryId?: string
    ) => {
        setBoxFormLoading(true);
        setBoxFormError(null);
        try {
            if (isEdit && entryId) {
                await api.updateBoxEntry(entryId, entry as UpdateBoxEntry);
            } else {
                await api.createBoxEntry(entry as InsertBoxEntry);
            }
            setIsBoxFormOpen(false);
            setBoxPokemonId(null);
            setEditingEntry(null);
            setBoxFormError(null);
            await fetchBoxEntries();
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            if (message.includes('401')) {
                setBoxFormError('Authentication error: Please check your token.');
            } else if (message.includes('400')) {
                setBoxFormError('Validation failed. Please review your inputs.');
            } else {
                setBoxFormError('Failed to save Pokémon. Please try again.');
            }
        } finally {
            setBoxFormLoading(false);
        }
    };

    return (
        <>
        <div className="min-h-screen bg-gray-50 py-8 w-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center mb-10 mt-4 gap-2">
                    <button
                        className={`px-6 py-2 rounded-t-lg font-bold text-lg transition-all duration-200 border-b-4 ${view === 'pokemon' ? 'bg-white border-blue-500 text-blue-700' : 'bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200'}`}
                        onClick={() => setView('pokemon')}
                        disabled={loading}
                    >
                        All Pokémon
                    </button>
                    <button
                        className={`px-6 py-2 rounded-t-lg font-bold text-lg transition-all duration-200 border-b-4 ${view === 'box' ? 'bg-white border-green-500 text-green-700' : 'bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200'}`}
                        onClick={() => setView('box')}
                        disabled={boxLoading}
                    >
                        My Box
                    </button>
                </div>
                <div className="text-center mb-8 w-full">
                    <h1 className="text-5xl font-bold text-gray-900 mb-2 w-full" style={{ fontFamily: 'Georgia, "Times New Roman", serif', letterSpacing: '2px', textAlign: 'center' }}>Pokédex</h1>
                    <p className="text-lg text-gray-600 w-full" style={{ fontFamily: 'Trebuchet MS, Arial, sans-serif', fontSize: '18px', textAlign: 'center' }}>Explore and catch Pokémon</p>
                </div>

                {loading && view === 'pokemon' && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-4">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
                        <p className="font-sans text-2xl text-gray-500">Loading Pokémon...</p>
                    </div>
                )}

                {error && <div className="text-center py-4"><p className="text-lg text-red-600 bg-red-50 p-4 rounded">{error}</p></div>}

                {!loading && !error && view === 'pokemon' && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
                        {pokemon.map((p) => (
                            <PokemonCard
                                key={p.name}
                                pokemon={p}
                                onClick={() => handleCardClick(p.name)}
                            />
                        ))}
                    </div>
                )}

                {view === 'pokemon' && (
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '32px' }}>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                        disabled={currentPage === 0 || loading}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: currentPage === 0 || loading ? '#9ca3af' : '#4b5563',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '16px',
                            cursor: currentPage === 0 || loading ? 'not-allowed' : 'pointer',
                            opacity: currentPage === 0 || loading ? 0.5 : 1,
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            if (currentPage !== 0) {
                                e.currentTarget.style.backgroundColor = '#5a6575';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (currentPage !== 0) {
                                e.currentTarget.style.backgroundColor = '#4b5563';
                            }
                        }}
                    >
                        ← Previous
                    </button>
                    <span style={{
                        padding: '12px 24px',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '16px',
                        color: '#374151',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        Page {currentPage + 1}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        disabled={loading}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '16px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#2563eb';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#3b82f6';
                        }}
                    >
                        Next →
                    </button>
                    </div>
                )}

                {selectedPokemon && (
                    <PokemonDetail
                        pokemon={selectedPokemon}
                        onClose={() => setSelectedPokemon(null)}
                        onCatch={(pokemonId) => {
                            setSelectedPokemon(null);
                            setBoxFormError(null);
                            setIsBoxFormOpen(true);
                            setBoxPokemonId(pokemonId);
                            setEditingEntry(null);
                        }}
                    />
                )}

                {isBoxFormOpen && boxPokemonId !== null && (
                    <BoxForm
                        pokemonId={boxPokemonId}
                        entry={editingEntry ?? undefined}
                        mode={editingEntry ? 'edit' : 'create'}
                        onSubmit={handleBoxFormSubmit}
                        onCancel={() => {
                            setIsBoxFormOpen(false);
                            setBoxPokemonId(null);
                            setEditingEntry(null);
                            setBoxFormError(null);
                        }}
                        error={boxFormError}
                        loading={boxFormLoading}
                    />
                )}
                {view === 'box' && (
                    <BoxList
                        entries={boxEntries}
                        loading={boxLoading}
                        error={boxError}
                        pokemonIdMap={pokemonIdMap}
                        onEdit={(entry) => {
                            setBoxPokemonId(entry.pokemonId);
                            setSelectedPokemon(null);
                            setEditingEntry(entry);
                            setIsBoxFormOpen(true);
                        }}
                        onDelete={async (entryId) => {
                            if (!window.confirm('Delete this Pokémon from your Box?')) return;
                            try {
                                await api.deleteBoxEntry(entryId);
                                await fetchBoxEntries();
                            } catch {
                                alert('Failed to delete entry. Please try again.');
                            }
                        }}
                    />
                )}
            </div>
        </div>
        </>
    );
};

export default PokemonList;