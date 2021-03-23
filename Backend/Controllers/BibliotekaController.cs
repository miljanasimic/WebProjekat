using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BibliotekaController : ControllerBase
    {
        public BibliotekaContext Context { get; set; }

        public BibliotekaController(BibliotekaContext context)
        {
            Context = context;
        }

        [Route("PreuzmiBiblioteke")]
        [HttpGet]
        public async Task<List<Biblioteka>> PreuzmiBiblioteke()
        {
            return await Context.Biblioteke.Include(p => p.Odeljenja).ToListAsync();
        }

        [Route("UpisiOdeljenje/{idBiblioteke}")]
        [HttpPost]
        public async Task<IActionResult> UpisiOdeljenje(int idBiblioteke, [FromBody] Odeljenje odeljenje)
        {
            var bib = await Context.Biblioteke.FindAsync(idBiblioteke);
            odeljenje.Biblioteka = bib;                   
            var odlj = Context.Odeljenja.Where(o=>o.Naziv==odeljenje.Naziv).FirstOrDefault();
            if(odlj!=null)
            {
                return StatusCode(406);
            }
            else if(odeljenje.BrojRedova<1||odeljenje.BrPolicaPoRedu<1)
            {
                return StatusCode(407);
            }
            else
            {
                Context.Odeljenja.Add(odeljenje);
                await Context.SaveChangesAsync();
                return Ok();
            }
                     
        }

        [Route("PreuzmiOdeljenja/{idBiblioteke}")]
        [HttpGet]
        public async Task<List<Odeljenje>> PreuzmiOdeljenja(int idBiblioteke)
        {
            return await Context.Odeljenja.Where(odeljenje=>odeljenje.Biblioteka.ID==idBiblioteke).Include(odlj=>odlj.Knjige).ToListAsync();
        }

        [Route("UpisiKnjigu/{idOdeljenja}")]
        [HttpPost]
        public async Task<IActionResult> UpisiKnjigu(int idOdeljenja, [FromBody] Knjiga knjiga)
        {
            var odlj = await Context.Odeljenja.FindAsync(idOdeljenja);
            knjiga.Odeljenje = odlj;          
            if (Context.Knjige.Any(p => p.Naziv == knjiga.Naziv && (p.Red != knjiga.Red || p.PozUredu != knjiga.PozUredu)))
            {
                var xy = Context.Knjige.Where(p => p.Naziv == knjiga.Naziv).FirstOrDefault();
                return BadRequest(new { X = xy?.Red, Y = xy?.PozUredu });//knjiga postoji na drugoj lokaciji
            }
            var pozicija = Context.Knjige.Where(p => p.Odeljenje.ID==idOdeljenja && p.Red == knjiga.Red && p.PozUredu == knjiga.PozUredu).FirstOrDefault();

            if (pozicija != null)
            {
                if (pozicija.Naziv != knjiga.Naziv)
                {
                    return StatusCode(406);//na ovoj lokaciji je druga knjiga, probajte na nekoj drugoj
                }
                else
                {
                    return StatusCode(407);//ovde je da knjiga, mozete da azurirate kolicinu
                }
            }
            if(knjiga.BrStrana<15)
               return StatusCode(409);
            else if(knjiga.Kolicina<1)
                return StatusCode(410);

            Context.Knjige.Add(knjiga);
            await Context.SaveChangesAsync();
            return Ok();                     
        } 
        [Route("IzmeniKnjigu/{idOdeljenja}")]
        [HttpPut]
        public async Task<IActionResult> IzmeniKnjigu(int idOdeljenja,[FromBody] Knjiga knjiga)
        {
            if(knjiga.Kolicina<1)
                return StatusCode(406);
            var k = Context.Knjige.Where(p=>p.Odeljenje.ID==idOdeljenja && p.Red==knjiga.Red && p.PozUredu==knjiga.PozUredu).FirstOrDefault();
            if(k!=null)
            {
                k.Kolicina=knjiga.Kolicina;
                Context.Update<Knjiga>(k);
                await Context.SaveChangesAsync();
                return Ok();
            }
            else
                return StatusCode(404);
            
        }       
        [Route("ObrisiKnjigu/{idOdeljenja}")]
        [HttpDelete]
        public async Task<IActionResult> ObrisiKnjigu(int idOdeljenja,[FromBody]Knjiga knjiga)
        {
             var k = Context.Knjige.Where(p=>p.Odeljenje.ID==idOdeljenja && p.Red==knjiga.Red && p.PozUredu==knjiga.PozUredu).FirstOrDefault();
            if(k!=null)
            {
                Context.Knjige.Remove(k);    
                await Context.SaveChangesAsync();
                return Ok();
            }
            else
                return StatusCode(404);
        }

        [Route("PreuzmiKnjige")]
        [HttpGet]
        public async Task<List<Knjiga>> PreuzmiKnjige()
        {
            return await Context.Knjige.ToListAsync();
            
        }        
    }
}
