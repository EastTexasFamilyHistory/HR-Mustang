// baseColor.js
import GeneUtils from './utils.js';

const BaseColorCalculator = {
    determineBaseColor(extension, agouti) {
        if (!extension || !agouti) return null;
        
        const ext = GeneUtils.parseGenotype(extension);
        const ago = GeneUtils.parseGenotype(agouti);
        
        // Red base (extension epistatic)
        if (ext.allele1 === 'e' && ext.allele2 === 'e') {
            return { 
                color: 'Red',
                genotypes: [extension, agouti]
            };
        }
        
        // Black base affected by agouti
        if (ago.allele1 === 'a' && ago.allele2 === 'a') {
            return {
                color: 'Black',
                genotypes: [extension, agouti]
            };
        }
        
        // Bay variations based on agouti alleles
        const hasWildType = ago.allele1.includes('+') || ago.allele2.includes('+');
        const hasSealBay = ago.allele1.includes('t') || ago.allele2.includes('t');
        
        if (hasWildType) {
            return {
                color: 'Wild Bay',
                genotypes: [extension, agouti]
            };
        } else if (hasSealBay) {
            return {
                color: 'Seal Bay',
                genotypes: [extension, agouti]
            };
        }
        
        return {
            color: 'Bay',
            genotypes: [extension, agouti]
        };
    }
};

export default BaseColorCalculator;
