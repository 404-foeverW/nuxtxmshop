const urls = ['/about', '/collect', '/shoppingCart'];

export default defineSitemapEventHandler(() => {
    return urls.map(item => {
        return {
            loc: item,
            lastmod: new Date().toISOString(),
            changefreq: 'weekly',
            priority: 0.8,
            _sitemap: "pages"
        }
    })
}) 