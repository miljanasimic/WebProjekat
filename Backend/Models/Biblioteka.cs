using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("Biblioteka")]
    public class Biblioteka
    {
        [Key]
        [Column("ID")]
        public int ID { get; set; }

        [Column("Naziv")]
        [MaxLength(80)]
        public string Naziv { get; set; }

        [Column("Adresa")]
        public string Adresa { get; set; }

        public virtual List<Odeljenje> Odeljenja { get; set; }
    }
}