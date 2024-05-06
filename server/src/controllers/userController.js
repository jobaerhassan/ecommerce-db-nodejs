const createError = require('http-errors');
const User = require('../models/userModel');

const getUsers = async (req,  res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 1;

        //searching implementation
        const searchRegExp = new RegExp('.*' + search + '.*', 'i');
        const filter = {
            isAdmin: {$ne: true}, //ne == not equal. that means who are not admin they are returned
            $or: [
                {name: {$regex: searchRegExp}},
                {email: {$regex: searchRegExp}},
                {phone: {$regex: searchRegExp}},
            ]
        }

        const options = {password: 0}; //for not showing the password

        const users = await User.find(filter, options)
            .limit(limit)
            .skip((page-1 * limit));
        
        // total number of user count
        const count = await User.countDocuments(filter);
        if(!users) {
            throw createError(404, "no users found");
        }
        res.status(200).send({
            message: 'users are returned',
            users,
            pagination: {
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                previousPage: page - 1 > 0 ? page-1 : null,
                nextPage: page + 1 <= Math.ceil(count / limit) ? page+1 : null,
            }
        })
    } catch (error) {
        next(error);
    }
}
module.exports = getUsers;