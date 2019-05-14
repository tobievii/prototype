var kue = require('kue')
    , jobs = kue.createQueue();

jobs.process('email', 10, function (job, done) {
    //job.progress(i, 10);
    console.log(job.data);
    setTimeout(function () {
        console.log('sent email');
        try {
            done();
            throw new Error('some problem happened');
        }
        catch (err) {
            done(err);
        }
    }, 3000);
});