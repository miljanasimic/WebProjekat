using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    [Table("Knjiga")]
    public class Knjiga
    {
        [Key]
        [Column("ID")]
        public int ID { get; set; }

        [Column("Naziv ")]
        [MaxLength(100)]
        public string Naziv { get; set; }

        [Column("Autor")]
        [MaxLength(50)]
        public string Autor { get; set; }

        [Column("BrStrana")]
        public int BrStrana { get; set; }

        [Column("GodIzdavanja")]
        public int GodIzdavanja { get; set; }

        [Column("Kolicina")]
        public int Kolicina { get; set; }

        [Column("Red")]
        public int Red { get; set; }

        [Column("PozUredu")]
        public int PozUredu { get; set; }

        [JsonIgnore]
        public Odeljenje Odeljenje { get; set; }
       

    }
}
