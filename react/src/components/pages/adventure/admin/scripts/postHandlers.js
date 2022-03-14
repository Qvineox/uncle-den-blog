function deletePost(id) {
    console.debug(`deleting post #${id}`)

    fetch(`http://localhost:3002/adventures/delete_post`, {
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
    })
}

function updatePost(id, newContent) {
    console.debug(`updating post #${id}`)

    fetch(`http://localhost:3002/adventures/edit_post_content`, {
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
    })
}

function createPost(type, content, articleId) {
    console.debug(`creating new post`)

    fetch(`http://localhost:3002/adventures/add_post`, {
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
    })
}

module.exports = {
    deletePost,
    updatePost,
    createPost
}