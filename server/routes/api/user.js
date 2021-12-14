const express = require('express');
const req = require('express/lib/request');
const { send } = require('express/lib/response');
const couch = require('./../../db/couch')
const db = couch.use('users')

const router = express.Router();

// router.get('/test', async (req, res) => {
//     try {
//         const login = [doc.username, doc.password]
//         const test = await db.fetch({keys: login})
//         res.send(test)
//     } catch (e) {
//         console.error(e)
//     }
// })


// Read all doc in users
router.get('/users', async (req, res) => {
    
    try {
        const userlist = await db.view('users_view', 'view-all')

        console.log(userlist)
        res.send(userlist.rows)
    } catch (error) {
        console.error(error)
    }
});

// Read detail user
router.get('/user/profile/:id', async (req, res) => {
    const id = req.params.id
    try {
        const user = await db.get(id)
        if(!user) {
            res.status(404).send()
        }
        res.status(200).send(user)
    } catch (error) {
        console.error(error)
    }
});

// Update user profile (fix with layout to edit again)
router.patch('/user/editprofile/:id', async (req, res) => {
    const id = req.params.id
    try {
        const getUser = await db.get(id)
        const rev = getUser._rev
        const updateUser = {
            fullname: req.body.fullname,
            email: req.body.email,
            phone: req.body.phone,
            username: req.body.username,
            password: req.body.password,
            updateAt: new Date()
        }
        const sendUpdate = await db.insert({ 
            _id: id, 
            _rev: rev, 
            updateUser })
        res.status(200).send(sendUpdate)
    } catch (error) {
        console.error(error)   
    }
});

// Create a new user (SIGN UP)
router.post('/register', async (req, res) => {
    try {
        const user = {
            fullname: req.body.fullname,
            email: req.body.email,
            phone: req.body.phone,
            username: req.body.username,
            password: req.body.password,
            role: req.body.role,
            createAt: new Date()
        }
        await db.insert(user)
        res.status(201).send(user)
    } catch (error) {
        console.error(error)
    }
});

// Sign In
router.post('/signin', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        // if(username === 'lanpui' && password === 'lanpuibanhwet') {
        //     res.status(200).send('Admin is login succesful!')
        // }else if(username === 'lienlien' && password === 'lien123'){
        //     res.status(200).send('Librarian is login succesful!')
        // }else if(username === 'henry' && password === 'henry123'){
        //     res.status(200).send('Reader is login succesful!')
        // }else {
        //     res.send('ACC is not available!')
        // }

        const find_user = {
            selector : {
                username: username,
                password: password
            },
            fields: [ "_id", "fullname", "email", "phone", "email", "username", "password", "role" ]
        }
        const userid = await db.find(find_user)
        console.log(userid)
        if(userid) {
            res.status(200).send(userid)
        }else if(!userid){
            res.status(404).send('Cannot found user!')
        }
        else{
            res.status(500).send("Try again!")
        }
    }catch (e) {
        console.log(e)
    }
});

// Delete user
router.delete('/user/delete/:id', async (req, res) => {
    const id = req.params.id
    try {
        const userid = await db.get(id)
        const _rev = userid._rev
        const _id = id
        const rmvUser = await db.destroy(_id,_rev)
        res.status(200).send(rmvUser)
    } catch (error) {
        console.error(error)
    }
});


module.exports = router;