
module.exports.SEED = '@super-sign@json';
module.exports.CLIENT_ID = '984943350378-c73fqfdugtvc8g73lirqnruf9h9o0b4t.apps.googleusercontent.com';

var Pusher = require('pusher');
module.exports.PUSHER = new Pusher({
    appId: '600800',
    key: '0b51b592195d4a29c792',
    secret: '6f067c094d956820f602',
    cluster: 'us2',
    encrypted: true
});

// Ejemplo de config externa del Pusher
// PUSHER_APP_ID=[PUSHER_APP_ID]
// PUSHER_API_KEY=[PUSHER_API_KEY]
// PUSHER_API_SECRET=[PUSHER_API_SECRET]
// PUSHER_APP_CLUSTER=[PUSHER_APP_CLUSTER]