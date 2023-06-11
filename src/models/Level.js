const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Level extends Model {}

  Level.init({
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    guildId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    xp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'Level',
  });

  return Level;
};
