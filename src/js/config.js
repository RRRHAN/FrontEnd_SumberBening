const host = process.env.REACT_APP_BACK_END_HOST || "localhost",
    port = process.env.REACT_APP_BACK_END_PORT || 7070,
    domain = `${host}:${port}`,
    base_url = `http://${domain}`,
    router = 'hashRouter'
export { base_url, router }