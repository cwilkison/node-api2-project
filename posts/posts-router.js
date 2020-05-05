const router = require('express').Router()
const Posts = require('../data/db')

router.get('/', (req, res) => {
    Posts.find(req.query)
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({message: 'Error retreiving the posts'})
    })
})

router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
    .then(([post]) => {
        if(post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'The post with the specified ID does not exist'});
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: "The post information could not be retrieved"
        });
    });
});

// router.get('/:id/comments', (req, res) => {

// })

router.post('/', (req, res) => {
    const { title, contents } = req.body
    if(!title || !contents) {
        res.status(400).json({ errorMessage: "Please provide a title and contents for the post. "})
    }
    Posts.insert({title, contents})
    .then(({id}) => {
        Posts.findById(id)
        .then(([posts]) => {
            res.status(201).json(posts)
        })
    })
    .catch(err => {
        res.status(500).json({ errorMessage: "There was an error while saving the post to the database"})
    })
})

router.post("/:post_id/comments", (req, res) => {
    const {post_id} = req.params;
    const {text} = req.body;
    if (text === "" || typeof text !== "string"){
        return res.status(400).json({ errorMessage: "Please provide text for the comment"})
    }
    Posts.insertComment({text, post_id})
    .then(({id: comment_id}) => {
        Posts.findCommentById(comment_id)
        .then(([comment]) => {
            if (comment) {
                res.status(200).json(comment)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist"})
            }
        })
    }).catch(err => {
        res.status(500).json({ errorMessage: "There was an error while saving the post to the database"})
    })

});


router.put('/:id', (req, res) => {
    let id = req.params.id;
    let updated_post = req.body
    Posts.update(id, updated_post)
        .then(changed => {
            if(changed){
                Posts.findById(id)
                    .then(([post]) => {
                        res.status(201).json(post)
                    })
            }else{
                res.status(400).json({ errorMessage: "Please provide title and contents for the message"})
            }
        })
        .catch(error => {
            res.status(500).json({ errorMessage: "The post information could not be modified"})
        })
})

router.delete('/:id', (req, res) => {
    Posts.remove(req.params.id)
    .then(posts => {
        if (posts) {
            res.status(200).json({ message: "The post has been deleted "});
        } else {
            res.status(404).json({ errorMessage: "The post with the specified ID does not exist"});
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({errorMessage: "The post could not be removed" });
    });
});



module.exports = router