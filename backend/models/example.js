var database = require('../database');

exports.example = function(params, callback) {

    //if (!params.sailor_id) {
    //    callback({
    //       error: "Missing sailor ID"
    //    });
    //} else {
    //    database.get().query({
    //        text: "SELECT * FROM SAILORS WHERE sid=$1",
    //        values: [params.sailor_id]
    //    }, function(error, result) {
    //        if (!error) {
    //            callback(null, result.rows);
    //        }
    //    });
    //}

    callback([{"hello": "world"}]);
};