// utils.js
const GeneUtils = {
    parseGenotype(genotypeStr) {
        if (!genotypeStr) return null;
        const [allele1, allele2] = genotypeStr.split('/');
        return { allele1, allele2 };
    },

    getAlleleCombinations(parent1Genotype, parent2Genotype) {
        if (!parent1Genotype || !parent2Genotype) return null;
        
        const p1 = this.parseGenotype(parent1Genotype);
        const p2 = this.parseGenotype(parent2Genotype);
        
        return [
            `${p1.allele1}/${p2.allele1}`,
            `${p1.allele1}/${p2.allele2}`,
            `${p1.allele2}/${p2.allele1}`,
            `${p1.allele2}/${p2.allele2}`
        ];
    },

    standardizeGenotype(allele1, allele2) {
        const dominanceOrder = {
            'A+': 6, 'A': 5, 'At': 4, 'a': 3,
            'E': 2, 'e': 1,
            'CR': 4, 'prl': 3, 'n': 1,
            'Ch': 2, 'D': 2, 'Z': 2,
            'Olw': 2, 'TO': 2, 'RN': 2,
            'STY': 2, 'PG': 2,
            'F': 2, 'f': 1
        };

        if (dominanceOrder[allele1] >= dominanceOrder[allele2]) {
            return `${allele1}/${allele2}`;
        }
        return `${allele2}/${allele1}`;
    }
};

// Export for use in other modules
export default GeneUtils;
