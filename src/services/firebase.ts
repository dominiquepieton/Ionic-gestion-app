import firebase from "firebase";
import "firebase/database";

const config = {
    apiKey: "AIzaSyBgmbuUrcGpLMEf5wDo4zW2r2re-oBbihY",
    authDomain: "app-compte-e08c1.firebaseapp.com",
    databaseURL: "https://app-compte-e08c1-default-rtdb.firebaseio.com",
    projectId: "app-compte-e08c1",
    storageBucket: "app-compte-e08c1.appspot.com",
    messagingSenderId: "392006358311",
    appId: "1:392006358311:web:548d4caf787f7f90fec502",
    measurementId: "G-8855Z8CRK5"
 };

firebase.initializeApp(config)

export default firebase.database()