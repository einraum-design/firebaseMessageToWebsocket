

module.exports = {
  PROJECT_ID: 'sitzkistecontroller',
  DOMAIN: 'sitzkistecontroller.firebaseapp.com',
  API_KEY: 'AIzaSyAAO1V1dGQGTyZE5ApSO-NBw7w6IS7P76s',

  firebase: require('firebase'),
  
  database: null,
  googleImg: null,

  initialize: function (guid) {
    this.firebase.initializeApp({
      apiKey: this.API_KEY,
      authDomain: this.DOMAIN,

      databaseURL: `https://${this.PROJECT_ID}.firebaseio.com`,
      messagingSenderId: guid
    });


    this.database = this.firebase.database();

    //this.updateData('/self', { lastStarted: Math.floor(new Date() / 1000) });
    //this.deleteImageResults();
    console.log('Firebase initialized with id: '+Math.floor(new Date() / 1000));
  },

  connectClient: function (client, value) {
    if (value === true) {
      this.updateData('/connections/', { [client]: true });
    } else {
      this.updateData('/connections', { [client]: false });
    }
  },



  readData: function (ref) {
    let result = 'test';

    this.database.ref(ref).once('value').then(snapshot => {
        //console.log(snapshot.val());
        result = snapshot.val();
    });

    return result;
  },


  listenToKnowledgeSearchQuery: function (Knowledge) {

    var knowledgeSearchQuery = this.database.ref('knowledge/knowledgeSearchQuery');
    knowledgeSearchQuery.on('value', function(snapshot) {
      console.log("KnowledgeSearchQuery has changed");
      if(snapshot.val()!=""){
        Knowledge.request(snapshot.val());
      }
    });
  },




  updateData: function (ref, data) {
    this.database.
      ref(ref).
      update(data);
  },



  writeImageResults: function (imageId, url, type, palette) {
    if(palette!=undefined){
      this.database.ref('images/imageUrls/' + imageId).set({
      'palette':palette,
      'url': url,

      });
    }

  },

  writeKnowledgeResults: function (knowledgeID,name, description,detailedDescription,imageUrl) {
    this.database.ref('knowledge/knowledgeResults/'+knowledgeID).set({
      "name":name,
      "desc":description,
      "detailed":detailedDescription,
      "image":imageUrl,
    });
  },


  deleteEventData: function () {
    this.database.ref('events/aiEvents/').remove();
  },
  
  writeTrendsResults:function(trendID,topicTitle,topicType){
    this.database.ref('trends/trendsResults/' + trendID).set({
    'title':topicTitle,
    'type': topicType,

    });
  }

};
