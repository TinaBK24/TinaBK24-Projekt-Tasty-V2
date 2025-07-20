export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
        return text;
    }

    // Обрізаємо текст до maxLength
    let truncated = text.substring(0, maxLength);

    // Знаходимо останній пробіл у обрізаному тексті
    const lastSpaceIndex = truncated.lastIndexOf(',');

    // Якщо пробіл знайдено і він не на самому початку, обрізаємо до нього
    if (lastSpaceIndex !== -1 && lastSpaceIndex > (maxLength * 0.7)) { // Додаємо умову, щоб не обрізати занадто коротко
        truncated = truncated.substring(0, lastSpaceIndex);
    }

    return truncated;
}