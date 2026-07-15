import { render } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import './style.css';
import {
    defaultEntries,
    fetchWordSearchEntries,
} from './features/wordSearchData';
import {
    buildBoard,
    getCellsForPlacement,
} from './features/wordSearchGenerator';
import { WordSearchBoard } from './components/WordSearchBoard';
import { WordSearchClues } from './components/WordSearchClues';
import { WordSearchHeader } from './components/WordSearchHeader';

type WordSearchProps = {
    entries?: Array<{ word: string; clue: string; lang?: 'ja' }>;
    title?: string;
};
type Cell = { r: number; c: number };

type StoredState = {
    jlptLevel: string;
    entries: Array<{ word: string; clue: string; lang?: 'ja' }>;
    debugMode: boolean;
    boardSize: number;
    wordCount: number;
};

const debugEntries = [{ word: 'あめ', clue: 'Rain', lang: 'ja' as const }];
const storageKey = 'word-search-state';

function readStoredState(): StoredState | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(storageKey);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function writeStoredState(state: StoredState) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(storageKey, JSON.stringify(state));
}

export function WordSearchGame({
    entries = defaultEntries,
    title = 'Word Search',
}: WordSearchProps) {
    const initialState = readStoredState();
    const [jlptLevel, setJlptLevel] = useState(initialState?.jlptLevel ?? 'N5');
    const [debugMode, setDebugMode] = useState(
        initialState?.debugMode ?? false,
    );
    const [boardSize, setBoardSize] = useState(initialState?.boardSize ?? 11);
    const [wordCount, setWordCount] = useState(initialState?.wordCount ?? 5);
    const [loadedEntries, setLoadedEntries] = useState(
        initialState?.entries ?? entries,
    );
    const [isLoading, setIsLoading] = useState(true);
    const activeEntries = debugMode ? debugEntries : loadedEntries;
    const { board, placements } = useMemo(
        () =>
            buildBoard(activeEntries, {
                size: debugMode ? 7 : boardSize,
                limit: debugMode ? 1 : wordCount,
            }),
        [activeEntries, boardSize, debugMode, wordCount],
    );
    const [selected, setSelected] = useState<Cell[]>([]);
    const [activeClue, setActiveClue] = useState<number | null>(null);
    const [solved, setSolved] = useState<number[]>([]);

    useEffect(() => {
        writeStoredState({
            jlptLevel,
            entries: debugMode ? debugEntries : loadedEntries,
            debugMode,
            boardSize,
            wordCount,
        });
    }, [boardSize, debugMode, jlptLevel, loadedEntries, wordCount]);

    useEffect(() => {
        if (debugMode) {
            setLoadedEntries(debugEntries);
            setSelected([]);
            setActiveClue(null);
            setSolved([]);
            setIsLoading(false);
            return;
        }

        let active = true;
        setIsLoading(true);
        fetchWordSearchEntries(jlptLevel)
            .then((data) => {
                if (active) {
                    setLoadedEntries(data);
                    setSelected([]);
                    setActiveClue(null);
                    setSolved([]);
                }
            })
            .catch(() => {
                if (active) {
                    setLoadedEntries(entries);
                }
            })
            .finally(() => {
                if (active) {
                    setIsLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [debugMode, entries, jlptLevel]);

    const checkSelection = () => {
        if (activeClue === null || selected.length === 0) return;
        const placement = placements[activeClue];
        const cells = getCellsForPlacement(placement, board.length);
        const selectedText = selected.map((p) => board[p.r][p.c]).join('');
        console.log(
            'Selected text:',
            selectedText,
            'Expected:',
            placement.word,
        );
        if (selectedText === placement.word) {
            setSolved((prev) =>
                prev.includes(activeClue) ? prev : [...prev, activeClue],
            );
            setSelected(cells);
        } else {
            setSelected([]);
        }
    };

    const toggleCell = (r: number, c: number) => {
        const key = `${r}-${c}`;
        const exists = selected.some((cell) => `${cell.r}-${cell.c}` === key);
        if (exists) {
            setSelected(
                selected.filter((cell) => `${cell.r}-${cell.c}` !== key),
            );
        } else {
            setSelected([...selected, { r, c }]);
        }
    };

    const solvedCells = solved.flatMap((idx) => {
        const placement = placements[idx];
        return placement ? getCellsForPlacement(placement, board.length) : [];
    });

    const requestNewData = () => {
        setSelected([]);
        setActiveClue(null);
        setIsLoading(true);
        setSolved([]);
        if (debugMode) {
            setLoadedEntries(debugEntries);
            setIsLoading(false);
            return;
        }

        fetchWordSearchEntries(jlptLevel)
            .then((data) => {
                setLoadedEntries(data);
            })
            .catch(() => {
                setLoadedEntries(entries);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#0f172a,_#111827_55%,_#020617)] p-4 text-slate-100">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 rounded-[28px] border border-slate-700/80 bg-slate-900/80 p-4 shadow-2xl shadow-black/50 backdrop-blur md:p-6">
                <WordSearchHeader
                    title={title}
                    jlptLevel={jlptLevel}
                    boardSize={boardSize}
                    wordCount={wordCount}
                    onJlptChange={setJlptLevel}
                    onBoardSizeChange={setBoardSize}
                    onWordCountChange={setWordCount}
                    onReset={requestNewData}
                />
                {isLoading ? (
                    <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-3 text-sm text-slate-300">
                        Loading vocabulary from JLPT API…
                    </div>
                ) : null}
                <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                    <WordSearchBoard
                        board={board}
                        selected={selected}
                        solved={solvedCells}
                        onCellClick={toggleCell}
                    />
                    <WordSearchClues
                        placements={placements}
                        activeClue={activeClue}
                        solvedIndexes={solved}
                        onSelectClue={(index) => {
                            setActiveClue(index);
                        }}
                        onCheck={checkSelection}
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => setDebugMode((value) => !value)}
                        className={`rounded-full border px-3 py-1 text-sm font-medium ${debugMode ? 'border-amber-400 bg-amber-500/15 text-amber-200' : 'border-slate-700 bg-slate-800/80 text-slate-200'}`}
                    >
                        {debugMode ? 'Debug: ON' : 'Debug: OFF'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function App() {
    return <WordSearchGame entries={defaultEntries} title="Mini Word Search" />;
}

render(<App />, document.getElementById('app'));

