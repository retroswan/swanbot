import hashCode from "../utilities/hash.js";

const auras = [
    'red', 'orange', 'yellow', 'green', 'blue', 'violet',
];

export default function getAura(str) {
    const hash = hashCode(str);
    
    const aura = auras[hash % auras.length];
    
    return `${str}'s aura is ${aura}`;
}
