function init() {
    const factoryBodyDiv = $('#factoryBody')
    const factoryInputsOutputs = $('#factoryInputsOutputs')
    const newBlockButton = $('#newFactoryBlockButton')
    const deleteBlockButton = $('#deleteFactoryBlockButton')
    const resourceIcons = {}

    for (const tab of window.mapData.options) {
        for (const resourceGroup of tab.options) {
            resourceIcons[resourceGroup.type] = resourceGroup.options[0].icon
        }
    }

    const factoryBlockTemplate = initFactoryBlock()

    window.buildFactory = function (allFactoriesData, factoryData) {
        console.log(allFactoriesData, factoryData)
        factoryBodyDiv.empty()
        for (const factoryBlockData of factoryData.blocks) {
            generateFactoryBlock(allFactoriesData, factoryData, factoryBlockData, factoryBlockTemplate, factoryBodyDiv, factoryInputsOutputs)
        }

        updateInputOutputs(allFactoriesData, factoryData)

        newBlockButton.off('click').click(generateNewFactoryBlock(allFactoriesData, factoryData, factoryBlockTemplate, factoryBodyDiv, factoryInputsOutputs))

        window.switchToFactoryTab()
    }
}

///////////

function updateInputOutputs(allFactoriesData, factoryData) {
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
        if (itemAmounts[recipeCode] > 0.5) {
            calcInputs[recipeCode] = itemAmounts[recipeCode]
        }
        else if (itemAmounts[recipeCode] < -0.5) {
            calcOutputs[recipeCode] = -itemAmounts[recipeCode]
        }
    }

    factoryData.inputs = calcInputs
    factoryData.outputs = calcOutputs

    localStorage.setItem('allFactoriesData', JSON.stringify(allFactoriesData))
}

///////////

function generateNewFactoryBlock(allFactoriesData, factoryData, factoryBlockTemplate, factoryBodyDiv, factoryInputsOutputs) {
    return function () {
        const factoryBlockData = {
            x: 100,
            y: 165 * (1 - factoryData.blocks.length),
            recipe: "Recipe_AILimiter_C",
            amount: 0
        }

        factoryData.blocks.push(factoryBlockData)
        generateFactoryBlock(allFactoriesData, factoryData, factoryBlockData, factoryBlockTemplate, factoryBodyDiv, factoryInputsOutputs)
    }
}

///////////

function generateFactoryBlock(allFactoriesData, factoryData, factoryBlockData, factoryBlockTemplate, factoryBodyDiv, factoryInputsOutputs) {
    const factoryBlockDiv = factoryBlockTemplate.clone()
        .css({ left: factoryBlockData.x, top: factoryBlockData.y })
    factoryBlockDiv.draggable({
        containment: factoryBodyDiv,
        stop: updateFactoryBlockLocation(allFactoriesData, factoryBlockData, factoryBlockDiv),
        grid: [10, 10]
    })
    factoryBodyDiv.append(factoryBlockDiv)

    const amountInput = factoryBlockDiv.find('[data-factory-block-amount]').val(factoryBlockData.amount)
    const recipeSelect = factoryBlockDiv.find('[data-factory-block-recipe-select]').val(factoryBlockData.recipe)

    factoryBlockDiv.find('[data-delete-factory-block-btn]').click(deleteFactoryBlock(allFactoriesData, factoryData, factoryBlockData, factoryBlockDiv))
    amountInput.on('keyup', updateFactoryBlockItems(allFactoriesData, factoryData, factoryBlockData, factoryBlockDiv, factoryInputsOutputs, recipeSelect, amountInput))
    recipeSelect.change(updateFactoryBlockItems(allFactoriesData, factoryData, factoryBlockData, factoryBlockDiv, factoryInputsOutputs, recipeSelect, amountInput)).change()
}

///////////

function updateFactoryBlockItems(allFactoriesData, factoryData, factoryBlockData, factoryBlockDiv, factoryInputsOutputs, recipeSelect, amountInput) {
    return function () {
        factoryBlockData.recipe = recipeSelect.val()
        factoryBlockData.amount = amountInput.val()

        const recipe = window.itemData.recipes[factoryBlockData.recipe]
        const amount = factoryBlockData.amount

        const inputsBlock = factoryBlockDiv.find('[data-factory-block-items-inputs]')
        const ingredientRows = inputsBlock.find('div')
        const inputs = {}

        for (let i in recipe.ingredients) {
            const ingredient = recipe.ingredients[i]
            let row = ingredientRows[i]
            if (!row) {
                row = $('<div><span></span><span><input type="text" /></span></div>').appendTo(inputsBlock)
            }
            const spans = $(row).find('span')
            const input = $(spans[1]).find('input')
            $(spans[0]).text(window.itemData.items[ingredient.item].name)

            const ingredientAmount = (ingredient.amount * 60 * amount) / recipe.time
            input.val(ingredientAmount.toFixed(1))
            input.change(inputOutputValueChanged(factoryBlockDiv, recipe.time, ingredient.amount))
            inputs[ingredient.item] = ingredientAmount


        }

        for (let i = recipe.ingredients.length; i < ingredientRows.length; i++) {
            $(ingredientRows[i]).remove()
        }

        factoryBlockData.inputs = inputs

        const outputsBlock = factoryBlockDiv.find('[data-factory-block-items-outputs]')
        const productRows = outputsBlock.find('div')
        const outputs = {}

        for (let i in recipe.products) {
            const product = recipe.products[i]
            let row = productRows[i]
            if (!row) {
                row = $('<div><span></span><span><input type="text" /></span></div>').appendTo(outputsBlock)
            }
            const spans = $(row).find('span')
            const input = $(spans[1]).find('input')
            $(spans[0]).text(window.itemData.items[product.item].name)

            const productAmount = (product.amount * 60 * amount) / recipe.time
            input.val(productAmount.toFixed(1))
            input.change(inputOutputValueChanged(factoryBlockDiv, recipe.time, product.amount))
            outputs[product.item] = productAmount
        }

        for (let i = recipe.products.length; i < productRows.length; i++) {
            $(productRows[i]).remove()
        }

        factoryBlockData.outputs = outputs

        updateInputOutputs(allFactoriesData, factoryData)
        updateMainInputsOutputs(allFactoriesData, factoryData, factoryInputsOutputs)
    }
}

///////////

function inputOutputValueChanged(factoryBlockDiv, recipeTime, ingredientAmount) {
    return function (e) {
        const newNumMachines = (e.target.value * recipeTime) / (ingredientAmount * 60)
        factoryBlockDiv.find('[data-factory-block-amount]').val(newNumMachines).trigger('keyup')
    }
}

///////////

function updateMainInputsOutputs(allFactoriesData, factoryData, factoryInputsOutputs) {

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
        $(spans[1]).text(factoryData.inputs[ingredientCode].toFixed(1))

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
        $(spans[1]).text(factoryData.outputs[ingredientCode].toFixed(1))

        i++
    }

    for (; i < productRows.length; i++) {
        $(productRows[i]).remove()
    }

    localStorage.setItem('allFactoriesData', JSON.stringify(allFactoriesData))
}

///////////

function updateFactoryBlockLocation(allFactoriesData, blockData, factoryBlockDiv) {
    return function () {
        blockData.x = factoryBlockDiv.css('left')
        blockData.y = factoryBlockDiv.css('top')

        localStorage.setItem('allFactoriesData', JSON.stringify(allFactoriesData))
    }
}

///////////

function deleteFactoryBlock(allFactoriesData, factoryData, factoryBlockData, factoryBlockDiv) {
    return function () {
        factoryData.blocks.splice(factoryData.blocks.indexOf(factoryBlockData), 1)
        factoryBlockDiv.remove()

        localStorage.setItem('allFactoriesData', JSON.stringify(allFactoriesData))
    }
}

///////////

// Detach factory block, populate dropdown
function initFactoryBlock() {

    const factoryBlock = $('[data-factory-block-container]').detach()

    const select = factoryBlock.find('[data-factory-block-recipe-select]')
    const recipeNameArray = []
    const recipeMap = {}

    for (const recipeCode in window.itemData.recipes) {
        const recipe = window.itemData.recipes[recipeCode]
        if (recipe.inMachine) {
            const recipeName = recipe.name.replace('Alternate', 'Alt')
            recipeNameArray.push(recipeName)
            recipeMap[recipeName] = recipeCode
        }
    }

    recipeNameArray.sort()

    for (const recipeName of recipeNameArray) {
        const option = $('<option>').attr('value', recipeMap[recipeName]).text(recipeName)
        select.append(option)
    }

    return factoryBlock
}

init()