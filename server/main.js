import { Mongo } from "meteor/mongo";

Leontien = new Mongo.Collection( "leontien" );
Leontien.insert( { foo: "bar" } );


Meteor.publish( "leontien", function() {
  return Leontien.find( {} );
} );

var net = Npm.require( "net" );

// list all possible states of a screen
var listOfStates = [ "slidesstarted", "slidesended", "showstarted", "featurestarted", "intermissionstarted", "intermissionended", "endcreditsstarted", "showended" ];

// then, set- and fire up a tcp server
var port = 13010, server = net.createServer( Meteor.bindEnvironment( function ( socket ) {
  // with a listener that processes the commands
  socket.addListener( "data", Meteor.bindEnvironment( function ( message ) {
    // split the senders ip-address in four strings
    var sender = socket.remoteAddress.split( "." );
    // and calculate the screen based on the AAM standard ip-mapping and the last number of the ip-address
    var screen = ( parseInt( sender[ 3 ], 10 ) - 10 ) / 16;

    // format the message to a string without spaces and split it at the optional @ sign
    var status = message.toString().replace( /\s/g, "" ).split( "@" );

    if ( status.length  == 2 ) {
      // if the @ sign was provided, a screen number was given
      var screen = parseInt( status[ 1 ], 10 );
    }

    status = status[ 0 ].toLowerCase();

    // finally, determine the action based on the given status
    if ( ( listOfStates.indexOf( status ) !== -1 ) && ( screen % 1 === 0 ) ) {
      Leontien.upsert( { screen: screen }, { $set: {
        state: status,
        lastChange: new Date()
      } } );
    }
    
  } ) );

} ) ).listen( port );

// and put a friendly message on the terminal
console.log( "Leontien is listening on port " + port );
