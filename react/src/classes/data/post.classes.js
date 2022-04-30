const axios = require("axios");

const LEVELS = {
    EVENT_SUCCESS: 0,
    EVENT_ERROR: 1,
    EVENT_FAILURE: 2,
    EVENT_CRITICAL: 3
}

class DataTransferEvent {
    constructor(response) {
        if (response.status < 300) {
            this.notificationText = `Операция выполнена успешно: ${response.statusText}`
            this.notificationLevel = LEVELS.EVENT_SUCCESS
        } else {
            this.notificationText = `Операция выполнена с ошибкой: ${response.statusText}`
            this.notificationLevel = LEVELS.EVENT_ERROR
        }
    }

    errors = []

    addError(error) {
        this.errors.push(error)
    }
}

class Post {
    constructor(id, order) {
        // missing 'id' means that posts is not synced with database (newly created)
        id !== undefined ? this.id = id : this.id = null

        // set 'order' to 0 if unordered
        order !== undefined ? this.order = order : this.order = null

        // preparation for json object model
        this.content = {}
    }

    // Sends data to database, if id is present DB updates, if not - creates new instance
    dbInsert(postType, adventureId) {
        let payload
        // creating new instance of post; required type and adventure
        if (postType !== undefined && adventureId !== undefined) {
            payload = {
                postId: this.id,
                postOrder: this.order,
                postContent: this.content,
                postType: postType,
                adventureId: adventureId
            }
        } else {
            payload = {
                postId: this.id,
                postContent: this.content
            }
        }

        return axios({
            method: 'post',
            url: `${process.env.REACT_APP_BACKEND_HOST}/adventures/insert_post`,
            headers: {'Content-Type': 'application/json'},
            data: payload
        })
            .then(response => {
                return new DataTransferEvent(response)
            })
            .catch(error => {
                return new DataTransferEvent(error.response)
            })

    }

    // Delete data instance from DB by 'id'
    dbDelete() {
        return axios({
            method: 'post',
            url: `${process.env.REACT_APP_BACKEND_HOST}/adventures/delete_post`,
            headers: {'Content-Type': 'application/json'},
            data: {
                postId: this.id
            }
        })
            .then(response => {
                return new DataTransferEvent(response)
            })
            .catch(error => {
                return new DataTransferEvent(error.response)
            });
    }
}

// contains 1 text field
class TextPost extends Post {
    constructor(id, order, text) {
        super(id, order);

        text !== undefined ? this.content.text = text : this.content.text = 'Описание отсутствует'
    }

    dbInsert(adventureId) {
        return super.dbInsert('text', adventureId);
    }

    dbDelete() {
        return super.dbDelete();
    }
}

class PostRemoteImage {
    constructor(imageName, postId) {
        // if 'id' present - post was already created, check for image; no 'id' - create new post
        if (postId) {
            if (imageName !== undefined) {
                // post has uploaded image
                this.alt = imageName
                this.path = `${process.env.REACT_APP_BACKEND_HOST}${imageName}`
            } else {
                // no uploaded post image, set placeholder
                this.alt = `image-placeholder`
                this.path = `${process.env.REACT_APP_BACKEND_HOST}/public/images/placeholders/600x400-placeholder.png`
            }
        } else {
            if (imageName !== undefined) {
                // post prepared an uploaded image TODO: add image upload
                this.alt = imageName
                this.path = `${process.env.REACT_APP_BACKEND_HOST}${imageName}`
            } else {
                this.alt = `image-placeholder`
                this.path = `\\public\\images\\placeholders\\600x400-placeholder.png`
            }
        }
    }
}

// contains 1 text field, 1 image-path field and direction flag
class ImagePost extends Post {
    constructor(id, order, isInverted, text, imageName) {
        super(id, order);

        this.content.image = new PostRemoteImage(imageName, id)

        text !== undefined ? this.content.text = text : this.content.text = 'Описание отсутствует'
        isInverted !== undefined ? this.content.isInverted = true : this.content.isInverted = false
    }

    dbInsert(adventureId) {
        return super.dbInsert('image', adventureId);
    }

    dbDelete() {
        return super.dbDelete();
    }
}

module.exports = {
    LEVELS,
    TextPost,
    ImagePost
}