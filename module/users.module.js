const config = require(`${__config_dir}/app.config.json`);
const { debug } = config;
const mysql = new (require(`${__class_dir}/mariadb.class.js`))(config.db);
const e = require("express");
const Joi = require("joi");
const jwt = require('jsonwebtoken');
const bycrypt = require('bcryptjs');

class _users {
  register(data) {
    // Validate data
    const schema = Joi.object({      
      username: Joi.string(),
      password: Joi.string()
    }).options({
      abortEarly: false,
    });
    const validation = schema.validate(data);
    if (validation.error) {
      const errorDetails = validation.error.details.map((detail) => {
        return detail.message;
      });

      return {
        status: false,
        code: 422,
        error: errorDetails.join(", "),
      };
    }

    // Insert data to database
    const sql = {
      query: `INSERT INTO users (username, password) VALUES (?, ?)`,
      params: [data.username, data.password],
    };

    return mysql
      .query(sql.query, sql.params)
      .then((data) => {
        return {
          status: true,
          data,
        };
      })
      .catch((error) => {
        if (debug) {
          console.error("Register Error: ", error);
        }

        return {
          status: false,
          error,
        };
      });
  }

  login(data) {
    // Validate data
    const schema = Joi.object({      
      username: Joi.string(),
      password: Joi.string()
    }).options({
      abortEarly: false,
    });
    const validation = schema.validate(data);
    if (validation.error) {
      const errorDetails = validation.error.details.map((detail) => {
        return detail.message;
      });

      return {
        status: false,
        code: 422,
        error: errorDetails.join(", "),
      };
    }
    const sql = {
      query: `SELECT * FROM users WHERE username = ?`,
      params: [data.username],
    }


    return mysql
      .query(sql.query, sql.params)
      .then((result) => {                               
        if (result.length > 0 && bycrypt.compareSync(data.password, result[0].password)) {
          const user = result[0]
          const payload = {
            username: user.username,
            userId: user.id
          }
          const secret_key = 'tes'          
          const token = jwt.sign(payload, secret_key)

          return{
            status: true,
            data: user,
            token: token
          }
        } else {
          return {
            status: false,
            error: 'Invalid username or password'
          }
        }
        
      })
      .catch((error) => {
        if (debug) {
          console.error("Login Error: ", error);
        }

        return {
          status: false,
          error,
        };
      });
  }
  

}

module.exports = new _users();
