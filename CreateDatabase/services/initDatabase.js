'use strict';

var fs = require('fs');
var mysql = require('mysql');

var id = null;

function connectionEnd(conn, id) {
	conn.end((err) => {
		if(err) {
			console.log('Error disconnecting from database! \nExecution stopped! \n' + 'Error message: ' + err.message);
			res.json({typeError: 'DBdisconnect', text: 'Error disconnecting from database! \nExecution stopped! \n' + 'Error message: ' + err.message});
		}
		console.log('Connection with id: ' + id + ' disconected!');
	});
}

module.exports={
	initDatabase: () => {
		var connection = mysql.createConnection({
										  	host: "localhost",
										 	user: "root",
										 	password: "",
										  	database: "restaurants",
										  	debug: false,
    										multipleStatements: true
										});
		connection.connect((err) => {
			if(err) {
				console.log('Error connecting to database! \nExecution stopped! \n' + 'Error message: ' + err.message);
				process.exit();
			}
			id = connection.threadId;
			console.log('Connection established!\nConnected with id: ' + id);
		});

		let script = fs.readFileSync('./scripts/init_database.sql').toString();

		connection.query(script, (err) => {
			if (err) {
				console.log('Error creating table! \nExecution stopped! \n' + 'Error message: ' + err.message);
				connectionEnd(connection, id);
				process.exit();
			} else {
				console.log('Table created!');
			}
		});

		script = fs.readFileSync('./scripts/insert_datas_into_restaurant.sql').toString();

		if(script.split("").length > 0) {
			connection.query(script, (err) => {
				if (err) {
					console.log('Error inserting datas into restaurants! \nExecution stopped! \n' + 'Error message: ' + err.message);
					connectionEnd(connection, id);
					process.exit();
				} else {
					console.log('Datas inserted into restaurants!');
					connectionEnd(connection, id);
				}
			});
		} else {
			console.log('Error inserting datas into restaurants! \nExecution stopped! \n' + 'Error message: EMPTY STRING' );
			connectionEnd(connection, id);
		}


	},

	createTableReviewForEachRestaurant: () => {
		var connection = mysql.createConnection({
										  	host: "localhost",
										 	user: "root",
										 	password: "",
										  	database: "restaurants",
										  	debug: false,
    										multipleStatements: true
										});
		connection.connect((err) => {
			if(err) {
				console.log('Error connecting to database! \nExecution stopped! \n' + 'Error message: ' + err.message);
				process.exit();
			}
			id = connection.threadId;
			console.log('Connection established!\nConnected with id: ' + id);
		});

		let script = fs.readFileSync('./scripts/create_restaurants_tables_reviews.sql').toString();

		connection.query(script, (err) => {
			if (err) {
				console.log('Error creating tables! \nExecution stopped! \n' + 'Error message: ' + err.message);
				connectionEnd(connection, id);
				process.exit();
			} else {
				console.log('Table for each restaurant created!');
				connectionEnd(connection, id);
			}
		});
	},

	insertDataInEachTableReview: () => {
		var connection = mysql.createConnection({
										  	host: "localhost",
										 	user: "root",
										 	password: "",
										  	database: "restaurants",
										  	debug: false,
    										multipleStatements: true
										});
		connection.connect((err) => {
			if(err) {
				console.log('Error connecting to database! \nExecution stopped! \n' + 'Error message: ' + err.message);
				process.exit();
			}
			id = connection.threadId;
			console.log('Connection established!\nConnected with id: ' + id);
		});

		let script = fs.readFileSync('./scripts/insert_datas_into_each_restaurant_table_review.sql').toString();

		connection.query(script, (err) => {
			if (err) {
				console.log('Error inserting in review tables! \nExecution stopped! \n' + 'Error message: ' + err.message);
				connectionEnd(connection, id);
				process.exit();
			} else {
				console.log('Data inserted for each restaurant table review!');
				connectionEnd(connection, id);
			}
		});
	}


}
