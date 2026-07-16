export type Entry = {
    word: string;
    clue: string;
    displayWord?: string;
    lang?: 'ja';
};

export const defaultEntries: Entry[] = [
    { word: 'あめ', clue: 'Rain', lang: 'ja' },
    { word: 'そら', clue: 'Sky', lang: 'ja' },
    { word: 'はな', clue: 'Flower', lang: 'ja' },
    { word: 'やま', clue: 'Mountain', lang: 'ja' },
    { word: 'うみ', clue: 'Sea', lang: 'ja' },
];

export async function fetchWordSearchEntries(
    jlptLevel: string,
    limit: number,
    signal: AbortSignal,
): Promise<Entry[]> {
    const level =
        jlptLevel === 'All' ? undefined : Number(jlptLevel.replace('N', ''));
    const offset = Math.floor(Math.random() * 50);

    const response = fetch('https://jlpt-vocab-api.vercel.app/api/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                query GetWords($limit: Int, $level: Int, $offset: Int) {
                    words(limit: $limit, level: $level, offset: $offset) {
                        words {
                            word
                            meaning
                            furigana
                        }
                    }
                }
            `,
            variables: {
                limit,
                level,
                offset,
            },
        }),
        signal,
    })
        .then((response) => response.json())
        .then(({ data }) => data?.words?.words ?? [])
        .then(
            (
                words: Array<{
                    word?: string;
                    meaning?: string;
                    furigana?: string;
                }>,
            ) => {
                return words
                    .map((item) => {
                        const boardWord =
                            item.furigana?.trim() || item.word?.trim() || '';
                        const displayWord = item.word?.trim() || boardWord;
                        return {
                            word: boardWord,
                            displayWord,
                            clue: item.meaning?.trim() || 'Meaning unavailable',
                            lang: 'ja' as const,
                        };
                    })
                    .filter((item: Entry) => item.word.length > 1);
            },
        );

    return response;
}

