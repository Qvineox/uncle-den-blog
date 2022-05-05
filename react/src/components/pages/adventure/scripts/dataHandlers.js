const axios = require('axios')

// creating or editing post
function insertPost({id, content, type, adventureId}) {
    let payload

    // if id is present proceed to edit post
    if (id) {
        payload = {
            postId: id,
            postContent: content
        }

        // creating new post
    } else if (type && adventureId) {
        payload = {
            postType: type,
            postContent: content,
            adventureId: adventureId
        }
    }

    axios.post(`${process.env.REACT_APP_BACKEND_HOST}/adventures/insert_post`, payload).then(result => {
        console.debug(result)
    }).catch(error => {

        // TODO: error handling
        console.debug(error)
    })
}


// deleting post
function deletePost(id) {
    let payload = {postId: id}

    axios.post(`${process.env.REACT_APP_BACKEND_HOST}/adventures/delete_post`, payload)
        .then(result => {
            console.debug(result)
        }).catch(error => {

        // TODO: error handling
        console.debug(error)
    })
}

function uploadImage(file, id) {
    let payload = new FormData()
    payload.append('postId', id)
    payload.append('postImage', file, file.name)

    return axios.post(`${process.env.REACT_APP_BACKEND_HOST}/adventures/upload_image`, payload, {
        headers: {
            'content-type': 'multipart/form-data' // do not forget this
        }
    })
}

class HandlerNotification {
    constructor(status, message) {
        if (status >= 200 && status <= 400) {

        }
    }
}

module.exports = {
    insertPost,
    deletePost,
    uploadImage
}