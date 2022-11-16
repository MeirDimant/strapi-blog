module.exports = {
    routes: [
      { // Path defined with an URL parameter
        method: 'PUT',
        path: '/posts/:id/like', 
        handler: 'post.likePost',
      }
    ]
  }