export function generateRandomCode(length: number): string {
    const charactersRegex = /[a-zA-Z0-9]/g;

    return Array.from({ length }, () => {
        let randomChar;
        do {
            const charCode = Math.floor(Math.random() * 62);
            randomChar = String.fromCharCode(
                charCode < 26 ? charCode + 97 : charCode < 52 ? charCode + 39 : charCode - 4
            );
        } while (!randomChar.match(charactersRegex));

        return randomChar;
    }).join('');
}

export function isValidCode(code: string): boolean {
    return /[a-z]/.test(code) && /[A-Z]/.test(code) && /\d/.test(code);
}
