const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize) => {
    class User extends Model {
        async comparePassword(password) {
            return await bcrypt.compare(password, this.password);
        }
    }

    User.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV1,
                primaryKey: true,
                allowNull: false,
                noUpdate: true,
                readOnly: true,
            },
            first_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                set(value) {
                    this.setDataValue("password", value);
                },
            },
            account_created: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            account_updated: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            email_verified: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            token: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null,
            },
            email_expiry: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: null,
            }
        },
        {
            sequelize,
            modelName: "User",
            defaultScope: {
                attributes: { exclude: ["password"] },
            },
        }
    );

    return User;
};
