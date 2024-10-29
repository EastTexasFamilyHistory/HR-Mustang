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
        phenotype = this.applyDilutions(phenotype, {
            cream: genes.cream,
            champagne: genes.champagne,
            dun: genes.dun,
            silver: genes.silver
        });

        // Apply patterns (to be implemented)
        phenotype = this.applyPatterns(phenotype, {
            overo: genes.overo,
            tobiano: genes.tobiano,
            roan: genes.roan
        });

        // Apply modifiers (to be implemented)
        phenotype = this.applyModifiers(phenotype, {
            flaxen: genes.flaxen,
            sooty: genes.sooty,
            pangare: genes.pangare
        });

        return phenotype;
    }

    // Placeholder for dilutions module
    applyDilutions(phenotype, dilutions) {
        // To be implemented
        return phenotype;
    }

    // Placeholder for patterns module
    applyPatterns(phenotype, patterns) {
        // To be implemented
        return phenotype;
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
