<template>
  <ion-page>
    <ion-content :fullscreen="true" color="medium">
      <ion-header collapse="condense">
        <ion-toolbar color="warning">
          <ion-title size="small">Mon budget app</ion-title>
        </ion-toolbar>
      </ion-header>
      <div id="container">
      <ion-grid>
        <ion-row>
          <ion-col size-xs="12" size-sm="12" size-md="6" size-lg="6" size-xl="6" offset-md="3">
            <ion-item v-if="newsolde < 0" color="danger">mon solde: {{ newsolde }}</ion-item>
            <ion-item v-else color="success">mon solde: {{ newsolde }}</ion-item>
            <ion-card>
              <ion-card-header>Nouvelle depense</ion-card-header>
              <ion-card-content>  
                <ion-item>
                  <ion-label>nom:</ion-label>
                  <ion-input type="text" :value="description" @ionChange="description= $event.target.value" clear-input="true"></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label>montant :</ion-label>
                  <ion-input type="number" :value="montant" @ionChange="montant= $event.target.value" clear-input="true"></ion-input>
                </ion-item>
                <ion-row class="ion-justify-content-end">
                  <ion-button fill="outline" color="danger" @click="clear" size="small" class="ion-margin-vertical">
                    <ion-icon name="close-circle-outline"></ion-icon>
                    Clear
                  </ion-button>
                  <ion-button color="warning" class="ion-margin-vertical ion-margin-start" size="small" @click.prevent="addDepense">
                    <ion-icon name="add-sharp"></ion-icon>
                    Ajouter Dépense
                  </ion-button>
                </ion-row>    
              </ion-card-content> 
            </ion-card>   
          </ion-col>
        </ion-row>
        <ion-row class="ion-justify-content-center" v-if="depense.length > 0">
          <ion-col size-xs="12" size-sm="12" size-md="6" size-lg="6" size-xl="6">
            <ion-card>
              <ion-card-content>
                <ion-list   v-for="item in depense" :key="item.montant">
                  <ion-item>
                    <ion-label class="ion-padding-horizontal">
                    {{ item.description }} : {{ item.montant }} €
                    <ion-button color="danger" class="ion-margin-vertical" size="small" v-on:click="clearOneItem(item.key)">
                    <ion-icon name="close-circle-outline"></ion-icon>
                    </ion-button>
                    </ion-label>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>
            <ion-item v-if="depense.length > 0">
                  <ion-label class="ion-text-start">Total : {{ depenseTotal }} €</ion-label>
            </ion-item>
          </ion-col>
        </ion-row>
      </ion-grid>     
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonInput, IonLabel, IonCard, IonGrid, IonRow, IonCol,
  IonButton, IonIcon, IonCardHeader, IonCardContent, IonList, alertController } from '@ionic/vue';
import { defineComponent } from 'vue';
import { addIcons } from "ionicons";
import { addSharp, closeCircleOutline, caretBack } from "ionicons/icons";
import { Depense } from "../lists/Depense";
import firebase from "../services/firebase";

addIcons({
  "add-sharp":addSharp,
  "close-circle-outline":closeCircleOutline,
  "caret-back":caretBack
})
export default defineComponent({
  name: 'Home',
  components: { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonInput, IonLabel, IonCard, IonGrid, IonRow,
    IonCol, IonButton, IonIcon, IonCardHeader, IonCardContent, IonList },
  data() {
    return {
      itemRef : firebase.ref().child("items"),
      clearItem: false,
      addItems: false,
      montant: "",
      description: "",
      depense: Array<Depense>()
    }
  },
  computed: {
    depenseTotal() {
      let somme = 0;
      for (const val of this.depense) {
        somme += parseInt(val.montant);
      }
      return somme;
    },
    newsolde() {
      let solde = 1500
      for (const val of this.depense) {
        solde -= parseInt(val.montant);
      }
      return solde;
    }
  },
  methods: {
    clear() {
      this.itemRef.remove();
      this.depense.splice(0, this.depense.length);
    },
    async addDepense() {
      // Vérification de la longueur de la description entrée
      if ( this.description == "" || parseInt(this.montant) < 1) {
        const error = await alertController
        .create({
          header: 'Alert',
          message: "doit avoir un nom ou le nombre non négatif",
          buttons: ['OK'],
          cssClass: 'my-custom-css',
        });
        return error.present();

      } else { 
        // envois des données à firebase 
        const newDepense = new Depense(this.description, this.montant);
        const dbreq = this.itemRef.push(newDepense);
        const newid = dbreq.key
        newDepense.key  = newid as string
        this.depense.push(newDepense)
        console.log(newDepense)
      }  
    },
    clearOneItem(key: string){
        let index = 0;
        for(let i = 0;i<this.depense.length; i++){
            if(this.depense[i].key == key){
              index = i;
            }
        }
        this.depense.splice(index, 1)
        this.itemRef.child(key).remove()
    },
    async allItems() {
      await this.itemRef.once('value', (items) => {
        items.forEach((childItems) => {
          const childData = childItems.val();
          const childKey = childItems.key as string; // caster la valeur en string
          
          const newDepense = new Depense(childData.description, childData.montant, childKey)
          // insere les données dans depense
          this.depense.push(newDepense);
        })
      })
      //console.log(this.depense)
    }
  },
  created: function () {
    this.allItems(); 
  }
});
</script>

<style scoped>
.my-custom-class {
  --background: #e5e5e5;
}
</style>