const express = require('express');
const nano = require('nano');
const couch = require('./../../db/couch')
const db = couch.use('library')

const router = express.Router();

// Read all doc in users with view
router.get('/booklist', async (req, res) => {
    
    try {
        // const boolList = await db.list({include_docs: true})

        const booklist = await db.view('books_view', 'all_books')

        console.log(booklist)
        res.send(booklist.rows)
    } catch (error) {
        console.error(error)
    }
});

// Read detail book
router.get('/book/:id', async (req, res) => {
    const id = req.params.id
    try {
        const bookid = await db.get(id)
        res.status(200).send(bookid)
    } catch (error) {
        console.error(error)
    }
});

// Create a new book 
router.post('/books/addBook', async (req, res) => {
    try {
        const book = {
            name: req.body.name,
            type: req.body.type,
            author: req.body.author,
            producer: req.body.producer,
            amount: req.body.amount,
            createAt: new Date()
        }
        await db.insert(book)
        res.status(201).send(book)
    } catch (error) {
        console.error(error)
    }
});

// Delete book
router.delete('/book/delete/:id', async (req, res) => {
    const id = req.params.id
    try {
        const bookid = await db.get(id)
        const _rev = bookid._rev
        const _id = id
        const rmvBook = await db.destroy(_id,_rev)
        res.status(200).send(rmvBook)
    } catch (error) {
        console.error(error)
    }
});

// TEST
router.get('/test/:id', async (req, res) => {
    const id = req.params.id
    try {
        const test = await db.get(id)
        const rev = test._rev
        res.send(rev)
    } catch (error) {
        console.error(error)
    }
});

module.exports = router;