import { Mongo } from "meteor/mongo";

Leontien = new Mongo.Collection( "leontien" );
Leontien.insert( { foo: "bar" } );
