import { useState } from 'preact/hooks';
import type { Placement } from '../features/wordSearchGenerator';

type Props = {
    placements: Placement[];
    activeClue: number | null;
    solvedIndexes: number[];
    onSelectClue: (index: number) => void;
    onCheck: () => void;
};

export function WordSearchClues({
    placements,
    activeClue,
    solvedIndexes,
    onSelectClue,
    onCheck,
}: Props) {
    const [showWord, setShowWord] = useState(false);

    return (
        <div className="rounded-2xl border border-slate-700 bg-slate-800/90 p-3 shadow-[0_0_0_1px_rgba(255,255,white,0.03)]">
            <div className="mb-2 flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
                    Clues
                </h2>
                <button
                    type="button"
                    onClick={() => setShowWord((value) => !value)}
                    className="rounded-full border border-slate-600 bg-slate-700/70 px-2 py-1 text-[11px] font-medium text-slate-200"
                >
                    {showWord ? 'Word: on' : 'Word: off'}
                </button>
            </div>
            <div className="space-y-1 text-sm">
                {placements.map((p, i) => (
                    <button
                        key={`c-${i}`}
                        onClick={() => onSelectClue(i)}
                        className={`block w-full rounded-xl px-2 py-2 text-left shadow-sm ${activeClue === i ? 'bg-violet-600/80 text-white' : 'bg-slate-700/70 text-slate-200'}`}
                    >
                        <span className="mr-2 font-semibold text-violet-300">
                            {i + 1}.
                        </span>
                        {solvedIndexes.includes(i) ? (
                            <span className="flex flex-wrap items-center gap-1 font-semibold text-emerald-400">
                                <span>✓</span>
                                <span>{p.clue}</span>
                                <span className="text-xs text-emerald-300">
                                    {p.displayWord ?? p.word}
                                </span>
                            </span>
                        ) : (
                            <span className="flex flex-wrap items-center gap-1">
                                <span>{p.clue}</span>
                                {showWord ? (
                                    <span className="text-xs text-slate-400">
                                        {p.displayWord ?? p.word}
                                    </span>
                                ) : null}
                            </span>
                        )}
                    </button>
                ))}
            </div>
            <button
                onClick={onCheck}
                className="mt-3 w-full rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900"
            >
                Check selection
            </button>
        </div>
    );
}

