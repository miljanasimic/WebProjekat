import { Knjiga } from "./knjiga.js";
export class Odeljenje{
    constructor(id,naziv,brRedova,brPolicaPoRedu) {
        this.id=id;
        this.naziv=naziv;
        this.brRedova=brRedova;
        this.brPolicaPoRedu=brPolicaPoRedu;
        this.knjige=[];
        this.kontejner=null;
    }
    dodajKnjigu(k){
        this.knjige.push(k);
    }
    crtajOdeljenje(host){
        if(!host)
            throw new Exception("Roditeljski element ne postoji");
        let info=document.createElement("label");
        info.classList.add("info");
        info.classList.add("nazivOdlj");
        info.innerHTML=this.naziv;
        host.appendChild(info);
        this.kontejner=document.createElement("div");
        this.kontejner.classList.add("kontOdeljenje");
        host.appendChild(this.kontejner);
        const divZaForme=document.createElement("div");
        divZaForme.className="odeljenjeForme";
        this.kontejner.appendChild(divZaForme);
        this.formaDodaj(divZaForme);
        this.formaIzmeni(divZaForme);
        const divZaCrtanje=document.createElement("div");
        divZaCrtanje.className="divZaCrtanje";
        this.kontejner.appendChild(divZaCrtanje);
        this.crtajPolice(divZaCrtanje);
    }
    formaDodaj(host){
        const forma=document.createElement("div");
        host.appendChild(forma);
        forma.classList.add("odeljenjeForme");
        forma.classList.add("fDodaj");
        let labele=["Naziv:","Autor:","Broj strana(min 15):","Godina izdavanja","Količina:"];
        let tipovi=["text","text","number","number","number"];
        let klase=["naziv","autor","brStrana","godIzd","kol"];
        let polje=null;
        let labela=document.createElement("label");
        labela.innerHTML="Unos knjige";
        labela.className="nazivForme";
        forma.appendChild(labela);
        labele.forEach((el,ind)=>{
            labela=document.createElement("label");
            labela.innerHTML=el;
            forma.appendChild(labela);
            polje=document.createElement("input");
            polje.type=tipovi[ind];
            polje.className=klase[ind];
            forma.appendChild(polje);
        })
        let koordinate=["Red:","Pozicija u redu:"];
        let vrednosti=[this.brRedova,this.brPolicaPoRedu];
        klase=["X","Y"];
        let kord=document.createElement("div");
        let el=null;
        forma.appendChild(kord);
        koordinate.forEach((e,ind)=>{
            el=document.createElement("label");
            el.innerHTML=e;
            kord.appendChild(el);
            let sel=document.createElement("select");
            sel.className=klase[ind];
            kord.appendChild(sel);
            for(let i=1;i<=vrednosti[ind];i++)
            {
                el=document.createElement("option");
                el.innerHTML=i;
                el.value=i;
                sel.appendChild(el);
            }
        })
        polje=document.createElement("button");
        polje.className="dugme";
        polje.innerHTML="Dodaj";
        forma.appendChild(polje);
        polje.onclick=(ev)=>{
            const naziv = forma.querySelector(".naziv").value;
            const autor = forma.querySelector(".autor").value;
            const brStrana = parseInt(forma.querySelector(".brStrana").value);
            const godIzd = parseInt(forma.querySelector(".godIzd").value);
            const kolicina = parseInt(forma.querySelector(".kol").value);
            const x=parseInt(forma.querySelector(".X").value);
            const y=parseInt(forma.querySelector(".Y").value);
            console.log(naziv,autor,brStrana,godIzd,kolicina,x,y);
            console.log(this.knjige);
            if(naziv=="")
                alert("Morate da unesete naziv knjige.");
            else if(autor=="")
                alert("Morate da unesete ime i prezime autora.");
            else if(isNaN(brStrana))
                alert("Morate da unesete broj strana.");
            else if(isNaN(godIzd))
                alert("Morate da unesete godinu izdanja.");
            else if(isNaN(kolicina))
                alert("Morate da unesete količinu.");
            else
            {
                fetch("https://localhost:5001/Biblioteka/UpisiKnjigu/" + this.id, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        naziv: naziv,
                        autor:autor,
                        brStrana:brStrana,
                        godIzdavanja:godIzd,
                        kolicina: kolicina,
                        red: x,
                        pozUredu:y
                    })
                }).then(p => {
                    if (p.ok) {
                        this.knjige[(x-1)*this.brPolicaPoRedu+y-1].dodajNaPolicu(0,naziv,autor,brStrana,godIzd,kolicina,x,y);
                    }
                    else if (p.status == 400) {
                        const greskaLokacija = { x: 0, y: 0 };
                        p.json().then(q => {
                            greskaLokacija.x = q.x;
                            greskaLokacija.y = q.y;
                            alert("Ova knjiga već postoji u "+greskaLokacija.x+". redu, na "+greskaLokacija.y+". polici.\nAžurirajte količinu na toj lokaciji ako želite da dodate još knjiga.");
                        });
                    }
                    else if (p.status === 406) {
                        alert("Na ovoj lokaciji se već nalazi neka druga knjiga.\nProbajte da dodate knjigu na drugu lokaciju.");
                    }
                    else if(p.status===407){
                        alert("Knjiga je već na ovoj lokaciji.\nAžurirajte količinu ako želite da dodate još knjiga.");
                    }
                    else if(p.status===409){
                        alert("Knjiga mora da ima minimum 15 strana.");
                    }              
                    else if(p.status===410){
                        alert("Morate dodati bar jednu knjigu.");
                    }
                    else
                        alert("greska");
                });         
            }  
            console.log(this.knjige);            
        }
    }
    formaIzmeni(host){
        const formaIzmeni=document.createElement("div");
        host.appendChild(formaIzmeni);
        formaIzmeni.classList.add("odeljenjeForme");
        formaIzmeni.classList.add("fIzmeni");
        let labelaI=document.createElement("label");
        labelaI.innerHTML="Ažuriranje/Brisanje";
        labelaI.className="nazivForme";
        formaIzmeni.appendChild(labelaI);
        labelaI=document.createElement("label");
        labelaI.innerHTML="Izaberite jednu opciju:";
        formaIzmeni.appendChild(labelaI);
        
        let opcija=null;
        let labela=null;
        let divOpcija=null;
      
        divOpcija = document.createElement("div");
        const opcija1 = document.createElement("input");
        opcija1.type="radio";
        opcija1.name = this.naziv;
        opcija1.value= "a";
        labela = document.createElement("label");
        labela.innerHTML="ažuriranje";
        divOpcija.appendChild(opcija1);
        divOpcija.appendChild(labela);
        formaIzmeni.appendChild(divOpcija);
        const opcija2 = document.createElement("input");
        opcija2.type="radio";
        opcija2.name = this.naziv;
        opcija2.value= "b";
        labela = document.createElement("label");
        labela.innerHTML="brisanje";
        divOpcija.appendChild(opcija2);
        divOpcija.appendChild(labela);
        formaIzmeni.appendChild(divOpcija);
        
        let koordinateI=["Red:","Pozicija u redu:"];
        let vrednostiI=[this.brRedova,this.brPolicaPoRedu];
        let klaseI=["xI","yI"];
        let kord=document.createElement("div");
        let el=null;
        formaIzmeni.appendChild(kord);
        koordinateI.forEach((e,ind)=>{
            el=document.createElement("label");
            el.innerHTML=e;
            kord.appendChild(el);
            let sel=document.createElement("select");
            sel.className=klaseI[ind];
            kord.appendChild(sel);
            for(let i=1;i<=vrednostiI[ind];i++)
            {
                el=document.createElement("option");
                el.innerHTML=i;
                el.value=i;
                sel.appendChild(el);
            }
        })
        el=document.createElement("label");
        el.innerHTML="Nova količina:";
        formaIzmeni.appendChild(el);
        el=document.createElement("input");
        el.type="number";
        el.className="novaKol";
        formaIzmeni.appendChild(el);
        const d=document.createElement("button");
        
        d.innerHTML="Ažuriraj/Obriši";
        formaIzmeni.appendChild(d);
        opcija1.onclick=(ev)=>{
            console.log(opcija1.value);
            d.innerHTML="Ažuriraj";
            formaIzmeni.querySelector(".novaKol").disabled = false;
        }
        opcija2.onclick=(ev)=>{
            console.log(opcija2.value);
            d.innerHTML="Obriši";
            formaIzmeni.querySelector(".novaKol").disabled = true;
            console.log(formaIzmeni.getElementsByClassName("novaKol"));   
        }
        d.onclick=(ev)=>{
            console.log(d.innerHTML);
            const x=parseInt(formaIzmeni.querySelector(".xI").value);
            const y=parseInt(formaIzmeni.querySelector(".yI").value);
            if(d.innerHTML=="Ažuriraj")
            {
                const novaKolicina = parseInt(formaIzmeni.querySelector(".novaKol").value);
                if(isNaN(novaKolicina))
                {
                    alert("Niste uneli novu količinu!");
                    return;
                }
                fetch("https://localhost:5001/Biblioteka/IzmeniKnjigu/" + this.id, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        kolicina:novaKolicina,
                        red: x,
                        pozUredu:y
                    })
                }).then(p => {
                    if (p.ok) {
                        this.knjige[(x-1)*this.brPolicaPoRedu+y-1].azurirajKolicinu(novaKolicina);
                    }
                    else if (p.status == 404) {
                        alert("Na ovoj lokaciji ne postoji nijedna knjiga.");
                    }
                    else if(p.status==406){
                        alert("Nova količina mora da bude bar 1.");
                    }                
                });
            }        
            else if(d.innerHTML=="Obriši")
            {
                fetch("https://localhost:5001/Biblioteka/ObrisiKnjigu/" + this.id, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        red: x,
                        pozUredu:y
                    })
                }).then(p => {
                    if (p.ok) {
                        this.knjige[(x-1)*this.brPolicaPoRedu+y-1].obrisi();
                    }
                    else if (p.status == 404) {
                        alert("Na ovoj lokaciji ne postoji nijedna knjiga.");
                    }                              
                });                
            }
            else
                alert("Niste izabrali nijednu opciju!");
                 
            console.log(this.knjige);
        }
    }
    crtajPolice(host){
        let red=null;
        for(let i=0;i<this.brRedova;i++){
            red=document.createElement("div");
            host.appendChild(red);
            red.className="red";
            for(let j=0;j<this.brPolicaPoRedu;j++){
                this.dodajKnjigu(new Knjiga(0," "," "," ",0,0,i+1,j+1));
                this.knjige[i*this.brPolicaPoRedu+j].crtajKnjigu(red);
            }
        }
    }
}