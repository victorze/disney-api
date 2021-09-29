const { DataTypes, Model } = require('sequelize')

module.exports = (sequelize) => {
  class Movie extends Model {}

  Movie.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      releaseDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
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
    }
  )

  return Movie
}
