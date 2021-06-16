function init() {
    const factoryBodyDiv = $('#factoryBody')
    const factoryInputsOutputs = $('#factoryInputsOutputs')
    const newBlockButton = $('#newFactoryBlockButton')
    const resourceIcons = {}
    
    for (const tab of window.mapData.options) {
        for (const resourceGroup of tab.options) {
            resourceIcons[resourceGroup.type] =  resourceGroup.options[0].icon
        }
    }
    
    const factoryBlockTemplate = initFactoryBlock()
    
    window.buildFactory = function(factoryData) {
        for (const block of factoryData.blocks) {
            generateFactoryBlock(block, factoryData, factoryBlockTemplate, factoryBodyDiv, factoryInputsOutputs)
        }
    
        updateInputOutputs(factoryData)
    
        newBlockButton.click(generateNewFactoryBlock(factoryData, factoryBlockTemplate, factoryBodyDiv, factoryInputsOutputs))
    }
}

///////////

function updateInputOutputs(factoryData) {
    const itemAmounts = {}
    for (const blockData of factoryData.blocks) {
        for (const recipeCode in blockData.inputs) {
            itemAmounts[recipeCode] = (itemAmounts[recipeCode] || 0) + blockData.inputs[recipeCode]
        }
        for (const recipeCode in blockData.outputs) {
            itemAmounts[recipeCode] = (itemAmounts[recipeCode] || 0) - blockData.outputs[recipeCode]
        }
    }

    const calcInputs = {}
    const calcOutputs = {}

    for (const recipeCode in itemAmounts) {
        if (itemAmounts[recipeCode] > 0.05) {
            calcInputs[recipeCode] = itemAmounts[recipeCode]
        }
        else if (itemAmounts[recipeCode] < -0.05) {
            calcOutputs[recipeCode] = -itemAmounts[recipeCode]
        }
    }

    factoryData.inputs = calcInputs
    factoryData.outputs = calcOutputs

    console.log(factoryData)
}

///////////

function generateNewFactoryBlock(factoryData, factoryBlockTemplate, factoryBodyDiv, factoryInputsOutputs) {
    return function() {
        const newBlock = {
            x: 100,
            y: 100,
            recipe: "Recipe_AILimiter_C",
            amount: 0
        }

        factoryData.blocks.push(newBlock)
        generateFactoryBlock(newBlock, factoryData, factoryBlockTemplate, factoryBodyDiv, factoryInputsOutputs)
    }
}

///////////

function generateFactoryBlock(blockData, factoryData, factoryBlockTemplate, factoryBodyDiv, factoryInputsOutputs) {
    const factoryBlockDiv = factoryBlockTemplate.clone()
        .css({ left: blockData.x, top: blockData.y })
    factoryBlockDiv.draggable({ containment: factoryBodyDiv, stop: updateFactoryBlockLocation(blockData, factoryBlockDiv) })
    factoryBodyDiv.append(factoryBlockDiv)

    const amountInput = factoryBlockDiv.find('[data-factory-block-amount]').val(blockData.amount)
    const recipeSelect = factoryBlockDiv.find('[data-factory-block-recipe-select]').val(blockData.recipe)
    
    amountInput.change(updateFactoryBlockItems(blockData, factoryData, factoryBlockDiv, factoryInputsOutputs, recipeSelect, amountInput))
    recipeSelect.change(updateFactoryBlockItems(blockData, factoryData, factoryBlockDiv, factoryInputsOutputs, recipeSelect, amountInput)).change()
}

///////////

function updateFactoryBlockItems(blockData, factoryData, factoryBlockDiv, factoryInputsOutputs, recipeSelect, amountInput) {
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
        updateMainInputsOutputs(factoryData, factoryInputsOutputs)
    }
}

///////////

function updateMainInputsOutputs(factoryData, factoryInputsOutputs) {
    
    const inputsBlock = factoryInputsOutputs.find('[data-factory-io-items-inputs]')
    const ingredientRows = inputsBlock.find('div')

    let i = 0;
    for (let ingredientCode in factoryData.inputs) {
        let row = ingredientRows[i]
        if (!row) {
            row = $('<div><span></span><span></span></div>').appendTo(inputsBlock)
        }
        const spans = $(row).find('span')
        $(spans[0]).text(window.itemData.items[ingredientCode].name)
        $(spans[1]).text(factoryData.inputs[ingredientCode])

        i++
    }

    for (; i < ingredientRows.length; i++) {
        $(ingredientRows[i]).remove()
    }
    
    const outputsBlock = factoryInputsOutputs.find('[data-factory-io-items-outputs]')
    const productRows = outputsBlock.find('div')

    i = 0;
    for (let ingredientCode in factoryData.outputs) {
        let row = productRows[i]
        if (!row) {
            row = $('<div><span></span><span></span></div>').appendTo(outputsBlock)
        }
        const spans = $(row).find('span')
        $(spans[0]).text(window.itemData.items[ingredientCode].name)
        $(spans[1]).text(factoryData.outputs[ingredientCode])

        i++
    }

    for (; i < productRows.length; i++) {
        $(productRows[i]).remove()
    }
}

///////////

function updateFactoryBlockLocation(blockData, factoryBlockDiv) {
    return function() {
        blockData.x = factoryBlockDiv.css('left')
        blockData.y = factoryBlockDiv.css('top')
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

init()