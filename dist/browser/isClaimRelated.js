'use strict';var _=require("lodash"),_require=require("./claim/Claim"),definitions=_require.definitions,Claim=_require.Claim,vcDefinitions=require("./creds/definitions");function isClaimRelated(a,b,c){var d=b.substring(b.indexOf("-")+1,b.lastIndexOf("-")),e=definitions.find(function(a){return a.identifier===d});if(e){var f=Claim.getAllProperties(d);if(_.includes(f,a)){var g=vcDefinitions.find(function(a){return a.identifier===c});if(g)return _.includes(g.depends,d);throw new Error("Credential identifier does not exist")}else throw new Error("Claim property path does not exist on UCA definitions")}else throw new Error("UCA identifier does not exist")}module.exports=isClaimRelated;