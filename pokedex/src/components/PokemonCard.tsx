import type { PokemonCardProps } from '../types/types';

function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
    const imageUrl = pokemon.sprites.front_default;

    return (
        <div
            onClick={onClick}
            className="cursor-pointer rounded-xl shadow hover:shadow-lg p-6"
            style={{ 
                width: '180px', 
                flexShrink: 0,
                backgroundColor: '#305662ff',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'box-shadow 0.3s ease',
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
            
            <h2 style={{ 
                textTransform: 'capitalize',
                fontWeight: '600',
                marginTop: '16px',
                textAlign: 'center',
                width: '100%'
            }}>
                {pokemon.name}
            </h2>
        </div>
    );
}

export default PokemonCard;