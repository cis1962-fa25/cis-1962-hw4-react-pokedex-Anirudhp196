import type { PokemonCardProps } from '../types/types';

function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
    const imageUrl = pokemon.sprites.front_default;

    return (
        <div
            onClick={onClick}
            className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg p-4 text-center"
        >
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={pokemon.name}
                    className="mx-auto w-20 h-20 object-contain"
                />
            ) : (
                <div className="w-20 h-20 mx-auto bg-gray-200 rounded" />
            )}
            
            <h2 className="capitalize font-semibold mt-2">{pokemon.name}</h2>
        </div>
    );
}

export default PokemonCard;