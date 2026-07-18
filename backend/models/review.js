'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.User, { foreignKey: 'user_id' });
      Review.belongsTo(models.Hotel, { foreignKey: 'hotel_id' });
      Review.belongsTo(models.Booking, { foreignKey: 'booking_id' });
    }
  }
  Review.init({
    user_id: DataTypes.INTEGER,
    hotel_id: DataTypes.INTEGER,
    booking_id: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    underscored: true,
    timestamps: true,
    updatedAt: false 
  });
  return Review;
};