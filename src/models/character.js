const { DataTypes, Model } = require('sequelize')

module.exports = (sequelize) => {
  class Character extends Model {}

  Character.init(
    {
      name: DataTypes.STRING,
      age: DataTypes.INTEGER,
      weight: DataTypes.FLOAT,
      story: DataTypes.TEXT,
      image: DataTypes.TEXT,
    },
    {
      sequelize,
      tableName: 'characters',
    }
  )

  return Character
}
