/*
* SmartClickR Question-Manager Module
* Used for handling handling question resources
* Version: 0.5
*/


// Required Modules //
var MC = require('./my-info-config'); 
var CM = require('./choice-manager');
var PM = require('./poll-manager');
var mysql = require('mysql');

// DB Credentials //
var HOST = MC.host;
var PORT = 3306;
var MYSQL_USER = MC.user;
var MYSQL_PASS = MC.pass;
var DATABASE = MC.db;
var TABLE = 'Questions';
var TABLE2 = 'Choices';

// Connect to the DB //
var connection = mysql.createConnection({
	host: HOST,
	port: PORT,
	user: MYSQL_USER,
	password: MYSQL_PASS,
	database: DATABASE,
});

var answerType = {
	FR : 'FreeResponse',
	MC : 'MultipleChoice',
	TF : 'TrueFalse',
	N  : 'Numeric' 
};

var QM = {};

module.exports = QM;


// Make a new Question //
//pollid, questionType
//should return question id
QM.newQuestion = function(questionData, callback) {
	
	QM.getAnswerType(questionData.AType, function(type) {
		connection.query('INSERT INTO ' + TABLE + ' (Poll_ID, AnswerType, QuestionsOrder) VALUES(?, ?, ?)', [questionData.Poll_ID, type, questionData.Order], function(err, results) {
			if(err) {
				console.log('Error: ', err);
				connection.destroy();
				console.log('Connection is closed');
			} else {
				callback(results.insertId);
				//console.log('added new question');
			}
		});
	});
}

// Get all questions of the polls //
QM.getQuestions = function(pollId, callback) {
	// Outer join query
	// 'SELECT * FROM ' + TABLE2 + ' Right OUTER JOIN Questions on Questions.Question_ID = Choices.Question_ID WHERE Questions.Poll_ID = ? ORDER BY Questions.QuestionsOrder
	connection.query('SELECT * FROM ' + TABLE + ' WHERE Poll_ID = ? Order By QuestionsOrder', [pollId], function(err, results) {
		if(err) {
			console.log('Error: ', err);
			connection.destroy();
			console.log('Connection is closed');
		} else {
			console.log('Questions! ', results);
			callback(results);
		}
	});
}

// Get All Question ID of the Poll from sessionCode //
QM.getPollQuestions = function(sessionCode, callback) {
	connection.query('SELECT Question_ID FROM ' + TABLE + ' JOIN Polls on Polls.Poll_ID = Questions.Poll_ID WHERE Polls.SessionCode = ? Order By Questions.QuestionsOrder', [sessionCode], function(err, results) {
		if(err) {
			console.log('Error: ', err);
			connection.destroy();
			console.log('Connection is closed');
		} else {
			callback(results);
		}
	});
}

// Get All Question ID from poll using Poll_ID
QM.getPollQuestionsPID = function(pollID, callback) {
	connection.query('SELECT Question_ID FROM ' + TABLE + ' JOIN Polls on Polls.Poll_ID = Questions.Poll_ID WHERE Polls.Poll_ID = ? Order By Questions.QuestionsOrder', [pollID], function(err, results) {
		if(err) {
			console.log('Error: ', err);
			connection.destroy();
			console.log('Connection is closed');
		} else {
			callback(results);
		}
	});
}

// Get a Question //
QM.getQuestion = function(questionId, callback) {
	connection.query('SELECT * FROM ' + TABLE + ' WHERE Question_ID = ?', [questionId], function(err, results) {
		if(results.length === 1) 
			callback(results);
		else
			callback('question-doesnt-exist');
	});

}

QM.getQuestionSC = function(questionId, sessionCode, callback) {
	connection.query('SELECT Poll_ID FROM Polls WHERE SessionCode = ?', [sessionCode], function(err, results) {
		var pollID = results[0].Poll_ID;
		connection.query('SELECT * FROM ' + TABLE + ' WHERE Question_ID = ? and Poll_ID = ?', [questionId, pollID], function(err, results) {
			if(results.length === 1) 
				callback(results);
			else
				callback('question-doesnt-exist');
		});

	});
}

QM.getQuestionPID = function(questionId, pollID, callback) {
	console.log(pollID);
	connection.query('SELECT * FROM ' + TABLE + ' WHERE Question_ID = ? and Poll_ID = ?', [questionId, pollID], function(err, results) {
		if(results.length === 1) 
			callback(results);
		else
			callback('question-doesnt-exist');
	});
}


// Delete All Questions from a Poll //
QM.deleteQuestions = function(pollID, callback) {
	connection.query('DELETE FROM ' + TABLE + ' WHERE POLL_ID = ?', [pollID], function(err, result) {
		if(err) {
			console.log('Error: ', err);
			connection.destroy();
			console.log('Connection is closed');
		} else {
			callback('Questions-Deleted');
		}
	});
}

/****** Updating Questions ******/

// Update the stem //
QM.updateStem = function(questionData, callback) {
// questionData = question stem, questionID
	connection.query('UPDATE ' + TABLE + ' SET Stem = ? WHERE Question_ID = ?', [questionData.Stem, questionData.Question_ID], function(err, results) {
		if(err) {
			console.log('Error: ', err);
			connection.destroy();
			console.log('Connection is closed');
		} else {
			callback(null);
		}
	});

}

// Update question order //
// *** NEED TO TEST!!!! *** //

// * Only updates the specified questionId, not the whole thing yet//
QM.updateOrder = function(questionData, callback) {
// questionData = order, quesitonID, and pollID
	connection.query('UPDATE ' + TABLE + ' SET QuestionsOrder = ? WHERE Poll_ID = ? AND Question_ID = ?', [questionData.Order, questionData.Poll_ID, questionData.Question_ID], function(err, results) {
		if(err) {
			console.log('Error: ', err);
			connection.destroy();
			console.log('Connection is closed');
		} else {
			callback(null);
		}
	});

}

// Delete Question //
QM.delete = function(questionID, callback) {
	connection.query('DELETE from ' + TABLE + ' WHERE Question_ID = ?', [questionID], function(err, results) {
		if(err) {
			console.log('Error: ', err);
			connection.destroy();
			console.log('Connection is closed');
		} else {
			callback(null);
		}
	});	
}



/*****  Helper Methods  ******/


QM.questionCount = function(pollId, callback) {
	connection.query('SELECT * FROM ' + TABLE + ' WHERE Poll_ID = ?', [pollId], function(err, results) {
		if(results.length > 0)
			callback(results.length);
		else
			callback(0);
	});
}

QM.getAnswerType = function(type, callback) {
	var result;
	switch(type) {
		case 'FR':
			result = answerType.FR;
			break;
		case 'MC':
			result = answerType.MC;
			break;
		case 'TF':
			result = answerType.TF;
			break;
		case 'N':
			result = answerType.N;
			break;
	}
	callback(result);
}

//Returns the answer type so we can use it in visualizer class
QM.returnAnswerType = function(){
	return result;
}


QM.getNumberIfString = function(item, callback) {
	var result;
	if(typeof item === "string")
		result = Number(item);
	else
		result = item;
	callback(result);
}




