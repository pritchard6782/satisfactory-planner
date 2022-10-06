const switchToMapTabButton = $('#switchToMapTabButton')
const switchToFactoryTabButton = $('#switchToFactoryTabButton')
const mapTab = $('#mapTab')
const factoryTab = $('#factoryTab')

window.switchToMapTab = () => {
    mapTab.show()
    factoryTab.hide()
    window.updateMapSidebar()
}
window.switchToFactoryTab = () => {
    mapTab.hide()
    factoryTab.show()
}

switchToMapTabButton.click(window.switchToMapTab)
switchToFactoryTabButton.click(window.switchToFactoryTab)