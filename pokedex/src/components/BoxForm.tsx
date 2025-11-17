import { useState, useEffect, useRef } from 'react';
import type { InsertBoxEntry, BoxEntry, UpdateBoxEntry } from '../types/types';
import '../styles/modal.css';

interface BoxFormProps {
    pokemonId: number;
    entry?: BoxEntry | null;
    mode?: 'create' | 'edit';
    onSubmit: (entry: InsertBoxEntry | UpdateBoxEntry, isEdit?: boolean, entryId?: string) => void;
    onCancel: () => void;
    error?: string | null;
    loading?: boolean;
}

function BoxForm({ pokemonId, entry, mode = 'create', onSubmit, onCancel, error, loading }: BoxFormProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLSpanElement>(null);

    const [location, setLocation] = useState(entry?.location ?? '');
    const [level, setLevel] = useState(entry?.level ?? 1);
    const [notes, setNotes] = useState(entry?.notes ?? '');
    const [localError, setLocalError] = useState<string | null>(null);
    const [createdAt] = useState(entry?.createdAt ?? new Date().toISOString());

    // From w3 schools modal example
    useEffect(() => {
        const modal = modalRef.current;
        const closeBtn = closeRef.current;

        if (!modal || !closeBtn) return;

        modal.classList.add('show');

        const handleClose = () => {
            modal.classList.remove('show');
            setTimeout(onCancel, 300);
        };

        closeBtn.onclick = handleClose;

        const handleWindowClick = (event: MouseEvent) => {
            if (event.target === modal) {
                modal.classList.remove('show');
                setTimeout(onCancel, 300);
            }
        };

        window.addEventListener('click', handleWindowClick);

        return () => {
            closeBtn.onclick = null;
            window.removeEventListener('click', handleWindowClick);
        };
    }, [onCancel]);

    useEffect(() => {
        if (localError) {
            setLocalError(null);
        }
    }, [location, level, notes, localError]);

    useEffect(() => {
        if (entry) {
            setLocation(entry.location);
            setLevel(entry.level);
            setNotes(entry.notes ?? '');
        }
    }, [entry]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedLocation = location.trim();
        if (!trimmedLocation) {
            setLocalError('Location is required.');
            return;
        }

        const levelNumber = Number(level);
        const isInteger = Number.isInteger(levelNumber);
        if (!isInteger || levelNumber < 1 || levelNumber > 100) {
            setLocalError('Level must be an integer between 1 and 100.');
            return;
        }

        if (notes && notes.length > 500) {
            setLocalError('Notes must be 500 characters or less.');
            return;
        }

        if (mode === 'edit' && entry) {
            const updateEntry: UpdateBoxEntry = {
                location: trimmedLocation,
                level: levelNumber,
                notes: notes.trim() ? notes.trim() : undefined,
            };
            onSubmit(updateEntry, true, entry.id);
        } else {
            const insertEntry: InsertBoxEntry = {
                pokemonId,
                location: trimmedLocation,
                level: levelNumber,
                createdAt,
                notes: notes.trim() ? notes.trim() : undefined,
            };
            onSubmit(insertEntry, false);
        }
    };

    return (
        <div
            id="boxFormModal"
            className="modal"
            ref={modalRef}
            onClick={(e) => {
                if (e.target === modalRef.current) {
                    modalRef.current?.classList.remove('show');
                    setTimeout(onCancel, 300);
                }
            }}
        >
            <div className="modal-content" style={{ maxWidth: '600px' }}>
                <div className="text-center mb-4">
                    <span className="close" ref={closeRef}>&times;</span>
                    <h2 className="text-3xl font-bold text-gray-900">
                        {mode === 'edit' ? 'Edit Box Entry' : 'Add to Box'}
                    </h2>
                    <p className="text-gray-500 mt-1">
                        {mode === 'edit' ? 'Update the details for this catch' : 'Log where and how you caught this Pokémon'}
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-8">
                    <div>
                        <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor="location">Location *</label>
                        <input
                            id="location"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="e.g., Route 1, Viridian Forest"
                            maxLength={100}
                            disabled={loading}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor="level">Level (1-100) *</label>
                        <input
                            id="level"
                            type="number"
                            min={1}
                            max={100}
                            value={level}
                            onChange={(e) => setLevel(Number(e.target.value))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            disabled={loading}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor="createdAt">Caught At</label>
                        <input
                            id="createdAt"
                            type="text"
                            value={createdAt}
                            readOnly
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor="notes">Notes (optional)</label>
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            rows={4}
                            maxLength={500}
                            placeholder="Add any special circumstances or thoughts about this catch..."
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-500 mt-1 text-right">{notes.length}/500 characters</p>
                    </div>

                    {(localError || error) && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                            {localError || error}
                        </div>
                    )}

                    <div className="flex gap-3 justify-end pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                modalRef.current?.classList.remove('show');
                                setTimeout(onCancel, 300);
                            }}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60 transition flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            {loading ? (mode === 'edit' ? 'Saving...' : 'Catching...') : mode === 'edit' ? 'Save' : 'Catch!'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BoxForm;

