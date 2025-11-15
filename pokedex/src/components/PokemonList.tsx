import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Pokemon, BoxEntry } from '../types/types';
import type { InsertBoxEntry } from '../types/types';
import PokemonAPI from '../api/PokemonAPI';
import PokemonCard from './PokemonCard';
import PokemonDetail from './PokemonDetail';
import BoxForm from './BoxForm';

// Type for Pokemon ID lookup map (internal helper)
type PokemonInfo = {
    name: string;
    sprite: string;
};

function PokemonList() {
    const [pokemon, setPokemon] = useState<Pokemon[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<'pokemon' | 'box'>('pokemon');

    // State for Box Form modal
    const [isBoxFormOpen, setIsBoxFormOpen] = useState(false);
    const [boxPokemonId, setBoxPokemonId] = useState<number | null>(null);
    const [boxFormLoading, setBoxFormLoading] = useState(false);
    const [boxFormError, setBoxFormError] = useState<string | null>(null);

    // State for Box entries
    const [boxEntries, setBoxEntries] = useState<BoxEntry[]>([]);
    const [boxLoading, setBoxLoading] = useState(false);
    const [boxError, setBoxError] = useState<string | null>(null);

    // Pokemon ID -> name/sprite map for Box entries
    const [pokemonIdMap, setPokemonIdMap] = useState<Map<number, PokemonInfo>>(new Map());

    const limit = 20; 
    const api = useMemo(() => new PokemonAPI(), []);

    // Build Pokemon ID map on mount - fetch a reasonable batch
    useEffect(() => {
        const buildPokemonIdMap = async () => {
            try {
                // Fetch a reasonable batch size (API might have limits)
                const batchLimit = 200;
                const pokemonList = await api.getPokemonList(batchLimit, 0);
                const map = new Map<number, PokemonInfo>();
                
                pokemonList.forEach((p: Pokemon) => {
                    map.set(p.id, {
                        name: p.name,
                        sprite: p.sprites.front_default
                    });
                });
                
                setPokemonIdMap(map);
                console.log(`Loaded ${map.size} Pokemon into ID map`);
            } catch (error: any) {
                // Handle network errors gracefully
                if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
                    console.warn('Network error building Pokemon ID map. The app will still work, but Box entries may show IDs instead of names.');
                } else {
                    console.error('Error building Pokemon ID map:', error);
                }
                // Non-critical error - continue without map, will fetch individually if needed
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
                console.log('fetching pokemon');
                const offset = currentPage * limit;
                const data = await api.getPokemonList(limit, offset);
                setPokemon(data);
                console.log(data);
            } catch (error) {
                setError('Error fetching pokemon: ' + String(error));
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchPokemon();
    }, [api, currentPage]);

    const handleCardClick = async(name: string) => {
        try {
            const data = await api.getPokemonByName(name);
            setSelectedPokemon(data);
        } catch (error) {
            console.error('Error fetching pokemon details:', error);
        }
    };

    // Fetch Box entries
    const fetchBoxEntries = useCallback(async () => {
        setBoxLoading(true);
        setBoxError(null);
        try {
            // Step 1: Get array of Box entry IDs
            const boxEntryIds = await api.getBoxEntries();
            
            // Step 2: Fetch each complete entry
            const entriesPromises = boxEntryIds.map((id: string) => 
                api.getBoxEntryById(id)
            );
            const entries = await Promise.all(entriesPromises);
            
            // Step 3: Store entries (Pokemon data will be looked up from map when rendering)
            setBoxEntries(entries);
        } catch (e: any) {
            const msg = e?.message || '';
            if (msg.includes('401') || msg.toLowerCase().includes('unauthorized')) {
                setBoxError('Authentication error: Please log in again.');
            } else {
                setBoxError('Failed to load Box entries. Please try again.');
            }
        } finally {
            setBoxLoading(false);
        }
    }, [api]);

    // Fetch Box entries when Box view is shown
    useEffect(() => {
        if (view === 'box' && pokemonIdMap.size > 0) {
            fetchBoxEntries();
        }
    }, [view, pokemonIdMap.size, fetchBoxEntries]);

    // BoxForm submit handler
    const handleBoxFormSubmit = async (entry: InsertBoxEntry) => {
        setBoxFormLoading(true);
        setBoxFormError(null);
        try {
            await api.createBoxEntry(entry);
            setIsBoxFormOpen(false);
            setBoxPokemonId(null);
            // Refresh Box list after creating entry
            if (view === 'box') {
                await fetchBoxEntries();
            }
        } catch (e: any) {
            const msg = e?.message || '';
            if (msg.includes('401') || msg.toLowerCase().includes('unauthorized')) {
                setBoxFormError('Authentication error: Please log in again.');
            } else if (msg.includes('400') || msg.toLowerCase().includes('validation')) {
                setBoxFormError('Validation failed: Please check your input fields.');
            } else {
                setBoxFormError('Failed to catch Pokémon. Please try again.');
            }
        } finally {
            setBoxFormLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 w-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Tab Toggle */}
                <div className="flex justify-center mb-10 mt-4 gap-2">
                    <button
                        className={`px-6 py-2 rounded-t-lg font-bold text-lg transition-all duration-200 border-b-4 ${view === 'pokemon' ? 'bg-white border-blue-500 text-blue-700' : 'bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200'}`}
                        onClick={() => setView('pokemon')}
                    >
                        All Pokémon
                    </button>
                    <button
                        className={`px-6 py-2 rounded-t-lg font-bold text-lg transition-all duration-200 border-b-4 ${view === 'box' ? 'bg-white border-green-500 text-green-700' : 'bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200'}`}
                        onClick={() => setView('box')}
                    >
                        My Box
                    </button>
                </div>
                <div className="text-center mb-8 w-full">
                    <h1 className="text-5xl font-bold text-gray-900 mb-2 w-full" style={{ fontFamily: 'Georgia, "Times New Roman", serif', letterSpacing: '2px', textAlign: 'center' }}>Pokédex</h1>
                    <p className="text-lg text-gray-600 w-full" style={{ fontFamily: 'Trebuchet MS, Arial, sans-serif', fontSize: '18px', textAlign: 'center' }}>Explore and catch Pokémon</p>
                </div>

                {loading && view === 'pokemon' && (
                    <div className="flex items-center justify-center min-h-[60vh] w-full">
                        <p className="font-sans text-2xl text-gray-500">Loading...</p>
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

                {/* Box list view */}
                {view === 'box' && (
                    <>
                        {boxLoading && (
                            <div className="w-full h-[60vh] flex justify-center items-center">
                                <p className="font-sans text-xl text-gray-500">Loading your Box...</p>
                            </div>
                        )}
                        {boxError && (
                            <div className="text-center py-4">
                                <p className="text-lg text-red-600 bg-red-50 p-4 rounded">{boxError}</p>
                            </div>
                        )}
                        {!boxLoading && !boxError && boxEntries.length === 0 && (
                            <div className="w-full h-[60vh] flex justify-center items-center">
                                <p className="font-sans text-xl text-gray-500 text-center max-w-lg">Your Box is empty. Start catching Pokémon!</p>
                            </div>
                        )}
                        {!boxLoading && !boxError && boxEntries.length > 0 && (
                            <div className="w-full">
                                <p className="text-center mb-4 text-gray-600">You have {boxEntries.length} Pokémon in your Box</p>
                                {/* Box entries will be rendered here - temporary display until BoxCard is created */}
                                <div className="flex flex-wrap gap-4 justify-center">
                                    {boxEntries.map((entry) => {
                                        const pokemonInfo = pokemonIdMap.get(entry.pokemonId);
                                        return (
                                            <div key={entry.id} className="p-4 border rounded-lg bg-white shadow-sm">
                                                <p className="font-semibold">Pokemon: {pokemonInfo?.name || `ID ${entry.pokemonId}`}</p>
                                                <p>Location: {entry.location}</p>
                                                <p>Level: {entry.level}</p>
                                                {entry.notes && <p>Notes: {entry.notes}</p>}
                                                <p className="text-xs text-gray-500 mt-2">Caught: {new Date(entry.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Pagination - only show in Pokemon view */}
                {view === 'pokemon' && (
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '32px' }}>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: currentPage === 0 ? '#9ca3af' : '#4b5563',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '16px',
                            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                            opacity: currentPage === 0 ? 0.5 : 1,
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
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '16px',
                            cursor: 'pointer',
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
                        onCatch={(id) => {
                            setIsBoxFormOpen(true);
                            setBoxPokemonId(id);
                        }}
                    />
                )}
                {isBoxFormOpen && boxPokemonId !== null && (
                    <BoxForm
                        pokemonId={boxPokemonId}
                        onSubmit={handleBoxFormSubmit}
                        onCancel={() => { setIsBoxFormOpen(false); setBoxPokemonId(null); }}
                        error={boxFormError}
                        loading={boxFormLoading}
                    />
                )}
            </div>
        </div>
    );
};

export default PokemonList;