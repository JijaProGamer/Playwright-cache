# playwright-cache

playwright-cache is a lightweight library for caching and serving cached responses in Playwright automation scripts. It allows you to improve the performance and efficiency of your web automation tasks by reducing redundant network requests.

## Installation

You can install playwright-cache using npm or yarn:

```bash
npm install playwright-cache
# or
yarn add playwright-cache
```

## Usage

Here's a basic example of how to use playwright-cache in your Playwright scripts:

```js
const { firefox } = require('playwright');
const { CacheResponse, SearchCache } = require('playwright-cache');

let memoryCache = {};

function findInCache(URL) {
    let CachedResponse = memoryCache[URL]
    if(!CachedResponse){
        return false;
    }

    if(Date.now() >= CachedResponse.expires){
        delete memoryCache[URL];
        return false
    }

    return CachedResponse.Data
}

function saveInCache(URL, type, expires, Data) {
    // type can be either "public" or "private"
    // If "public", You can fetch this cache for all of your launched browsers
    // If "private", You can fetch this cache only for this specific browser instance 

    memoryCache[URL] = {expires, Data}
}

(async () => {
    const browser = await firefox.launch({ headless: false });
    const page = await browser.newPage({ serviceWorkers: "block" });

    page.route('**', async (route) => {
        if (!(await SearchCache(route, findInCache))) {
            route.continue();
        }
    });

    page.on('response', (response) => {
        CacheResponse(response, saveInCache);
    });

    await page.goto('https://example.com');

    // Your code here...

    // Close the browser when done
    await browser.close();
})();

```
# API

* CacheResponse(response, saveFunc)

    This function is used to cache responses intercepted by Playwright. It takes the intercepted response and a save function as arguments and caches the response according to the Cache-Control headers.

    * response: The intercepted response object.
    * saveFunc: A function responsible for saving the response in your chosen cache storage.

* SearchCache(route, searchFunc)

    This function is used to search for cached data when a request is intercepted. It takes the intercepted route and a search function as arguments and attempts to retrieve cached data for the request.

    * route: The intercepted route object.
    * searchFunc: A function responsible for searching for data in your cache storage.