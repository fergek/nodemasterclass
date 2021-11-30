/*lib to store and edit data*/

var fs = require('fs');
var path = require('path');

// container for the module

var lib = {};

// define base directory for data
lib.baseDir = path.join(__dirname, '/../.data/');

lib.create = function(dir, filename, data, callback){
    // open the file

    fs.open( lib.baseDir + dir + '/' + filename + '.json', 'wx', function(err, filedescriptor){
        if (!err && filedescriptor)
        {
            // data to string
            var stringData = JSON.stringify(data);

            // write and close the file
            fs.writeFile(filedescriptor, stringData, function(err){
                if (!err)
                {
                    fs.close(filedescriptor, function(err){
                        if (!err)
                        {
                            callback(false);
                        }
                        else
                        {
                            callback('error closing the file');
                        }
                    })
                }
                else
                {
                    callback ('Error writing to file');
                }
            })
        }
        else
        {
            callback('cant create the file');
        }
    } );

};


// Read data from file

lib.read = function(dir, filename, callback){
    fs.readFile(lib.baseDir + dir + '/' + filename + '.json', 'utf8', function(err, data)
    {
        callback(err, data);
    });
};


lib.update = function(dir, file, data, callback) {
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', function(err, filedescriptor){
        if (!err && filedescriptor)
        {
            var stringData = JSON.stringify(data);
            fs.truncate(filedescriptor, function(err){
                if (!err)
                {
                    fs.writeFile(filedescriptor, stringData, function(err){
                        if (!err)
                        {
                            fs.close(filedescriptor, function(err){
                                if (err)
                                {
                                    callback('error closing');
                                }
                                else
                                {
                                    callback(false);
                                }
                            })
                        }
                        else
                        {
                            callback('error writing to a file');
                        }
                    })
                }
                else
                {
                    callback ('error truncating file');
                }
            })
        }
        else
        {
            callback('cannot open file. maybe it does not exists');
        }
    })
};


lib.delete = function(dir, filename, callback){
    fs.unlink(lib.baseDir + dir + '/' + filename + '.json', function(err)
    {
        if(!err)
        {
            callback(false);
        }
        else
        {
            callback('error deleting file');
        }
    }
    );
}

// export the module
module.exports = lib;