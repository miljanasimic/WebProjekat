export class Knjiga{
    constructor(id,naziv,autor,brStrana,godIzdavanja,kolicina,red,pozUredu){
        this.id=id;
        this.naziv=naziv;
        this.autor=autor;
        this.brStrana=brStrana;
        this.godIzdavanja=godIzdavanja;
        this.kolicina=kolicina;
        this.red=red;
        this.pozUredu=pozUredu;
        this.miniKontejner=null;
    }
    osnovneInfo(){
        this.miniKontejner.innerHTML="";
        let naslov=document.createElement("label");
        naslov.innerHTML=this.naziv;
        naslov.className="naslov";
        this.miniKontejner.appendChild(naslov);
        naslov=document.createElement("label");
        naslov.innerHTML="Autor: "+this.autor;
        naslov.className="naslov";
        this.miniKontejner.appendChild(naslov);
    }
    crtajKnjigu(host){
        this.miniKontejner=document.createElement("div");
        this.miniKontejner.className="knjiga";
        this.miniKontejner.innerHTML="Prazno";
        this.miniKontejner.style.alignContent="center";
        host.appendChild(this.miniKontejner);
    }
    dugmeInfo(){
        const dugmeInfo=document.createElement("button");
        dugmeInfo.innerHTML="Prikaži informacije";
        dugmeInfo.className="dugmeInfo";
        this.miniKontejner.appendChild(dugmeInfo);
        dugmeInfo.onclick=(ev)=>{
            console.log(this.id);
            fetch("https://localhost:5001/Biblioteka/PreuzmiKnjige").then(p => {
             p.json().then(knjige => {
                 knjige.forEach(k=>{
                     if(k.naziv==this.naziv){
                        const info=`Naziv knjige: ${k.naziv}\n Autor: ${k.autor}\n Broj strana: ${k.brStrana}\n Godina izdavanja: ${k.godIzdavanja}\n Trenutno na stanju: ${k.kolicina} `;
                        alert(info);
                     }
                   })
              });
           });
            
        }
    }
    
    postaviBoju(naziv) {
        const firstAlphabet = naziv.charAt(0).toLowerCase();
        const asciiCode = firstAlphabet.charCodeAt(0);
        const colorNum = asciiCode.toString() + asciiCode.toString() + asciiCode.toString();
       
        var num = Math.round(0xffffff * parseInt(colorNum));
        var r = num >> 16 & 255;
        var g = num >> 8 & 255;
        var b = num & 255;
        this.miniKontejner.style.backgroundColor="rgb("+r+", "+b+", "+g+")";
    }
    dodajNaPolicu(id,naziv,autor,brStrana,godIzdavanja,kolicina,red,poz){
        this.id=id;
        this.naziv=naziv;
        this.autor=autor;
        this.brStrana=brStrana;
        this.godIzdavanja=godIzdavanja;
        this.kolicina=kolicina;
        this.red=red;
        this.pozUredu=poz;
        this.osnovneInfo();
        this.dugmeInfo();
        this.postaviBoju(this.naziv); 
    }
    azurirajKolicinu(novaKolicina){
        this.kolicina=novaKolicina;
        this.osnovneInfo();
        this.dugmeInfo();
        this.postaviBoju(this.naziv);     
    }
    obrisi(){
        this.naziv=" ";
        this.autor=" ";
        this.brStrana=0;
        this.godIzdavanja=0;
        this.kolicina=0;
        this.miniKontejner.style.backgroundColor="rgb(238, 231, 165)";
        this.miniKontejner.innerHTML="Prazno";
        console.log(this);
    }
}