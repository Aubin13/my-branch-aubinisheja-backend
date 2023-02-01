import jwt from 'jsonwebtoken';
import users from '../models/user.js';

const isAuth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await users.findById(decode.userId);
      if (!user) {
        res.status(403);
        return res.json({
          statusCode: 403,
          success: false,
          data: [{ message: 'Unauthorized access.' }],
        });
      }

      req.user = user;
      next();
    } catch (error) {
      res.json({ success: false, message: `Forbidden: ${error.message}` });
    }
  } else {
    res.status(401).json({
      statusCode: 401,
      success: false,
      data: [{ message: 'You need to first log in.' }],
    });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await users.findOne({ _id: req.user.id });
    if (!user) {
      res.status(401);
      return res.json({
        statusCode: 401,
        success: false,
        data: [{ message: 'Unauthorized access.' }],
      });
    }
    if (user.isAdmin === false) {
      return res.json({
        statusCode: 405,
        success: false,
        data: [{ message: 'Access Denied!' }],
      });
    }
    if (user.isAdmin === true) {
      next();
    }
  } catch (error) {
    res.json({ success: false, message: `Forbidden: ${error.message}` });
  }
};

export { isAuth, isAdmin };