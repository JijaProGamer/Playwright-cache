import { CacheResponse, SearchCache } from "./index.js";
import { firefox } from 'playwright';

let memoryCache = {}

function findInCache(URL){
    return new Promise((resolve, reject) => {
        let CachedResponse = memoryCache[URL]
        if(Date.now() >= CachedResponse.expires){
            delete memoryCache[URL];
            return resolve(false)
        }

        resolve(CachedResponse.Data)
    })
}

function SaveInCache(URL, type, expires, Data){
    return new Promise((resolve, reject) => {
        memoryCache[URL] = {expires, Data}
    })
}

(async () => {
    const browser = await firefox.launch({headless: false});
    const page = await browser.newPage({serviceWorkers: "block"});
  
    page.route('**', async (route) => {
      if(!(await SearchCache(route, findInCache))){
        route.continue()
      }
    });
  
    page.on('response', (response) => {
        CacheResponse(response, SaveInCache)
    });
  
    // Navigate to a website that makes a request to the intercepted URL
    await page.goto('https://youtube.com');
  
    // Wait for a while to see the intercepted response and logs
    //await page.waitForTimeout(5000);
  
    //await browser.close();
  })();