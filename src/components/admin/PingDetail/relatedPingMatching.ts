const TITLE_STOP_WORDS = new Set([
    "about", "after", "again", "also", "and", "are", "because", "been",
    "before", "being", "but", "can", "could", "did", "does", "for", "from",
    "had", "has", "have", "how", "into", "its", "may", "not", "our", "out",
    "please", "should", "some", "than", "that", "the", "their", "them",
    "there", "these", "they", "this", "those", "was", "were", "what", "when",
    "where", "which", "who", "why", "will", "with", "would", "you", "your",
    "issue", "issues", "problem", "problems",
]);

const getTitleKeywords = (title: string): Set<string> =>
    new Set(
        title
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .split(/[^a-z0-9]+/)
            .filter((word) => word.length > 2 && !TITLE_STOP_WORDS.has(word)),
    );

export const getRelatedTitleScore = (title: string, otherTitle: string): number => {
    const keywords = getTitleKeywords(title);
    const otherKeywords = getTitleKeywords(otherTitle);
    if (keywords.size === 0 || otherKeywords.size === 0) return 0;

    let sharedKeywords = 0;
    keywords.forEach((keyword) => {
        if (otherKeywords.has(keyword)) sharedKeywords += 1;
    });

    if (sharedKeywords < 2) return 0;
    const unionSize = keywords.size + otherKeywords.size - sharedKeywords;
    return unionSize > 0 ? sharedKeywords / unionSize : 0;
};
