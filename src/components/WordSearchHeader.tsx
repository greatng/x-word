type Props = {
    title: string;
    jlptLevel: string;
    boardSize: number;
    wordCount: number;
    onJlptChange: (value: string) => void;
    onBoardSizeChange: (value: number) => void;
    onWordCountChange: (value: number) => void;
    onReset: () => void;
};

export function WordSearchHeader({
    title,
    jlptLevel,
    boardSize,
    wordCount,
    onJlptChange,
    onBoardSizeChange,
    onWordCountChange,
    onReset,
}: Props) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-violet-400">
                    Japanese word search
                </p>
                <h1 className="text-2xl font-black text-slate-100">{title}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-sm text-slate-200">
                    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                        JLPT
                    </span>
                    <select
                        value={jlptLevel}
                        onChange={(event) =>
                            onJlptChange(event.currentTarget.value)
                        }
                        className="bg-transparent pr-1 text-sm font-medium text-slate-100 outline-none"
                        aria-label="Select JLPT level"
                    >
                        <option
                            value="N5"
                            className="bg-slate-900 text-slate-100"
                        >
                            N5
                        </option>
                        <option
                            value="N4"
                            className="bg-slate-900 text-slate-100"
                        >
                            N4
                        </option>
                        <option
                            value="N3"
                            className="bg-slate-900 text-slate-100"
                        >
                            N3
                        </option>
                        <option
                            value="N2"
                            className="bg-slate-900 text-slate-100"
                        >
                            N2
                        </option>
                        <option
                            value="N1"
                            className="bg-slate-900 text-slate-100"
                        >
                            N1
                        </option>
                        <option
                            value="All"
                            className="bg-slate-900 text-slate-100"
                        >
                            All
                        </option>
                    </select>
                </label>
                <label className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-sm text-slate-200">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                        Size
                    </span>
                    <select
                        value={boardSize}
                        onChange={(event) =>
                            onBoardSizeChange(Number(event.currentTarget.value))
                        }
                        className="bg-transparent pr-1 text-sm font-medium text-slate-100 outline-none"
                        aria-label="Select board size"
                    >
                        <option
                            value={7}
                            className="bg-slate-900 text-slate-100"
                        >
                            7
                        </option>
                        <option
                            value={9}
                            className="bg-slate-900 text-slate-100"
                        >
                            9
                        </option>
                        <option
                            value={11}
                            className="bg-slate-900 text-slate-100"
                        >
                            11
                        </option>
                    </select>
                </label>
                <label className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-sm text-slate-200">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                        Words
                    </span>
                    <select
                        value={wordCount}
                        onChange={(event) =>
                            onWordCountChange(Number(event.currentTarget.value))
                        }
                        className="bg-transparent pr-1 text-sm font-medium text-slate-100 outline-none"
                        aria-label="Select word count"
                    >
                        <option
                            value={1}
                            className="bg-slate-900 text-slate-100"
                        >
                            1
                        </option>
                        <option
                            value={3}
                            className="bg-slate-900 text-slate-100"
                        >
                            3
                        </option>
                        <option
                            value={5}
                            className="bg-slate-900 text-slate-100"
                        >
                            5
                        </option>
                    </select>
                </label>
                <button
                    type="button"
                    onClick={onReset}
                    className="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-sm font-medium text-slate-200"
                >
                    Reset
                </button>
                <div className="rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1 text-sm text-violet-200">
                    Hiragana only
                </div>
            </div>
        </div>
    );
}

