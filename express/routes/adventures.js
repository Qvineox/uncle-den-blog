const express = require('express')
const e = require("express");
const {Countries, Posts} = require("../server");
const router = express.Router()

const fileMiddleware = require('../middleware/multer')

router.get('/', async (req, res) => {
    const Adventures = require('../server').Adventures
    const Countries = require('../server').Countries

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
        const Adventures = require('../server').Adventures
        const Posts = require('../server').Posts

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


router.post('/insert_post', async (req, res) => {
    const Posts = require('../server').Posts

    let post

    if (req.body.postId) {
        post = await Posts.update(
            {
                content: req.body.postContent
            }, {
                where: {id: req.body.postId}
            })

        res.status(200).json(post)
    } else {
        post = await Posts.create({
            type: req.body.postType,
            order: req.body.postOrder,
            content: req.body.postContent,
            adventureId: req.body.adventureId
        })

        res.status(201).json(post)
    }


})


router.post('/edit_image_post', fileMiddleware.fields([
        {name: 'postId', maxCount: 1},
        {name: 'postDescription', maxCount: 1},
        {name: 'postImageInverted', maxCount: 1},
        {name: 'postImage', maxCount: 1}]),
    async (req, res) => {
        const Posts = require('../server').Posts

        const savedImage = req.files['postImage'][0]

        const editPost = await Posts.update(
            {
                content: {
                    description: req.body.postDescription,
                    alt: savedImage.originalname,
                    image: savedImage.path,
                    inverted: req.body.postImageInverted === 'true'
                }
            }, {
                where: {id: req.body.postId}
            })

        res.status(200).json(editPost)
    })


router.post('/delete_post', async (req, res) => {
    const Posts = require('../server').Posts

    const deletePost = await Posts.destroy({
        where: {
            id: req.body.postId
        }
    })

    res.status(200).json(deletePost)
})

// TODO: remove adventure JSON
router.delete('/:id', async (req, res) => {
    const Adventures = require('../server').Adventures

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
    const Adventures = require('../server').Adventures
})


module.exports = router