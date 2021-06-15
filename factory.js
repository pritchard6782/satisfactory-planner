function main() {
    const factoryDiv = $('#factoryBlock')
    const resourceIcons = {}
    
    for (const tab of window.mapData.options) {
        for (const resourceGroup of tab.options) {
            resourceIcons[resourceGroup.type] =  resourceGroup.options[0].icon
        }
    }
    
    const factoryBlockTemplate = initFactoryBlock()
    
    console.log(resourceIcons)
    
    const factory = {
        inputs: [],
        outputs: [],
        blocks: [{
            x: 100,
            y: 100,
            recipe: "Recipe_IngotSteel_C",
            amount: 2
        }]
    }
    
    for (const block of factory.blocks) {
        generateFactoryBlock(block, factoryBlockTemplate, factoryDiv)
    }
}

///////////

function generateFactoryBlock(blockData, factoryBlockTemplate, factoryDiv) {
    const factoryBlockDiv = factoryBlockTemplate.clone()
        .css({ left: blockData.x, top: blockData.y })
        .draggable()
    factoryDiv.append(factoryBlockDiv)

    const amountInput = factoryBlockDiv.find('[data-factory-block-amount]').val(blockData.amount)
    const recipeSelect = factoryBlockDiv.find('[data-factory-block-recipe-select]').val(blockData.recipe)
    
    amountInput.change(updateFactoryBlockItems(factoryBlockDiv, recipeSelect, amountInput))
    recipeSelect.change(updateFactoryBlockItems(factoryBlockDiv, recipeSelect, amountInput)).change()
}

///////////

function updateFactoryBlockItems(factoryBlockDiv, recipeSelect, amountInput) {
    return function() {
        const recipe = window.itemData.recipes[recipeSelect.val()]
        const amount = amountInput.val()

        console.log(recipe)

        const inputsBlock = factoryBlockDiv.find('[data-factory-block-items-inputs]')
        const ingredientRows = inputsBlock.find('div')
    
        for (let i in recipe.ingredients) {
            const ingredient = recipe.ingredients[i]
            let row = ingredientRows[i]
            if (!row) {
                row = $('<div><span></span><span></span></div>').appendTo(inputsBlock)
            }
            const spans = $(row).find('span')
            $(spans[0]).text(window.itemData.items[ingredient.item].name)
            $(spans[1]).text((ingredient.amount * 60 * amount) / recipe.time)
        }

        for (let i = recipe.ingredients.length; i < ingredientRows.length; i++) {
            $(ingredientRows[i]).remove()
        }
        
        const outputsBlock = factoryBlockDiv.find('[data-factory-block-items-outputs]')
        const productRows = outputsBlock.find('div')

        for (let i in recipe.products) {
            const product = recipe.products[i]
            let row = productRows[i]
            if (!row) {
                row = $('<div><span></span><span></span></div>').appendTo(outputsBlock)
            }
            const spans = $(row).find('span')
            $(spans[0]).text(window.itemData.items[product.item].name)
            $(spans[1]).text((product.amount * 60 * amount) / recipe.time)
        }

        for (let i = recipe.products.length; i < productRows.length; i++) {
            $(productRows[i]).remove()
        }
    }
}

///////////

function updateFactoryBlockRecipe() {
    
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