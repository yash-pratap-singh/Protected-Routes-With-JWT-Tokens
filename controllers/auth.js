const User = require('../model/User')
const { StatusCodes } = require('http-status-codes')
// const { use } = require('../routes/auth');

// const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json('Email and Password are required');
  }
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json('User Not Found');
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    return res.status(StatusCodes.UNAUTHORIZED).json('Password Not Found');
  }
  // compare password
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = {
  register,
  login,
}