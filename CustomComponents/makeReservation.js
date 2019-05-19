require ('custom-env').env('stagging') //remember to change the env. variable
var async = require('async');
var oracledb = require('oracledb');
var dbConfig = require('./../dbconfig.js');


//variables

let name;
let eventid;
let seatstoReserve;
let paid = 'No';
let bookings;
let eventname;
let remainingSeats;
let message;


module.exports = {

    metadata: function metadata() {
        return {
            "name": "makeReservation",
            "channels": {
                "facebook": "1.0",
                "webhook": "1.0"
            },


            "properties": {

              "name": {"type":"string", "required": true},
          "eventname": {"type":"string", "required": true},
          "seatstoReserve": {"type":"string", "required": true}

            },
            "supportedActions": []
        };
    },

    invoke: function invoke(sdk, done) {
	
              //console.log('Check User Payload: ' + JSON.stringify(sdk.payload()));
              name = sdk.properties().name;
              eventname = sdk.properties().eventname;
              seatstoReserve = parseInt(sdk.properties().seatstoReserve);

        console.log("DATA:  " + eventname +": "+ seatstoReserve);
        
////Start Functions 

var doconnect = function(cb) {
    oracledb.getConnection({
    user: dbConfig.dbuser,
    password: dbConfig.dbpassword,
    connectString: dbConfig.connectString
    },
    cb);
    };

var dorelease = function(conn) {
        conn.close(function (err) {
        if (err)
        console.error(err.message);
        });
        };   

var doCheckAvailability = function(conn, cb){
    conn.execute( 
        `SELECT EVENTID, BOOKINGS, (SEATS - BOOKINGS) AS REMAININGSEATS FROM EVENTS WHERE eventname LIKE 'Jazz Festival'`, 
        function(err, result)
        {
        if (err) { console.error(err); return cb(err, conn); }
        //console.log(result.rows);
        
        eventid = JSON.stringify(result.rows[0][0]); 

        remainingSeats = JSON.stringify(result.rows[0][2]); 
        
        bookings= JSON.stringify(result.rows[0][1]);

        console.log('Event ID: '+ eventid);

        console.log('Bookings: '+ bookings);

        console.log('Remaining Seats: '+ remainingSeats);

        return cb(null, conn);
   
        });
}

var doinsert = function (conn, cb) {
 
    //before you add a reservation, check if there are seats available
   if (parseInt(seatstoReserve)  > parseInt(remainingSeats)){

    message = `Sorry, you can't book ${seatstoReserve} seats at ${eventname}. No enough seats available... the available seats are ${remainingSeats}`;

    //console.log(`From console: log Sorry, you can't book ${seatstoReserve} seats at ${eventname}. No enough seats available... the available seats are ${remainingSeats}`);       
   
    dorelease(conn);

    //return false;

   }else{

    var data = [name,eventid,paid,seatstoReserve]
    conn.executeMany(
   "INSERT INTO RESERVATIONS VALUES (:1, :2, :3, :4)",
   [data], // bind the JSON string for inserting into the JSON column.
   { autoCommit: true },
   function(err) {
   if (err) {
   return cb(err, conn);
   } else {
   //console.log("Data Inserted");

   message ='Reservation done succesifully';

   //return cb(null, conn);
   }
   });
         
   }
   return cb(null, conn);
       };

var doUpdateBooking = function(conn, cb){

        bookings = parseInt(bookings) + parseInt(seatstoReserve);

        var Updatedata = [bookings, eventid]
        console.log(Updatedata);

        conn.executeMany( 
                `UPDATE EVENTS SET BOOKINGS = :1 WHERE EVENTID = :2`, // WHERE eventid =21
                 [Updatedata], 
                 { autoCommit: true },
                 function(err) {
                        if (err) {
                        return cb(err, conn);
                        } else {
                        console.log("Data Updated!");
                        return cb(null, conn);
                        }
                        }   );


};

     ////Run the logic here using waterfall

      async.waterfall(
        [
        doconnect,// Does the connection -Very key!
        doCheckAvailability, //Check if seats are available
        doinsert, //Add reservation
        doUpdateBooking //Update the bookings in Events table
        ],
        function (err, conn) {
        if (err) { console.error("In waterfall error cb: ==>", err, "<=="); }
        if (conn)
        dorelease(conn);
        });

        sdk.reply(message);

        done();    

	}

};
