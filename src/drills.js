require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
})

function searchItemByName(name) {
    knexInstance    
        .select('*')
        .from('shopping_list')
        .where('name', 'ILIKE', `%S{searchTerm}%`)
        .then(result => {
            console.log('SEARCH TERM', {searchTerm})
            console.log(result)
        })
}

searchItemByName('turn')

function paginateList(page) {
    const itemPerPage = 6
    const offset = limit * (page - 1)
    knexInstance 
        .select('*')
        .from('shopping_list')
        .limit(itemPerPage)
        .offset(offset)
        .then(result => {
            console.log('PAGINATE ITEMS', { page })
            console.log(result)
        })
}

paginateList(2)

function productsAddedDaysAgo(daysAgo) {
    knexInstance
        .select('id', 'name', 'price', 'date_added', 'checked', 'category')
        .from('shopping_list')
        .where(
            'date_added',
            '>',
            knexInstance.raw(`now() - '?? days':: INTERVAL`, daysAgo)
        )
        .then(results => {
        console.log('PRODUCTS ADDED DAYS AGO')
        console.log(results)
    })
}

productsAddedDaysAgo(4)

function costPerCategory() {
    knexInstance
        .select('category')
        .sum('price as total')
        .from('shopping_list')
        .groupBy('category')
        .then(result => {
        console.log('COST PER CATEGORY')
        console.log(result)
    })
}

costPerCategory()