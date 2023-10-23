import Jwt from 'jsonwebtoken'

export default function verifyToken(req, res, next) {
  const token = req.headers['x-access-token']
  if (!token) {
    res.status(401)
    res.send({ message: 'Missing key (x-access-token) for authentication.' })
    return
  }
  try {
    const decode = Jwt.verify(token, 'TOKEN-KEY')
    req.user = decode
  } catch (error) {
    res.status(401)
    res.send({ message: 'Invalid (x-access-token).' })
    return
  }
  return next()
}
