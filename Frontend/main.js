import { Biblioteka } from "./biblioteka.js"

fetch("https://localhost:5001/Biblioteka/PreuzmiBiblioteke").then(p => {
    p.json().then(data => {
        data.forEach(biblioteka => {
            const b = new Biblioteka(biblioteka.id, biblioteka.naziv,biblioteka.adresa);
            b.crtajBiblioteku(document.body);
            })
        });
 });