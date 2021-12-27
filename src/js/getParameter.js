export default (parameterName) => {
    let parameters = new URLSearchParams(window.location.search)
    return parameters.get(parameterName) // Returns null if the query string is empty or the parameter is not found.
}