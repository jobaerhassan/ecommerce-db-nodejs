const createError = require('http-errors');
const User = require('../models/userModel');
const { successResponse } = require('./responseController');
const { default: mongoose } = require('mongoose');

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
        return successResponse(res, {
            statusCode: 200,
            message: 'users are returned successfully',
            payload: {
                users,
                pagination: {
                    totalPages: Math.ceil(count / limit),
                    currentPage: page,
                    previousPage: page - 1 > 0 ? page-1 : null,
                    nextPage: page + 1 <= Math.ceil(count / limit) ? page+1 : null,
                }
            }
        })
    } catch (error) {
        next(error);
    }
}
const getUser = async (req,  res, next) => {
    try {
        const id = req.params.id;
        const options = {password: 0};
        const user = await User.findById(id,options);
        if(!user) {
            throw createError(404, "user does not exist with this id");
        }
        return successResponse(res, {
            statusCode: 200,
            message: 'user is returned successfully',
            payload: {
                user
            }
        })
    } catch (error) {
        if(error instanceof mongoose.Error){ // for resolving the mongoose error.
            next(createError(400, 'invalid user id'))
        }
        next(error);
    }
}
module.exports = {getUsers, getUser};