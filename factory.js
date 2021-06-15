function main() {
    const factoryBodyDiv = $('#factoryBody')
    const newBlockButton = $('#newFactoryBlockButton')
    const resourceIcons = {}
    
    for (const tab of window.mapData.options) {
        for (const resourceGroup of tab.options) {
            resourceIcons[resourceGroup.type] =  resourceGroup.options[0].icon
        }
    }
    
    const factoryBlockTemplate = initFactoryBlock()
    
    const factoryData = {
        inputs: {},
        outputs: {},
        blocks: [{
            x: 300,
            y: 100,
            recipe: "Recipe_IngotSteel_C",
            amount: 2
        }]
    }
    
    for (const block of factoryData.blocks) {
        generateFactoryBlock(block, factoryData, factoryBlockTemplate, factoryBodyDiv)
    }

    updateInputOutputs(factoryData)

    newBlockButton.click(generateNewFactoryBlock(factoryData, factoryBlockTemplate, factoryBodyDiv))
}

///////////

function updateInputOutputs(factoryData) {
    const calcInputs = {}
    const calcOutputs = {}
    for (const blockData of factoryData.blocks) {
        for (const recipeCode in blockData.inputs) {
            calcInputs[recipeCode] = blockData.inputs[recipeCode] + (calcInputs[recipeCode] || 0)
        }
        for (const recipeCode in blockData.outputs) {
            calcOutputs[recipeCode] = blockData.outputs[recipeCode] + (calcOutputs[recipeCode] || 0)
        }
    }

    factoryData.inputs = calcInputs
    factoryData.outputs = calcOutputs

    console.log(factoryData)
}

///////////

function generateNewFactoryBlock(factoryData, factoryBlockTemplate, factoryBodyDiv) {
    return function() {
        const newBlock = {
            x: 100,
            y: 100,
            recipe: "Recipe_AILimiter_C",
            amount: 0
        }

        factoryData.blocks.push(newBlock)
        generateFactoryBlock(newBlock, factoryData, factoryBlockTemplate, factoryBodyDiv)
    }
}

///////////

function generateFactoryBlock(blockData, factoryData, factoryBlockTemplate, factoryBodyDiv) {
    const factoryBlockDiv = factoryBlockTemplate.clone()
        .css({ left: blockData.x, top: blockData.y })
        .draggable({ containment: factoryBodyDiv })
    factoryBodyDiv.append(factoryBlockDiv)

    const amountInput = factoryBlockDiv.find('[data-factory-block-amount]').val(blockData.amount)
    const recipeSelect = factoryBlockDiv.find('[data-factory-block-recipe-select]').val(blockData.recipe)
    
    amountInput.change(updateFactoryBlockItems(blockData, factoryData, factoryBlockDiv, recipeSelect, amountInput))
    recipeSelect.change(updateFactoryBlockItems(blockData, factoryData, factoryBlockDiv, recipeSelect, amountInput)).change()
}

///////////

function updateFactoryBlockItems(blockData, factoryData, factoryBlockDiv, recipeSelect, amountInput) {
    return function() {
        blockData.recipe = recipeSelect.val()
        blockData.amount = amountInput.val()

        const recipe = window.itemData.recipes[blockData.recipe]
        const amount = blockData.amount

        const inputsBlock = factoryBlockDiv.find('[data-factory-block-items-inputs]')
        const ingredientRows = inputsBlock.find('div')
        const inputs = {}
    
        for (let i in recipe.ingredients) {
            const ingredient = recipe.ingredients[i]
            let row = ingredientRows[i]
            if (!row) {
                row = $('<div><span></span><span></span></div>').appendTo(inputsBlock)
            }
            const spans = $(row).find('span')
            $(spans[0]).text(window.itemData.items[ingredient.item].name)

            const ingredientAmount = (ingredient.amount * 60 * amount) / recipe.time
            $(spans[1]).text(ingredientAmount)
            inputs[ingredient.item] = ingredientAmount
        }

        for (let i = recipe.ingredients.length; i < ingredientRows.length; i++) {
            $(ingredientRows[i]).remove()
        }

        blockData.inputs = inputs
        
        const outputsBlock = factoryBlockDiv.find('[data-factory-block-items-outputs]')
        const productRows = outputsBlock.find('div')
        const outputs = {}

        for (let i in recipe.products) {
            const product = recipe.products[i]
            let row = productRows[i]
            if (!row) {
                row = $('<div><span></span><span></span></div>').appendTo(outputsBlock)
            }
            const spans = $(row).find('span')
            $(spans[0]).text(window.itemData.items[product.item].name)

            const productAmount = (product.amount * 60 * amount) / recipe.time
            $(spans[1]).text(productAmount)
            outputs[product.item] = productAmount
        }

        for (let i = recipe.products.length; i < productRows.length; i++) {
            $(productRows[i]).remove()
        }
        
        blockData.outputs = outputs

        updateInputOutputs(factoryData)
    }
}

///////////

// Detach factory block, populate dropdown
function initFactoryBlock() {

    const factoryBlock = $('[data-factory-block-container]').detach()

    const select = factoryBlock.find('[data-factory-block-recipe-select]')
    
    for (const recipeCode in window.itemData.recipes) {
        const recipe = window.itemData.recipes[recipeCode]
        if (recipe.inMachine) {
            const option = $('<option>').attr('value', recipeCode).text(recipe.name)
            select.append(option)
        }
    }

    return factoryBlock
}

main()