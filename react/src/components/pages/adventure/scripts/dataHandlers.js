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

    return axios.post(`${process.env.REACT_APP_BACKEND_HOST}/adventures/insert_post`, payload)
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

function uploadImages(files, id) {
    let payload = new FormData()
    payload.append('postId', id)

    files.forEach(file => {
        payload.append('postImages', file)
    })

    return axios.post(`${process.env.REACT_APP_BACKEND_HOST}/adventures/upload_images`, payload, {
        headers: {
            'content-type': 'multipart/form-data'
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
    uploadImage: uploadImages
}