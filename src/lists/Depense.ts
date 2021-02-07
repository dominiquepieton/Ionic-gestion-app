export class Depense {
    description: string;
    montant: string;
    key: string;

    constructor(description: string, montant: string, key?: string) {
        this.description = description;
        this.montant = montant;
        if (key == null) {
            this.key = "";
        }else {
            this.key = key;
        }
        
    }

}