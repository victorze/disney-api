const crypto = require('crypto')

const { DataTypes, Model } = require('sequelize')
const jwt = require('jsonwebtoken')

module.exports = (sequelize) => {
  class User extends Model {
    setPassword(password) {
      this.salt = crypto.randomBytes(16).toString('hex')
      this.hash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
        .toString('hex')
    }

    validPassword(password) {
      const hash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
        .toString('hex')
      return this.hash === hash
    }

    generateJwt() {
      return jwt.sign({ email: this.email }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      })
    }
  }

  User.init(
    {
      email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
      },
      name: DataTypes.STRING(100),
      hash: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      salt: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'users',
    }
  )

  return User
}
