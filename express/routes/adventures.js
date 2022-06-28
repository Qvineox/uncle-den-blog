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

    console.info('> Journey data requested')
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

    if (req.body.postId !== undefined) {
        post = await Posts.update(
            {
                content: req.body.postContent
            }, {
                where: {id: req.body.postId}
            })
    } else {
        post = await Posts.create({
            type: req.body.postType,
            content: req.body.postContent,
            adventureId: req.body.adventureId
        })
    }

    res.status(200).json(post)
})


router.post('/upload_images', fileMiddleware.fields([
        {name: 'postId', maxCount: 1},
        {name: 'postImages', maxCount: 10}]),
    (req, res) => {
        if (req.files['postImages'].length > 0) {

            let payload = {
                images: []
            }

            req.files['postImages'].forEach(fileData => {
                payload.images.push({
                    filePath: `/${fileData.path.replaceAll('\\', '/')}`,
                    fileAlt: fileData.originalname
                })
            })

            res.status(201).json(payload)
        } else {
            res.status(400)
        }
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