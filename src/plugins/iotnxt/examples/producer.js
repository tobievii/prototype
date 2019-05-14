var kue = require('kue')
    , cluster = require('cluster')
    , jobs = kue.createQueue();

var sequence = 0;

setInterval(
    function () {
        sequence += 1;
        (function (sequence) {
            var job = jobs.create('email', {
                title: 'Hello #' + sequence
                , to: 'ds.sikor@gmail.com'
                , body: 'Hello World'
            }).attempts(5).priority('high').save();

            job.on('complete', function () {
                console.log('job ' + sequence + ' completed!')
            });

            job.on('failed', function () {
                console.log('job ' + sequence + ' failed!')
            });

            job.on('progress', function (percentComplete) {
                console.log('job' + sequence + ' is ' + percentComplete + '% complete');
            });

        })(sequence);
    }
    , 1000
);