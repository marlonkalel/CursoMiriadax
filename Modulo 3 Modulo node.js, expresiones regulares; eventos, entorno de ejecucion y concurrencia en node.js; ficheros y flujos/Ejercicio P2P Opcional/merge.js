var fs = require('fs');
var i;

for(i = 3; i < process.argv.length; i++)
{
    //el fichero es process.argv[i];
    fs.readFile(
        process.argv[i],
        function(err, data){
            fs.appendFile(
                process.argv[2],
                data,
                function(err){
                    if(err){
                        throw err;
                    }
                    console.log('file appened');
                }
            );
        }
    );
}