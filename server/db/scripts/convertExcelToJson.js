// switch to node 10 to install and run excel-as-json
// npm i excel-as-json
// rm -rf node_modules && npm i
const convertExcel = require('excel-as-json').processFile

convertExcel('../data/diti-seed-data.xlsx', '../data/diti-seed-data.json', null, (err, data) => {
    if (err) {
        throw(err)
    }
    
    console.log('Parsing complete')
})
