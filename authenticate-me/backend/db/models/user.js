'use strict';
const {Model, Validator, Op} = require('sequelize');
const bcrypt = require('bcryptjs');


module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    toSafeObject() {
      const { id, username, email } = this; // context will be the User instance
      return { id, username, email };
    };

    validatePassword(password) {     
        return bcrypt.compareSync(password, this.hashedPassword.toString());
    };
    
    getCurrentUserById(id) {
      return User.scope("currentUser").findByPk(id);
    };

    static async login({credential, password}) {
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });
      if (user && user.validatePassword(password)) {
        let ret =  await User.scope('currentUser').findByPk(user.id);
        
        return ret
      }
    }

    static async signup({username, email, password}) {
      const hashedPassword = bcrypt.hashSync('password');

      const user = await User.create({
        username,
        email,
        hashedPassword
      });
      return await User.scope('currentUser').findByPk(user.id);   
    }

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */    
    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len:[4, 30],
        isNotEmail: function(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Cannot be an email.")
          }
        } 
      }

    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len:[3, 256],
        isEmail(value) {
          if (!Validator.isEmail(value)) {
            throw new Error("Not an email.")
          }
        } 
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,      
      validate: {
        len:[60, 60],
      }
    }
  }, 
  {
    defaultScope: {
      attributes: {exclude: [
        'hashedPassword', 'updatedAt', 'email', 'createdAt'
      ]}
    },
    scopes: {
      currentUser: {
        attributes: {exclude:['hashedPassword']},       
      },
      loginUser: {
        attributes: {}
      }
    },    
 
    sequelize,
    modelName: 'User',
  });
  return User;
};