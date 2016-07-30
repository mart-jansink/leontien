import { Mongo } from "meteor/mongo";
import { Template } from "meteor/templating";
import { ReactiveVar } from "meteor/reactive-var";

import "./main.html";

Leontien = new Mongo.Collection( "leontien" );

Template.leontien.onCreated( function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
} );

Template.leontien.helpers( {
  duration() {
    return Template.instance().counter.get();
  },

  screens() {
    return [ { label: 1 }, { label: 2 }, { label: 1 }, { label: 2 }, { label: 1 }, { label: 2 }, { label: 1 }, { label: 2 }, { label: 1 }, { label: 10 }  ];
  }
} );
