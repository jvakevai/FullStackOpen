const dummy = (blogs) => {
    return 1
}
const totalLikes = (blogs) => {

    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    
    const reducer = (max, curr) => {
        if(curr.likes > max.likes){
            return curr
        }
        else{
            return max
        }
    }

    return blogs.length === 0 
    ? {} 
    : {
        title: blogs.reduce(reducer).title,
        author: blogs.reduce(reducer).author,
        likes: blogs.reduce(reducer).likes
      }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
}


//4.5 tehty