async function CacheResponse(response, saveFunc) {
    return new Promise(async (resolve, reject) => {
        let request = response.request()
        let status = response.status()

        if (status >= 300 && status < 400) {
            return resolve(false)
        }

        const cacheControlHeader = response.headers()['cache-control'];
        if (!cacheControlHeader) {
            return resolve(false)
        }

        let controlData = cacheControlHeader.split(",")
        let type = controlData[0].toLowerCase()
        if (controlData.includes("no-store")) {
            return resolve(false)
        }

        if (controlData.includes("no-store")) {
            return resolve(false)
        }

        if (type == "no-cache") {
            return resolve(false)
        }

        if (controlData.length == 1) {
            type = "public"
            controlData[1] = controlData[0]
        }

        let age = parseInt(controlData[1].split("=")[1])
        let expires = new Date(Date.now() + age * 1000)

        if (!age) {
            return resolve(false)
        }

        try {
            let headers = await response.allHeaders()
            delete headers["cookie"]

            saveFunc(await response.url(), type, expires, {
                method: request.method(),
                body: await response.body(),
                headers,
                status,
            })
        } catch (err) {

        }
    })
}

function SearchCache(route, searchFunc) {
    return new Promise(async (resolve, reject) => {
        let request = route.request()
        /*let headers = await request.allHeaders()
        
        if(headers["cache-control"]){
            console.log(1, headers)
        }*/

        searchFunc(request.url()).then((Data) => {
            if (Data) {
                route.fullfill(Data)
                resolve(true)
            } else {
                resolve(false)
            }
        }).catch((err) => {
            resolve(false)
        })
    })
}

export { CacheResponse, SearchCache }