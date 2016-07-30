import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { createServer } from "net";

Screens = new Mongo.Collection( "screens" );
if ( !Screens.findOne() ) {
  // initiate with 10 screens
  for ( let screen = 1; screen <= 10; screen++ ) {
    Screens.insert( {
      screen,
      state: "showended",
      lastChange: new Date(),
    } );
  }
}

// list all possible states of a show
const states = [
  "showstarted",
  "featurestarted",
  "intermissionstarted",
  "intermissionended",
  "endcreditsstarted",
  "showended"
];

// then, set- and fire up a tcp server
const port = 13010;
createServer( Meteor.bindEnvironment( function( socket ) {
  // with a listener that processes the commands
  socket.addListener( "data", Meteor.bindEnvironment( function( message ) {
    // split the message in a state and the screen number it applies to
    let [ state, screen ] = message.toString().split( "@" );

    // format the state and screen
    state = state.trim().toLowerCase();
    screen = parseInt( screen, 10 );

    if ( ~states.indexOf( state ) && !isNaN( screen ) ) {
      Screens.update( { screen }, { $set: {
        state,
        lastChange: new Date(),
      } } );
    }
    else {
      console.log( `received invalid state '${ state }' and/or screen ${ screen }` );
    }
    
  } ) );
} ) ).listen( port );

// put a friendly message on the terminal
console.log( `Leontien is listening on port ${ port }` );
