const config = require(`${__config_dir}/app.config.json`);
const { debug } = config;
const mysql = new (require(`${__class_dir}/mariadb.class.js`))(config.db);
const Joi = require("joi");

class _task {
  add(data, userId) {
    // Validate data
    const schema = Joi.object({
      item: Joi.string(),
    }).options({
      abortEarly: false,
    });
    const validation = schema.validate(data);
    if (validation.error) {
      const errorDetails = validation.error.details.map((detail) => {
        detail.message;
      });

      return {
        status: false,
        code: 422,
        error: errorDetails.join(", "),
      };
    }

    // Insert data to database
    const sql = {
      query: `INSERT INTO task (user_id, items) VALUES (?, ?)`,
      params: [userId, data.item],
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
          console.error("add task Error: ", error);
        }

        return {
          status: false,
          error,
        };
      });
  }

  show(userId) {    

    // Show data from database
    const sql = {
      query: `SELECT * FROM task WHERE user_id = ?`,
      params: [userId],
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
          console.error("Error while show data: ", error);
        }

        return {
          status: false,
          error,
        };
      });
  }

  show_by_id(id, userId) {    

    // Show data from database
    const sql = {
      query: `SELECT * FROM task WHERE id = ? AND user_id = ?`,
      params: [id, userId],
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
          console.error("Error while show data: ", error);
        }

        return {
          status: false,
          error,
        };
      });
  }

  update(id, data, userId) {
    // Validate data
    const schema = Joi.object({
      item: Joi.string(),
    }).options({
      abortEarly: false,
    });
    const validation = schema.validate(data);
    if (validation.error) {
      const errorDetails = validation.error.details.map((detail) => {
        detail.message;
      });

      return {
        status: false,
        code: 422,
        error: errorDetails.join(", "),
      };
    }

    // Update data in the database
    const sql = {
      query: `UPDATE task SET items = ? WHERE id = ? AND user_id = ?`,
      params: [data.item, id, userId],
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
          console.error("update task Error: ", error);
        }

        return {
          status: false,
          error,
        };
      });
  }

  delete(id, userId) {
    // Delete data in the database
    const sql = {
      query: `DELETE FROM task WHERE id = ? AND user_id = ?`,
      params: [id, userId],
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
          console.error("delete task Error: ", error);
        }

        return {
          status: false,
          error,
        };
      });
  }

}

module.exports = new _task();
