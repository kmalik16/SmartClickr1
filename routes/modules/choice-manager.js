/*
* SmartClickR Choice-Manager Module
* Used for handling question choices
* Version: 0.0.1
*/


// Required Modules //
var MC = require('./my-info-config'); 
var mysql = require('mysql');

// DB Credentials //
var HOST = MC.host;
var PORT = 3306;
var MYSQL_USER = MC.user;
var MYSQL_PASS = MC.pass;
var DATABASE = MC.db;
var TABLE = 'Choices';

// Connect to the DB //
var connection = mysql.createConnection({
	host: HOST,
	port: PORT,
	user: MYSQL_USER,
	password: MYSQL_PASS,
	database: DATABASE,
});


var CM = {};
module.exports = CM;

// Choices for True/False //
// choiceData = questionID and answer 
CM.createTFChoices = function(choiceData, callback) {
		
	var answer, content;

	if(choiceData.Answer == 'True') {
		content = 'True'
		answer = 'T';
	} else if(choiceData.Answer == 'False') {
		answer = 'F';
		content = 'False';
	} 
	
	connection.query('INSERT INTO ' + TABLE + ' (Question_ID, ChoiceOrder, IsCorrectChoice, Content) VALUES (?, ?, ?, ?)', [choiceData.Question_ID, 1, answer, content], function(err, results) {
		callback(results.insertId);
	});
}

// Choices for Multiple Choice //

CM.createMCChoices = function(choiceData, callback) {

	var answer;

	if(choiceData.Answer == choiceData.Content)
		answer = 'T';
	else
		answer = 'N';
	connection.query('INSERT INTO ' + TABLE + ' (Question_ID, ChoiceOrder, IsCorrectChoice, Content) VALUES (?, ?, ?, ?)', [choiceData.Question_ID, choiceData.Order, answer, choiceData.Content], function(err, results) {
		callback(results.insertId);
	});
}

CM.getChoices = function(questionID, callback) {
	connection.query('SELECT * FROM ' + TABLE + ' WHERE Question_ID = ? ORDER BY ChoiceOrder', [questionID], function(err, results) {
		if(err) {
			console.log('Error: ', err);
			connection.destroy();
			console.log('Connection is closed');
		} else {
			if(results.length > 0)
				callback(results);
			else
				callback([]);
		}
	});
}

// Delete All Choices for a Question //
CM.deleteChoices = function(questionID, callback) {
	connection.query('DELETE FROM ' + TABLE + ' WHERE Question_ID = ?', [questionID], function(err, results) {
		if(err) {
			console.log('Error: ', err);
			connection.destroy();
			console.log('Connection is closed');
		} else {
			callback(null);
			//console.log('all choices deleted from question ', questionID);
		}
	});
}

/****** Update Choice *******/

// Update Content //
CM.updateContent = function(choiceData, callback) {
	connection.query('UPDATE ' + TABLE + ' SET Content = ? WHERE Choice_ID = ?', [choiceData.Content, choiceData.Choice_ID], function(err, result) {
		if(err) {
			console.log('Error: ', err);
			connection.destroy();
			console.log('Connection is closed');
		} else {
			callback(null);
		}
	});
}

CM.updateTFContent = function(choiceData, callback) {

	if(choiceData.Answer == 'True') {
		content = 'True'
		answer = 'T';
	} else if(choiceData.Answer == 'False') {
		answer = 'F';
		content = 'False';
	} 

	connection.query('UPDATE ' + TABLE + ' SET Content = ?, IsCorrectChoice = ? WHERE Choice_ID = ?', [content, answer, choiceData.Choice_ID], function(err, result) {
		if(err) {
			console.log('Error: ', err);
			connection.destroy();
			console.log('Connection is closed');
		} else {
			callback(null);
		}
	});
}

// Update MC Content //
CM.updateMCContent = function(choiceData, callback) {
	connection.query('UPDATE ' + TABLE + ' SET Content = ?, ChoiceOrder = ? WHERE Choice_ID = ?', [choiceData.Content, choiceData.Order, choiceData.Choice_ID], function(err, result) {
		if(err) {
			console.log('Error: ', err);
			connection.destroy();
			console.log('Connection is closed');
		} else {
			callback(null);
		}
	});
}

// Update Correct //
// isCorrect must be either 'Y' or 'N'
CM.updateChoiceStatus = function(choiceData, callback) {
	connection.query('UPDATE ' + TABLE + ' SET IsCorrectChoice = ? WHERE Choice_ID = ?', [choiceData.IsCorrectChoice, choiceData.Choice_ID], function(err, results) {
		if(err) {
			console.log('Error: ', err);
			connection.destroy();
			console.log('Connection is closed');
		} else {
			callback(null);
		}
	});
}

/****** Helper Methods ******/

// Create a choice // 
CM.createChoice = function(questionID, callback) {
	CM.choiceCount(questionID, function(count) {
		connection.query('INSERT INTO ' + TABLE + ' (Question_ID, ChoiceOrder) VALUES (?, ?)', [questionID, count + 1], function(err, results) {
			if(err) {
				console.log('Error: ', err);
				connection.destroy();
				console.log('Connection is closed');
			} else {
				callback(results.insertId);
				console.log('new choice added for question ' + questionID);
			}
		});
	});
}

// Get the choice count for a question //
CM.choiceCount = function(questionID, callback) {
	connection.query('SELECT * FROM ' + TABLE + ' WHERE Question_ID = ?', [questionID], function(err, results) {
		if(results.length > 0)
			callback(results.length + 1);
		else
			callback(1);
	});
}

// Delete Choice //
CM.delete = function(questionID, callback) {
	connection.query('DELETE FROM ' + TABLE + ' WHERE Choice_ID = ?', [questionID], function(err, result) {
		if(err) {
			console.log('Error: ', err);
			connection.destroy();
			console.log('Connection is closed');
		} else {
			callback(null);
			//console.log('delete question ', questionID);
		}
	});
}