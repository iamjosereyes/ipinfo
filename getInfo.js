/*
NodeJS: 
- Retrieve your IP Address, Service Provider information and information about the zip code
date: 7/19/23
github: iamjosereys
email: jf.reyes925@gmail.com
*/

const axios = require('axios')
const fs = require('fs')

go()
async function go() {
    const ipAddress = await retrieveIpAddress()    
    const ipInformation = await retrieveIpInformation(ipAddress.data.ip)        
    const searchZipCode = await zipCodeInfo(ipInformation.data.postal)  

    console.log(" ")
    console.log("Your IP Address Information")
    console.table(ipInformation.data)
    console.log(" ")

    console.log(`Data related to zip code: ${ipInformation.data.postal}`)
    console.table(searchZipCode.data.places)
    
    // save IP Address and zip code response to file.    
    await saveResponseToFile(ipAddress.data.ip, ipInformation.data)
    await saveResponseToFile(ipInformation.data.postal, searchZipCode.data)
    console.log("Payload responses have been saved in the ./files folder.")
}

async function retrieveIpAddress() {
    return axios.get('https://api.ipify.org?format=json')
}

async function retrieveIpInformation(ipAddress) {
    return await axios.get(`https://ipinfo.io/${ipAddress}/geo`)
}

async function zipCodeInfo(zipCode) {
    return await axios.get(`https://api.zippopotam.us/us/${zipCode}`)
}

async function saveResponseToFile(query, dataSet) {
    const save = fs.createWriteStream(`./files/${query}.json`)
    save.write(JSON.stringify(dataSet))
    save.end()
}
