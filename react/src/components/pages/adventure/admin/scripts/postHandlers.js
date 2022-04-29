function deletePost(id) {
    console.debug(`deleting post #${id}`)

    fetch(`${process.env.REACT_APP_BACKEND_HOST}/adventures/delete_post`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            postId: id
        })
    }).catch((err) => {
        console.error(err)
    }).then(response => {
        return response.json()
    }).then(data => console.debug(data))
}

function updatePost(id, newContent) {
    console.debug(`updating post #${id}`)

    fetch(`${process.env.REACT_APP_BACKEND_HOST}/adventures/edit_post_content`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            postContent: newContent,
            postId: id
        })
    }).catch((err) => {
        console.error(err)
    }).then(response => {
        return response.json()
    }).then(data => console.debug(data))
}

function createPost(type, content, articleId) {
    console.debug(`creating new post`)

    fetch(`${process.env.REACT_APP_BACKEND_HOST}/adventures/add_post`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            postType: type,
            postContent: content,

            // TODO: refactor name
            adventureId: articleId,
        })
    }).catch((err) => {
        console.error(err)
    }).then(response => {
        return response.json()
    }).then(data => console.debug(data))
}

function updateImagePost(id, content, images) {
    console.debug(`uploading new image`, images)

    const formData = new FormData();

    formData.append('postId', id);
    formData.append('postDescription', content.description);

    formData.append('postImageInverted', content.inverted);
    formData.append('postImage', images[0]);

    fetch(`${process.env.REACT_APP_BACKEND_HOST}/adventures/edit_image_post`, {
        method: 'POST',
        mode: 'cors',
        body: formData,
        credentials: 'same-origin'
    }).catch((err) => {
        console.error(err)
    }).then(response => {
        return response.json()
    }).then(data => console.debug(data))
}

module.exports = {
    deletePost,
    updatePost,
    createPost,
    updateImagePost
}