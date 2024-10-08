export default function hashCode(str) {
    return str
        .toLowerCase()
        .split('')
        .reduce(
            (hashCode, letter) =>
                (hashCode * 31 + letter.charCodeAt(0)) % 2147483647,
            0
        );
};
