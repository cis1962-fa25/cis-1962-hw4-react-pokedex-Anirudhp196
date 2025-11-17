import type { BoxCardProps } from '../types/types';

function BoxCard({ entry, pokemon, onEdit, onDelete }: BoxCardProps) {
    const handleDelete = () => {
        if (!window.confirm(`Delete ${pokemon.name} from your Box?`)) return;
        onDelete(entry.id);
    };

    return (
        <div className="rounded-xl shadow-lg p-6 bg-white border border-gray-200 w-full max-w-xs flex flex-col gap-3">
            <div className="flex flex-col items-center text-center">
                {pokemon.sprites.front_default ? (
                    <img
                        src={pokemon.sprites.front_default}
                        alt={pokemon.name}
                        className="w-24 h-24 object-contain"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        N/A
                    </div>
                )}
                <h3 className="text-xl font-semibold capitalize mt-3">{pokemon.name}</h3>
            </div>

            <div className="text-sm text-gray-600 space-y-1 text-center">
                <p><span className="font-semibold">Location:</span> {entry.location}</p>
                <p><span className="font-semibold">Level:</span> {entry.level}</p>
                <p><span className="font-semibold">Caught:</span> {new Date(entry.createdAt).toLocaleString()}</p>
                {entry.notes && (
                    <p className="italic text-gray-500 border-t pt-2 mt-2">{entry.notes}</p>
                )}
            </div>

            <div className="flex gap-2 mt-auto">
                <button
                    onClick={() => onEdit(entry)}
                    className="flex-1 px-3 py-2 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    Edit
                </button>
                <button
                    onClick={handleDelete}
                    className="flex-1 px-3 py-2 text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default BoxCard;

