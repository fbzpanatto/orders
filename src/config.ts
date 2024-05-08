export const config = () => {
  if (process.env.NODE_ENV === 'development') {
    return {
      db: {
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        connectTimeout: 60000
      },
      listPerPage: 10,
    }
  }

  return {
    db: {
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.TESTDB,
      connectTimeout: 60000
    },
    listPerPage: 10,
  }
}