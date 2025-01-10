export default function toSlug(str) {
    str = str.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '').trim();
    console.log(str);
    return str;
}
