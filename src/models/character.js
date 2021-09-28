const { DataTypes, Model } = require('sequelize')

module.exports = (sequelize) => {
  class Character extends Model {}

  Character.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      story: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
          return process.env.SCHEME_AND_HOST + this.getDataValue('image')
        },
      },
    },
    {
      sequelize,
      tableName: 'characters',
    }
  )

  return Character
}
