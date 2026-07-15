type Props = {
    board: string[][];
    selected: Array<{ r: number; c: number }>;
    solved: Array<{ r: number; c: number }>;
    onCellClick: (r: number, c: number) => void;
};

export function WordSearchBoard({
    board,
    selected,
    solved,
    onCellClick,
}: Props) {
    return (
        <div className="rounded-2xl border border-slate-600/70 bg-slate-950/80 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
            <div
                className="grid gap-[2px]"
                style={{
                    gridTemplateColumns: `repeat(${board[0].length}, minmax(0, 1fr))`,
                }}
            >
                {board.flatMap((row, r) =>
                    row.map((cell, c) => {
                        const isSelected = selected.some(
                            (item) => item.r === r && item.c === c,
                        );
                        const isSolved = solved.some(
                            (item) => item.r === r && item.c === c,
                        );
                        return (
                            <button
                                key={`${r}-${c}`}
                                onClick={() => onCellClick(r, c)}
                                className={`flex aspect-square items-center justify-center border border-slate-600/70 text-base font-bold sm:text-lg ${isSolved ? 'bg-emerald-500/80 text-white' : isSelected ? 'bg-violet-400/80 text-white' : 'bg-slate-200 text-slate-800'}`}
                            >
                                {cell}
                            </button>
                        );
                    }),
                )}
            </div>
        </div>
    );
}

