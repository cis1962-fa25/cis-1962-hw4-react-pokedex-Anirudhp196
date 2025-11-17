import type { PokemonCardProps } from '../types/types';

function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
    const imageUrl = pokemon.sprites.front_default;
    const primaryTypeColor = pokemon.types.length > 0 ? pokemon.types[0].color : '#6b7280';

    return (
        <div
            onClick={onClick}
            className="cursor-pointer rounded-xl shadow-lg hover:shadow-xl p-6 transform hover:scale-105 transition-all duration-300"
            style={{ 
                width: '180px', 
                minWidth: '180px',
                flexShrink: 0,
                backgroundColor: primaryTypeColor,
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
            }}
        >
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={pokemon.name}
                    style={{ 
                        width: '112px',
                        height: '112px',
                        objectFit: 'contain',
                        margin: '0 auto'
                    }}
                />
            ) : (
                <div style={{ 
                    width: '112px',
                    height: '112px',
                    margin: '0 auto',
                    backgroundColor: '#d1d5db',
                    borderRadius: '8px'
                }} />
            )}
            
            <h2 className="text-white capitalize font-bold mt-4 text-center w-full drop-shadow-md">
                {pokemon.name}
            </h2>
            {pokemon.types.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap justify-center">
                    {pokemon.types.slice(0, 2).map((type) => (
                        <span
                            key={type.name}
                            className="px-2 py-0.5 rounded-full text-xs font-semibold text-white uppercase"
                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                        >
                            {type.name}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PokemonCard;