var express = require('express');
var app = express();

app.get('/:nombreamerica',function(req, res) {
	// body...
	if (req.params.nombreamerica == "Cristobal Colon"){
		res.send('La respuesta es correcta');
	}else{
		res.send('La respuesta es Cristobal Colon');
	}
});

app.listen(8000);