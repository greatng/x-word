export type Placement = {
    word: string;
    displayWord?: string;
    clue: string;
    row: number;
    col: number;
    dir: 'across' | 'down' | 'diag';
};

const HIRAGANA =
    'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'.split(
        '',
    );

function isHiragana(char: string) {
    const code = char.charCodeAt(0);
    return code >= 0x3040 && code <= 0x309f;
}

function isKatakana(char: string) {
    const code = char.charCodeAt(0);
    return code >= 0x30a0 && code <= 0x30ff;
}

export function normalizeWord(word: string) {
    return Array.from(word.normalize('NFKC').trim())
        .filter(
            (char) => isHiragana(char) || isKatakana(char) || /\d/.test(char),
        )
        .join('');
}

export type BuildBoardOptions = {
    size?: number;
    limit?: number;
};

export function buildBoard(
    entries: Array<{ word: string; clue: string }>,
    options?: BuildBoardOptions,
) {
    const size = options?.size ?? 11;
    const board = Array.from({ length: size }, () => Array(size).fill(''));
    const placements: Placement[] = [];
    const words = entries
        .map((entry) => ({
            ...entry,
            word: normalizeWord(entry.word),
            displayWord: entry.displayWord ?? entry.word,
        }))
        .filter((entry) => entry.word.length > 1)
        .sort((a, b) => b.word.length - a.word.length)
        .slice(0, options?.limit ?? entries.length);

    for (const entry of words) {
        const placed = tryPlaceWord(board, entry.word, entry.clue, size);
        if (placed) placements.push(placed);
    }

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (!board[r][c])
                board[r][c] =
                    HIRAGANA[Math.floor(Math.random() * HIRAGANA.length)];
        }
    }

    return { board, placements, size };
}

function tryPlaceWord(
    board: string[][],
    word: string,
    clue: string,
    size: number,
) {
    const dirs: Array<'across' | 'down' | 'diag'> = ['across', 'down', 'diag'];
    for (let attempt = 0; attempt < 120; attempt++) {
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);
        const dir = dirs[Math.floor(Math.random() * dirs.length)];
        if (!canPlace(board, word, row, col, dir, size)) continue;
        for (let i = 0; i < word.length; i++) {
            const r = dir === 'down' ? row + i : dir === 'diag' ? row + i : row;
            const c =
                dir === 'across' ? col + i : dir === 'diag' ? col + i : col;
            board[r][c] = word[i];
        }
        return { word, displayWord: word, clue, row, col, dir };
    }
    return null;
}

function canPlace(
    board: string[][],
    word: string,
    row: number,
    col: number,
    dir: 'across' | 'down' | 'diag',
    size: number,
) {
    for (let i = 0; i < word.length; i++) {
        const r = dir === 'down' ? row + i : dir === 'diag' ? row + i : row;
        const c = dir === 'across' ? col + i : dir === 'diag' ? col + i : col;
        if (r >= size || c >= size) return false;
        const cell = board[r][c];
        if (cell && cell !== word[i]) return false;
    }
    return true;
}

export function getCellsForPlacement(placement: Placement, size: number) {
    const cells: Array<{ r: number; c: number }> = [];
    const { row, col, dir } = placement;
    for (let i = 0; i < placement.word.length; i++) {
        const r = dir === 'down' ? row + i : dir === 'diag' ? row + i : row;
        const c = dir === 'across' ? col + i : dir === 'diag' ? col + i : col;
        if (r >= size || c >= size) return [];
        cells.push({ r, c });
    }
    return cells;
}

