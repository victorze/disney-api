const { DataTypes, Model } = require('sequelize')

module.exports = (sequelize) => {
  class Genre extends Model {}

  Genre.init(
    {
      name: {
        type: DataTypes.STRING,
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
    }
  )

  Genre.data = [
    { name: 'Comedy', image: '/images/genres/Comedy.png' },
    { name: 'Fantasy', image: '/images/genres/Fantasy.png' },
    { name: 'Crime', image: '/images/genres/Crime.png' },
    { name: 'Drama', image: '/images/genres/Drama.png' },
    { name: 'Music', image: '/images/genres/Music.png' },
    { name: 'Adventure', image: '/images/genres/Adventure.png' },
    { name: 'History', image: '/images/genres/History.png' },
    { name: 'Thriller', image: '/images/genres/Thriller.png' },
    { name: 'Animation', image: '/images/genres/Animation.png' },
    { name: 'Family', image: '/images/genres/Family.png' },
    { name: 'Mystery', image: '/images/genres/Mystery.png' },
    { name: 'Biography', image: '/images/genres/Biography.png' },
    { name: 'Action', image: '/images/genres/Action.png' },
    { name: 'Film-Noir', image: '/images/genres/Film-Noir.png' },
    { name: 'Romance', image: '/images/genres/Romance.png' },
    { name: 'Sci-Fi', image: '/images/genres/Sci-Fi.png' },
    { name: 'War', image: '/images/genres/War.png' },
    { name: 'Western', image: '/images/genres/Western.png' },
    { name: 'Horror', image: '/images/genres/Horror.png' },
    { name: 'Musical', image: '/images/genres/Musical.png' },
    { name: 'Sport', image: '/images/genres/Sport.png' },
  ]

  return Genre
}
