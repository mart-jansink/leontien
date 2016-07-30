import { Mongo } from "meteor/mongo";
import { Template } from "meteor/templating";

import "./main.html";

Screens = new Mongo.Collection( "screens" );

Template.body.helpers( {
  duration() {
    // get the current server time every 10 seconds
    const now = TimeSync.serverTime( false, 10000 );

    if ( now ) {
      // return the number of minutes that have passed since the last update
      return Math.floor( ( now - this.lastChange ) / 1000 / 60 );
    }

    return 0;
  },

  screens() {
    return Screens.find();
  }
} );
