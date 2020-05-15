


//setting database configuration
module.exports = {
    HOST: "localhost",
    USER: "darachi",
    PASSWORD: "password",
    DB: "finishit_db",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };