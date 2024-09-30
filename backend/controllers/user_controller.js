import AsyncHandler from 'express-async-handler'

export const home = AsyncHandler(async(req, res) => {
    res.json({message : true})
})

