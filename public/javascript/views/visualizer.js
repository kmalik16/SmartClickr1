/***************************************************************
 *  visualizer.js - The visualizer class is where the all of the  
 *  middle man work between displaying the visual data on the
 *  front end of the system and calling the functions that take 
 *  care of the visual manipulation of the data. Here we will make 
 *  query calls to the database to send and revieve data from the 
 *  database. The class will then send the retrieved data to the  
 *  approrate function based on the selected question types. The 
 *  data manipulation will take place and then send the visual 
 *  directly to the frontend to display page. REDUCE THIS DISCRIPTION 
 *  FOR THE FINAL VERSION. 
 */


// Required Modules //
var MC = require('./my-info-config'); 
var CM = require('./choice-manager');
var PM = require('./poll-manager');
var QM = require('./question-manager');
***********************************//var FM = require
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

var dataSet =[];
var xSet = [];
var ySet = [];
var questionType = ' ';

/**
 * Constructs a visualizer object
 */
function visualizer() {
	// get the data set from the user and set it equal to dataset[]
};

/**
 * data_Retrieve() - Calls the appriopate functions in the queston manager in order to
 * get the data and saves it in a variable based on its question ID. Here we will call the
 * format manager class getResponseData function
 */
visualizer.prototype.data_Xvalues = function(){
	dataSet = FM.getResponseData();
	//Create a loop from index 0 to dataset.length to get all of the x values.
	for (i = 0; i <= dataset.length(); i+2){
		xSet += dataset[i];
	}
};

//make the yvale dataset
visualizer.prototype.data_Yvalues = function(){
	dataSet = FM.getResponseData();
	//Create a loop from index 1 to dataset.length to get all of the y values.
	for (i = 1; i <= dataset.length(); i+2){
		ySet += dataset[i];
	}
}

/**
 * send_Data() - This class will send the x and y values to the correct functions
 * for that specific question type.
 */
visualizer.prototype.send_Data = function(xSet,ySet) {
	questionType = QM.returnAnswerType();

	if (questionType === answerType.FR){
		//call the functions needed to be performed order to create the correct graphs for free resonse.
	}
	else if(questionType === answerType.MC){

	}
	else if (questionType === answerType.TF){

	}
	else{
		//do numeric type functions.
	}
};

/**
 * All of the final functions will be for the visualization functions. They will recieve the data,
 * manipulate it and then in that same function will display it in the front end and if its possible to 
 * database. These functions will be set up so that they can take in x and y values.
 */

 visualizer.prototype.basic_line = function(x,y){
 	require('plotly')(username, api_key);

	var trace1 = {
	  x: x
	  y: [10, 15, 13, 17],
	  type: "scatter"
	};
	var trace2 = {
	  x: [1, 2, 3, 4],
	  y: [16, 5, 11, 9],
	  type: "scatter"
	};
	var data = [trace1, trace2];
	var graphOptions = {filename: "basic-line", fileopt: "overwrite"};
	plotly.plot(data, graphOptions, function (err, msg) {
	    console.log(msg);
	})
 };

//These scripts are needed for the tree chart.
<script src="http://code.highcharts.com/highcharts.js"></script>
<script src="http://code.highcharts.com/modules/heatmap.js"></script>
<script src="http://code.highcharts.com/modules/treemap.js"></script>
<div id="container"></div>


// this is the tree chart function used in need values for a,b,c,d
//need to figure out how to get these values
visualizer.prototype.treemap = function(a,b,c,d){
    $('#container').highcharts({
        colorAxis: {
            minColor: '#FFFFFF',
            maxColor: Highcharts.getOptions().colors[0]
        },
        series: [{
            type: "treemap",
            layoutAlgorithm: 'squarified',
            data: [{
                name: 'A',
                value: a,
                colorValue: 1
            }, {
                name: 'B',
                value: b,
                colorValue: 2
            }, {
                name: 'C',
                value: c,
                colorValue: 3
            }, {
                name: 'D',
                value: d,
                colorValue: 4
            }
            }]
        }],
        title: {
            text: 'Highcharts Treemap'
        }
    });
}
 	

















