import { useState, useEffect } from 'react';
import type { InsertBoxEntry } from '../types/types';

interface BoxFormProps {
    pokemonId: number;
    onSubmit: (entry: InsertBoxEntry) => void;
    onCancel: () => void;
    error?: string | null;
    loading?: boolean;
}

function BoxForm({ pokemonId, onSubmit, onCancel, error, loading }: BoxFormProps) {
    const [location, setLocation] = useState('');
    const [level, setLevel] = useState(1);
    const [notes, setNotes] = useState('');
    const [localError, setLocalError] = useState<string | null>(null);
    const createdAt = new Date().toISOString();

    // Reset field errors if parent error or fields change
    useEffect(() => {
        setLocalError(null);
    }, [location, level, notes]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);
        if (!location.trim()) {
            setLocalError('Location is required.');
            return;
        }
        if (!Number.isInteger(level) || level < 1 || level > 100) {
            setLocalError('Level must be an integer between 1 and 100.');
            return;
        }
        const entry: InsertBoxEntry = {
            pokemonId,
            location,
            level,
            createdAt,
            notes: notes.trim() ? notes : undefined,
        };
        onSubmit(entry);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content max-w-md mx-auto p-6 bg-white rounded shadow-lg relative">
                <h2 className="text-2xl font-bold mb-4">Add to Box</h2>
                <form onSubmit={handleSubmit}>
                    <input type="hidden" value={pokemonId} />
                    <div className="mb-3">
                        <label className="block mb-1 font-semibold" htmlFor="location">Location *</label>
                        <input
                            id="location"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full border p-2 rounded"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block mb-1 font-semibold" htmlFor="level">Level (1-100) *</label>
                        <input
                            id="level"
                            type="number"
                            min="1"
                            max="100"
                            value={level}
                            onChange={(e) => setLevel(Number(e.target.value))}
                            className="w-full border p-2 rounded"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block mb-1 font-semibold" htmlFor="createdAt">Created At</label>
                        <input
                            id="createdAt"
                            type="text"
                            value={createdAt}
                            className="w-full border p-2 rounded bg-gray-100"
                            readOnly
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold" htmlFor="notes">Notes</label>
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full border p-2 rounded"
                            rows={3}
                            disabled={loading}
                        />
                    </div>
                    {(localError || error) && <div className="mb-2 text-red-600">{localError || error}</div>}
                    <div className="flex gap-2 mt-4">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
                            disabled={loading}
                        >
                            {loading ? 'Catching...' : 'Catch!'}
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-semibold"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BoxForm;
