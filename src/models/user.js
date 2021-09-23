const crypto = require('crypto')

const { DataTypes, Model } = require('sequelize')

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
  }

  User.init(
    {
      email: DataTypes.INTEGER,
      name: DataTypes.STRING,
      hash: DataTypes.STRING(64),
      salt: DataTypes.STRING(16),
    },
    {
      sequelize,
      tableName: 'users',
    }
  )

  return User
}
