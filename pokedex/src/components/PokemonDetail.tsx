import type { Pokemon } from '../types/types';
import { useEffect, useRef } from 'react';
import '../styles/modal.css';

interface PokemonDetailProps {
    pokemon: Pokemon;
    onClose: () => void;
    onCatch: (pokemonID: number) => void;
}

function PokemonDetail({ pokemon, onClose, onCatch }: PokemonDetailProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const modal = modalRef.current;
        const closeBtn = closeRef.current;

        if (!modal || !closeBtn) return;

        modal.classList.add('show');

        const handleCloseClick = () => {
            modal.classList.remove('show');
            setTimeout(onClose, 300);
        };

        closeBtn.onclick = handleCloseClick;

        const handleWindowClick = (event: MouseEvent) => {
            if (event.target === modal) {
                modal.classList.remove('show');
                setTimeout(onClose, 300); 
            }
        };

        window.onclick = handleWindowClick;

        return () => {
            closeBtn.onclick = null;
            window.onclick = null;
        };
    }, [onClose]);

    const onCatchClick = () => {
        onCatch(pokemon.id);
    }

    return (
        <div id="pokemonModal" className="modal" ref={modalRef} onClick={(e) => {
            if (e.target === modalRef.current) {
                modalRef.current?.classList.remove('show');
                setTimeout(onClose, 300);
            }
        }}>
            <div className="modal-content">
                <div className="text-center">
                    <span className="close" ref={closeRef}>&times;</span>
                    <h2 className="text-4xl font-bold capitalize text-gray-900">{pokemon.name}</h2>
                    <p className="text-gray-600 text-base mt-2">{pokemon.description}</p>
                </div>

                <div className="flex justify-center gap-4 pt-6">
                    <div className="text-center">
                        <img src={pokemon.sprites.front_default} alt={`${pokemon.name} front`} className="w-24 h-24 object-contain" />
                        <p className="text-xs text-gray-600 mt-1">Front</p>
                    </div>
                    <div className="text-center">
                        <img src={pokemon.sprites.back_default} alt={`${pokemon.name} back`} className="w-24 h-24 object-contain" />
                        <p className="text-xs text-gray-600 mt-1">Back</p>
                    </div>
                    <div className="text-center">
                        <img src={pokemon.sprites.front_shiny} alt={`${pokemon.name} front shiny`} className="w-24 h-24 object-contain" />
                        <p className="text-xs text-gray-600 mt-1">Shiny</p>
                    </div>
                    <div className="text-center">
                        <img src={pokemon.sprites.back_shiny} alt={`${pokemon.name} back shiny`} className="w-24 h-24 object-contain" />
                        <p className="text-xs text-gray-600 mt-1">Back Shiny</p>
                    </div>
                </div>

                <div className="mb-8 pt-6">
                    <h3 className="font-bold text-lg mb-3 text-gray-900">Types</h3>
                    <div className="flex gap-3 flex-wrap">
                        {pokemon.types.map((type) => (
                            <span
                                key={type.name}
                                className="px-4 py-2 rounded-full text-white text-sm font-semibold uppercase tracking-wider"
                                style={{ backgroundColor: type.color }}
                            >
                                {type.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="mb-8 grid grid-cols-2 gap-6 pt-6">
                    <div>
                        <h3 className="font-bold text-lg mb-3 text-gray-900">Base Stats</h3>
                        <ul className="text-sm space-y-2">
                            <li className="flex justify-between"><span>HP:</span> <span className="font-semibold">{pokemon.stats.hp}</span></li>
                            <li className="flex justify-between"><span>Attack:</span> <span className="font-semibold">{pokemon.stats.attack}</span></li>
                            <li className="flex justify-between"><span>Defense:</span> <span className="font-semibold">{pokemon.stats.defense}</span></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-3 text-gray-900">Advanced</h3>
                        <ul className="text-sm space-y-2">
                            <li className="flex justify-between"><span>Sp. Atk:</span> <span className="font-semibold">{pokemon.stats.specialAttack}</span></li>
                            <li className="flex justify-between"><span>Sp. Def:</span> <span className="font-semibold">{pokemon.stats.specialDefense}</span></li>
                            <li className="flex justify-between"><span>Speed:</span> <span className="font-semibold">{pokemon.stats.speed}</span></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-6 pb-6">
                    <h3 className="font-bold text-lg mb-3 text-gray-900">Moves</h3>
                    <div className="flex flex-wrap gap-3">
                        {pokemon.moves.map((move) => (
                            <span
                                key={move.name}
                                className="text-sm px-4 py-2 rounded-full text-white font-semibold tracking-wider"
                                style={{ backgroundColor: move.type.color }}
                            >
                                {move.name} {move.power ? `(${move.power})` : ''}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center items-center pt-6 pb-6">
                    <button
                        className="flex justify-center"
                        style={{ marginTop: '10px', 
                            minWidth: '150px', 
                            color: 'black',
                            textAlign: 'center',
                            display: 'flex',
                            justifyContent: 'center',
                            backgroundColor: 'green', 
                            border: 'none', 
                            borderRadius: '8px', 
                            fontSize: '16px',  
                            cursor: 'pointer'}}
                        onClick={onCatchClick}
                    >
                        Catch!
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PokemonDetail;
