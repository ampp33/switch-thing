function switchNameToSlug(switchName) {
    return switchName.toLowerCase().replaceAll(" ", "-")
}

export {
    switchNameToSlug
}