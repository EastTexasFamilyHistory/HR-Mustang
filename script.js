// script.js
import GeneUtils from './utils.js';
import BaseColorCalculator from './baseColor.js';

class HorseGeneticsCalculator {
    constructor() {
        this.geneCategories = {
            baseColor: ['extension', 'agouti'],
            dilutions: ['cream', 'champagne', 'dun', 'silver'],
            patterns: ['overo', 'tobiano', 'roan'],
            modifiers: ['flaxen', 'sooty', 'pangare']
        };
    }

    // Get all input values from the form
    getParentGenotypes() {
        const parents = {
            dam: {},
            sire: {}
        };

        // Collect all gene values for both parents
        Object.values(this.geneCategories).flat().forEach(gene => {
            parents.dam[gene] = document.getElementById(`dam-${gene}`).value;
            parents.sire[gene] = document.getElementById(`sire-${gene}`).value;
        });

        return parents;
    }

    // Calculate all possible combinations for each gene
    calculateGeneCombinations(parents) {
        const combinations = {};
        
        Object.values(this.geneCategories).flat().forEach(gene => {
            combinations[gene] = GeneUtils.getAlleleCombinations(
                parents.dam[gene],
                parents.sire[gene]
            );
        });

        return combinations;
    }

    // Process a single combination of genes
    processGeneCombination(genes) {
        // Start with base color
        let phenotype = BaseColorCalculator.determineBaseColor(
            genes.extension,
            genes.agouti
        );

        if (!phenotype) return null;

        // Apply dilutions (to be implemented)
        
    applyDilutions(phenotype, dilutions) {
        let result = { ...phenotype };

        // Apply dilutions in specific order: cream/pearl first, then champagne, dun, and silver
        result = this.applyCreamPearl(result, dilutions.cream);
        result = this.applyChampagne(result, dilutions.champagne);
        result = this.applyDun(result, dilutions.dun);
        result = this.applySilver(result, dilutions.silver);

        return result;
    }

    applyCreamPearl(phenotype, cream) {
        if (!cream || cream === 'n/n') return phenotype;

        const result = { ...phenotype };
        const baseColor = result.color;
        
        // Cream/Pearl interaction mapping
        const creamEffects = {
            'CR/CR': {
                'Red': 'Cremello',
                'Black': 'Smoky Cream',
                'Bay': 'Perlino',
                'Wild Bay': 'Perlino',
                'Seal Bay': 'Perlino'
            },
            'CR/prl': {
                'Red': 'Cremello',
                'Black': 'Smoky Cream',
                'Bay': 'Perlino',
                'Wild Bay': 'Perlino',
                'Seal Bay': 'Perlino'
            },
            'CR/n': {
                'Red': 'Palomino',
                'Black': 'Smoky Black',
                'Bay': 'Buckskin',
                'Wild Bay': 'Wild Buckskin',
                'Seal Bay': 'Seal Buckskin'
            },
            'prl/prl': {
                'Red': 'Apricot Pearl',
                'Black': 'Black',
                'Bay': 'Bay',
                'Wild Bay': 'Wild Bay',
                'Seal Bay': 'Seal Bay'
            }
        };

        if (creamEffects[cream] && creamEffects[cream][baseColor]) {
            result.color = creamEffects[cream][baseColor];
            result.genotypes.push(cream);
        }

        return result;
    }

    applyChampagne(phenotype, champagne) {
        if (!champagne || champagne === 'n/n') return phenotype;

        const result = { ...phenotype };
        const baseColor = result.color;

        // Champagne effects mapping
        const champagneEffects = {
            'Red': 'Gold Champagne',
            'Palomino': 'Gold Champagne',
            'Black': 'Classic Champagne',
            'Smoky Black': 'Classic Champagne',
            'Bay': 'Amber Champagne',
            'Wild Bay': 'Sable Champagne',
            'Seal Bay': 'Amber Champagne',
            'Buckskin': 'Amber Champagne',
            'Wild Buckskin': 'Sable Champagne',
            'Seal Buckskin': 'Amber Champagne',
            'Cremello': 'Gold Cream Champagne',
            'Smoky Cream': 'Classic Cream Champagne',
            'Perlino': 'Amber Cream Champagne'
        };

        if (champagneEffects[baseColor]) {
            result.color = champagneEffects[baseColor];
            result.genotypes.push(champagne);
        }

        return result;
    }

    applyDun(phenotype, dun) {
        if (!dun || dun === 'n/n') return phenotype;

        const result = { ...phenotype };
        const baseColor = result.color;

        // Dun effects mapping
        const dunEffects = {
            'Red': 'Red Dun',
            'Palomino': 'Dunalino',
            'Black': 'Grullo',
            'Smoky Black': 'Grullo',
            'Bay': 'Bay Dun',
            'Wild Bay': 'Wild Bay Dun',
            'Seal Bay': 'Seal Bay Dun',
            'Buckskin': 'Dunskin',
            'Wild Buckskin': 'Wild Dunskin',
            'Seal Buckskin': 'Seal Dunskin',
            'Classic Champagne': 'Classic Champagne Dun',
            'Gold Champagne': 'Gold Champagne Dun',
            'Amber Champagne': 'Amber Champagne Dun',
            'Sable Champagne': 'Sable Champagne Dun'
        };

        if (dunEffects[baseColor]) {
            result.color = dunEffects[baseColor];
            result.genotypes.push(dun);
        } else {
            // For any undefined combinations, append "Dun"
            result.color = `${baseColor} Dun`;
            result.genotypes.push(dun);
        }

        return result;
    }

    applySilver(phenotype, silver) {
        if (!silver || silver === 'n/n') return phenotype;

        const result = { ...phenotype };
        const baseColor = result.color;

        // Silver only affects black-based colors
        const redBasedColors = [
            'Red', 'Palomino', 'Cremello', 'Gold Champagne',
            'Red Dun', 'Dunalino', 'Gold Champagne Dun'
        ];

        if (!redBasedColors.includes(baseColor)) {
            result.color = `Silver ${baseColor}`;
            result.genotypes.push(silver);
        }

        return result;

        // Apply patterns 
    applyPatterns(phenotype, patterns) {
        // Check for lethal white first (homozygous overo)
        if (patterns.overo === 'Olw/Olw') {
            return {
                color: 'Lethal White (Non-Viable)',
                genotypes: [...phenotype.genotypes, patterns.overo]
            };
        }

        let result = { ...phenotype };
        let patternNames = [];

        // Apply patterns in specific order for consistent naming
        result = this.applyTobiano(result, patterns.tobiano, patternNames);
        result = this.applyOvero(result, patterns.overo, patternNames);
        result = this.applyRoan(result, patterns.roan, patternNames);

        // Combine pattern names with base color
        if (patternNames.length > 0) {
            result.color = `${patternNames.join(' ')} ${result.color}`;
        }

        return result;
    }

    applyTobiano(phenotype, tobiano, patternNames) {
        if (!tobiano || tobiano === 'n/n') return phenotype;

        const result = { ...phenotype };
        
        // Both homozygous and heterozygous produce the same phenotype
        if (tobiano === 'TO/TO' || tobiano === 'TO/n') {
            patternNames.push('Tobiano');
            result.genotypes.push(tobiano);
        }

        return result;
    }

    applyOvero(phenotype, overo, patternNames) {
        if (!overo || overo === 'n/n') return phenotype;

        const result = { ...phenotype };

        // Only heterozygous produces viable pattern
        if (overo === 'Olw/n') {
            patternNames.push('Overo');
            result.genotypes.push(overo);
        }

        return result;
    }

    applyRoan(phenotype, roan, patternNames) {
        if (!roan || roan === 'n/n') return phenotype;

        const result = { ...phenotype };
        
        // Both homozygous and heterozygous produce the same phenotype
        if (roan === 'RN/RN' || roan === 'RN/n') {
            patternNames.push('Roan');
            result.genotypes.push(roan);
        }

        // Special cases for combining with other patterns
        const baseColor = result.color;
        
        // If the horse is already tobiano or overo, the roan will still be visible
        // We don't need to modify the naming structure as the patterns are already
        // properly ordered in the main applyPatterns method

        return result;
    }

    // Placeholder for modifiers module
    applyModifiers(phenotype, modifiers) {
        // To be implemented
        return phenotype;
    }

    // Main calculation function
    calculate() {
        const parents = this.getParentGenotypes();
        const combinations = this.calculateGeneCombinations(parents);
        const results = new Map();

        // Generate all possible combinations
        this.generateCombinations(combinations, {}, results);

        return this.formatResults(results);
    }

    // Recursive function to generate all possible combinations
    generateCombinations(combinations, current, results, geneIndex = 0) {
        const genes = Object.keys(combinations);
        
        if (geneIndex === genes.length) {
            // Process this combination
            const phenotype = this.processGeneCombination(current);
            if (phenotype) {
                this.addToResults(results, phenotype);
            }
            return;
        }
        
        class HorseGeneticsCalculator {
    // ... (previous methods remain the same)

    applyModifiers(phenotype, modifiers) {
        let result = { ...phenotype };
        let modifierNames = [];

        // Apply modifiers in specific order
        result = this.applyFlaxen(result, modifiers.flaxen, modifierNames);
        result = this.applySooty(result, modifiers.sooty, modifierNames);
        result = this.applyPangare(result, modifiers.pangare, modifierNames);

        // Add modifier names to color description
        if (modifierNames.length > 0) {
            result.color = `${modifierNames.join(' ')} ${result.color}`;
        }

        return result;
    }

    applyFlaxen(phenotype, flaxen, modifierNames) {
        if (!flaxen || flaxen !== 'f/f') return phenotype;

        const result = { ...phenotype };
        
        // Flaxen only affects red-based colors
        const redBasedColors = [
            'Red',
            'Palomino',
            'Red Dun',
            'Dunalino',
            'Gold Champagne'
        ];

        // Check if the base color or any of its dilute versions are red-based
        const isRedBased = redBasedColors.some(color => 
            result.color.includes(color) || 
            result.color.startsWith(color)
        );

        if (isRedBased) {
            modifierNames.push('Flaxen');
            result.genotypes.push(flaxen);
        }

        return result;
    }

    applySooty(phenotype, sooty, modifierNames) {
        if (!sooty || sooty === 'n/n') return phenotype;

        const result = { ...phenotype };
        
        // Sooty can affect any color, but might be less visible on some
        // Both STY/STY and STY/n produce the sooty effect
        if (sooty === 'STY/STY' || sooty === 'STY/n') {
            modifierNames.push('Sooty');
            result.genotypes.push(sooty);
        }

        // Special cases where sooty might be less visible
        const lessVisibleOn = [
            'Black',
            'Seal Bay',
            'Classic Champagne',
            'Smoky Black',
            'Grullo'
        ];

        // If color is in lessVisibleOn list, could add a note in future implementations
        // For now, we still show it in the genotype but it won't affect the phenotype much

        return result;
    }

    applyPangare(phenotype, pangare, modifierNames) {
        if (!pangare || pangare === 'n/n') return phenotype;

        const result = { ...phenotype };
        
        // Pangare affects any color but is most visible on darker colors
        // Both PG/PG and PG/n produce the pangare effect
        if (pangare === 'PG/PG' || pangare === 'PG/n') {
            modifierNames.push('Pangare');
            result.genotypes.push(pangare);

            // Special cases where pangare is most visible
            const mostVisibleOn = [
                'Black',
                'Seal Bay',
                'Bay',
                'Wild Bay',
                'Liver Chestnut',
                'Dark Bay'
            ];

            // Could add special handling for high-visibility cases in future implementations
        }

        return result;
    }

    // Helper method to determine the base color without modifiers
    getBaseColorWithoutModifiers(color) {
        // Remove known modifier prefixes
        return color
            .replace(/Flaxen\s+/, '')
            .replace(/Sooty\s+/, '')
            .replace(/Pangare\s+/, '');
    }

    // Helper method to check if a color is affected by a specific modifier
    hasModifier(color, modifierName) {
        return color.toLowerCase().includes(modifierName.toLowerCase());
    }

    // Helper method to determine modifier visibility
    getModifierVisibility(baseColor) {
        return {
            flaxen: this.isRedBased(baseColor),
            sooty: !this.isDarkColor(baseColor),
            pangare: this.isDarkColor(baseColor)
        };
    }

    // Helper methods for color characteristics
    isRedBased(color) {
        const redBasedColors = [
            'Red',
            'Palomino',
            'Cremello',
            'Gold Champagne',
            'Red Dun',
            'Dunalino'
        ];
        return redBasedColors.some(base => color.includes(base));
    }

    isDarkColor(color) {
        const darkColors = [
            'Black',
            'Seal Bay',
            'Bay',
            'Wild Bay',
            'Liver',
            'Dark Bay',
            'Classic Champagne',
            'Smoky Black',
            'Grullo'
        ];
        return darkColors.some(base => color.includes(base));
    }
}

        const currentGene = genes[geneIndex];
        const alleles = combinations[currentGene] || [null];

        alleles.forEach(allele => {
            current[currentGene] = allele;
            this.generateCombinations(combinations, current, results, geneIndex + 1);
        });
    }

    // Add a phenotype to the results map
    addToResults(results, phenotype) {
        const key = phenotype.color;
        if (!results.has(key)) {
            results.set(key, {
                phenotype: key,
                genotypes: new Set(),
                count: 0
            });
        }

        const entry = results.get(key);
        phenotype.genotypes.forEach(genotype => entry.genotypes.add(genotype));
        entry.count++;
    }

    // Format results for display
    formatResults(results) {
        const totalCombinations = Array.from(results.values())
            .reduce((sum, result) => sum + result.count, 0);

        return Array.from(results.values()).map(result => ({
            ...result,
            percentage: ((result.count / totalCombinations) * 100).toFixed(1),
            genotypes: Array.from(result.genotypes)
        }));
    }
}

// Initialize calculator and set up event listener
const calculator = new HorseGeneticsCalculator();

function calculateGenetics() {
    const results = calculator.calculate();
    displayResults(results);
}

// Display results in the UI
function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    results
        .sort((a, b) => b.percentage - a.percentage)
        .forEach(result => {
            const phenotypeGroup = document.createElement('div');
            phenotypeGroup.className = 'phenotype-group';

            const header = document.createElement('div');
            header.className = 'phenotype-header';
            header.innerHTML = `
                ${result.phenotype} - ${result.percentage}%
                <i class="fas fa-chevron-down"></i>
            `;

            const genotypeList = document.createElement('div');
            genotypeList.className = 'genotype-list';
            genotypeList.innerHTML = result.genotypes.join('<br>');

            header.addEventListener('click', () => {
                genotypeList.classList.toggle('active');
                header.querySelector('i').classList.toggle('fa-chevron-up');
                header.querySelector('i').classList.toggle('fa-chevron-down');
            });

            phenotypeGroup.appendChild(header);
            phenotypeGroup.appendChild(genotypeList);
            resultsDiv.appendChild(phenotypeGroup);
        });
}
