const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'

function generateToken(payload, opts = {}){
  return jwt.sign(payload, JWT_SECRET, Object.assign({ expiresIn: '8h' }, opts))
}

function verifyAdmin(req, res, next){
  // Support both Express (`req.get`) and Next.js API requests (`req.headers`)
  const auth = (typeof req.get === 'function' ? req.get('authorization') : (req.headers && (req.headers.authorization || req.headers.Authorization))) || ''
  const parts = auth.split(' ')
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer'){
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const token = parts[1]
  try{
    const decoded = jwt.verify(token, JWT_SECRET)
    req.admin = decoded
    return next()
  }catch(e){
    return res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = { generateToken, verifyAdmin }
