import { DataTypes, Model, Sequelize } from 'sequelize';

class Level extends Model {
    public userId!: string;
    public guildId!: string;
    public xp!: number;
    public level!: number;
}

const initializeLevelModel = (sequelize: Sequelize): typeof Level => {
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

export default initializeLevelModel;
