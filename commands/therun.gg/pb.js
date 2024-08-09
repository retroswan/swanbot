import asciiAlphabet from "../../utilities/asciiAlphabet.js";

export async function getPBMap(user) {
    const leadingZeroes = (n) => {
        if (n < 10) {
            n = `0${n}`;
        }
        
        return n;
    };
    const divBySixty = (n) => {
        n = Math.floor(n / 60);
        
        return leadingZeroes(n);
    };
    const pbFunc = (ms) => {
        const intSeconds = Math.floor(ms / 1000);
        
        const denoms = [
            leadingZeroes(intSeconds % 60),
            divBySixty(intSeconds),
        ];

        if (denoms[1] >= 60) {
            denoms.push(divBySixty(denoms[1]));
            denoms[1] = leadingZeroes(denoms[1] % 60);
        }
        
        return denoms.reverse().join(':');
    };
    
    const response = await fetch(`https://therun.gg/api/users/${user}`);
    const data = await response.json();
    
    const games = new Map();
    
    data.map(pb => {
        const game = asciiAlphabet(pb.game);
        if (!games.has(game)) {
            games.set(game, new Map());
        }
        
        games.get(game).set(pb.run, pbFunc(pb.personalBest));
    });
    
    return games;
}
