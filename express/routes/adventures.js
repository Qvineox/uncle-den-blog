const express = require('express')
const e = require("express");
const {Countries, Posts} = require("../bin/server");
const router = express.Router()

router.get('/', async (req, res) => {
    const Adventures = require('../bin/server').Adventures
    const Countries = require('../bin/server').Countries

    let payload = {
        "result": await Adventures.findAll({
            attributes: ["id", "title", "description", "startDate", "finishDate", "distance", "path"],
            include: Countries,
        })
    }

    console.info('> Adventures data requested')
    res.status(200).json(payload)
})

router.get('/:id', async (req, res) => {
        const Adventures = require('../bin/server').Adventures
        const Posts = require('../bin/server').Posts

        await Adventures.findAll({
            where: {
                'id': req.params.id
            },
            attributes: ["id", "title", "description", "startDate", "finishDate", "distance", "map", "createdAt", "updatedAt"],
            include: {model: Posts, as: 'posts'},
            order: [
                [Posts, 'order', 'ASC'], [Posts, 'id', 'ASC']
            ]
        }).catch(error => {
            res.status(500).json({
                "error": error
            })
        }).then(value => {
            if (value?.length > 0) {
                console.info('> Adventure data requested')
                res.status(200).json({
                    "result": value[0]
                })
            } else if (value) {
                res.status(404).json({
                    "result": value
                })
            }
        })
    }
)

router.post('/add_post', async (req, res) => {
    const Posts = require('../bin/server').Posts

    const newPost = await Posts.create({
        type: req.body.postType,
        content: req.body.postContent,
        adventureId: req.body.adventureId
    })

    res.status(200).json(newPost)
})

router.post('/edit_post_content', async (req, res) => {
    const Posts = require('../bin/server').Posts

    const editPost = await Posts.update(
        {
            content: req.body.postContent
        }, {
            where: {id: req.body.postId}
        })

    res.status(200).json(editPost)
})

router.post('/delete_post', async (req, res) => {
    const Posts = require('../bin/server').Posts

    const deletePost = await Posts.destroy({
        where: {
            id: req.body.postId
        }
    })

    res.status(200).json(deletePost)
})

// TODO: remove adventure JSON
router.delete('/:id', async (req, res) => {
    const Adventures = require('../bin/server').Adventures

    await Adventures.destroy({
        where: {
            id: req.params.id
        }
    }).then(
        res.status(200)
    ).catch(error => {
        res.status(500).json({error: error})
    })
})

// TODO: add new adventure JSON
router.post('/', (req, res) => {
    const Adventures = require('../bin/server').Adventures
})


module.exports = router