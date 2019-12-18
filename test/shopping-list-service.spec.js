const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`shopping_list service object`, function() {
    let db
    let testItems = [
        {
            id: 1,
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            name: 'tuna',
            price: 4.99,
            category: 'Main'
        },
        {
            id: 2,
            date_added: new Date('2029-03-22T16:28:32.615Z'),
            name: 'cereal',
            price: 3.99,
            category: 'Breakfast'
        },
        {
            id: 3,
            date_added: new Date('2029-02-22T16:28:32.615Z'),
            name: 'cheese sticks',
            price: 6.99,
            category: 'Snack'
        }
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })
    
    before(() => db('shopping_list').truncate())
    
    afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy())

    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
          return db
            .into('shopping_list')
            .insert(testItems)
          })
  
          it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
              return ShoppingListService.getAllItems(db)
              .then(actual => {
                  expect(actual).to.eql(testItems.map(item => ({
                  ...item,
                  date_added: new Date(item.date_added)
                  })))
              })
          })
  
          it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
              const newItem = {
                  name: 'Test new name',
                  price: 4.99,
                  date_added: new Date('2020-01-01T00:00:00.000Z'),
                  category: 'Main'
              }
              return ShoppingListService.insertItem(db, newItem)
                  .then(actual => {
                      expect(actual).to.eql({
                        id: 1,
                        name: newItem.name,
                        price: newItem.price,
                        date_added: newItem.date_published,
                        category: newItem.categroy
                      })
                  })
          })
  
          it(`getById() resolves an item by id from 'shopping_list' table`, () => {
              const thirdId = 3
              const thirdTestItem = testItems[thirdId - 1]
              return ShoppingListService.getById(db, thirdId)
                .then(actual => {
                  expect(actual).to.eql({
                    id: thirdId,
                    name: thirdTestItem.name,
                    price: thirdTestItem.price,
                    date_added: thirdTestItem.date_published,
                    category: thirdTestItem.categroy,
                    checked: false
                  })
                })
          })
  
          it(`deleteItem() removes an Item by id from 'shopping_list' table`, () => {
              const itemId = 3
              return ShoppingListService.deleteItem(db, itemId)
                  .then(() => ShoppingListService.getAllItems(db))
                  .then(allItems => {
                          // copy the test articles array without the "deleted" article
                          const expected = testItems.filter(item => item.id !== itemId)
                          expect(allItems).to.eql(expected)
                  })
          })
  
          it(`updateItem() updates an Item from the 'shopping_list' table`, () => {
              const idOfItemToUpdate = 3
              const newItemData = {
                name: 'updated name',
                price: 'updated price',
                date_added: new Date(),
                category: 'updated category'
              }
              return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                .then(item => {
                  expect(item).to.eql({
                    id: idOfItemToUpdate,
                    ...newItemData,
                  })
              })
          })
      })
  
      context(`Given 'shopping_list' has no data`, () => {
          it(`getAllItems() resolves an empty array`, () => {
              return ShoppingListService.getAllItems(db)
                  .then(actual => {
                  expect(actual).to.eql([])
              })
          })
      })

})