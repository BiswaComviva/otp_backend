const conn = require('../database');
const queries = require('../queries/mysqlQueries');

async function checkRegistered (userid) {
    try {
        const rows  = await conn(queries.findUser,[ userid ])
        if(rows.length > 0)
        {
            return { userid:rows[0].userid ,  phno:rows[0].msisdn, isLoggedIn:rows[0].isLoggedIn };
        } else {
            return false;
        }
      } catch(err) {
          console.log(err);
      }
    }

    async function checkUserExistance (userid) {
        try {

            const result  = await conn(queries.checkUserExistance,[ userid ])
            if(result[0])
                {
                    return  {  time:result[0].time, trials:result[0].trials }
                } else {
                    return false;
                }
          } catch(err) {
              console.log(err);
          }
    }

    async function getAllUsers () {
        try {
            const rows  = await conn(queries.getUsers,[ userid ])
            if(rows.length > 0)
            {
                return rows;
            } else {
                return false;
            }
          } catch(err) {
              console.log(err);
          }
        }

        async function updateUserLogin (userid) {
            try {
                const res  = await conn(queries.updateUserLogin,[ userid])
                if(res)
                {
                    return true;
                } else {
                    return false;
                }
              } catch(err) {
                  console.log(err);
              }
            }

        async function insertUser (userid , username , msisdn , isLoggedIn) {
            try {
                const res  = await conn(queries.insertUser,[ userid , username , msisdn , isLoggedIn])
                if(res)
                {
                    return true;
                } else {
                    return false;
                }
              } catch(err) {
                  console.log(err);
              }
            }


          async function insertOtps (userid , otp) {
                try {
                    const res  = await conn(queries.insertOtps,[ userid , otp])
                    if(res)
                    {
                        return true;
                    } else {
                        return false;
                    }
                  } catch(err) {
                      console.log(err);
                  }
                }


            async function updateOtpsTrials (userid , otp) {
                try {
                    const res  = await conn(queries.updateOtpsTrials,[otp,userid])
                    if(res)
                    {
                        return true;
                    } else {
                        return false;
                    }
                  } catch(err) {
                      console.log(err);
                  }
                }


                async function updateOtpsTime (userid ) {
                    try {
                        const res  = await conn(queries.updateOtpsTime,[userid])
                        if(res)
                        {
                            return true;
                        } else {
                            return false;
                        }
                      } catch(err) {
                          console.log(err);
                      }
                    }

module.exports = {checkRegistered ,checkUserExistance , getAllUsers , insertUser, updateOtpsTrials, insertOtps,updateOtpsTime,updateUserLogin}
