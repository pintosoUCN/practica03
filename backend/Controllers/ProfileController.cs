using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/profile")]
public class ProfileController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProfileController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        try
        {
            var profile = await _context.Profile
                .Include(p => p.Frameworks)
                .Include(p => p.Hobbies)
                .FirstOrDefaultAsync();

            if (profile == null)
            {
                return NotFound("No se encontró ningún perfil.");
            }

            return Ok(profile);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error al obtener el perfil: {ex.Message}");

            var profileData = new
        {
            Name = "Joaquin",
            Lastname = "Pinto",
            Email = "joaquin.pinto@alumnos.ucn.cl",
            City = "Antofagasta",
            Country = "Chile",
            Summary = "Desarrollador de software apasionado",
            Instagram = "Joaquin",
            Facebook = "Joaquin",
            YearsOld = 22,
            Frameworks = new[]
            {
                new { Name = "React", Level = "Avanzado", Year = 2022 },
                new { Name = "ASP.NET Core", Level = "Intermedio", Year = 2022 },
                // Agrega más frameworks según sea necesario
            },
            Hobbies = new[]
            {
                new { Name = "Senderismo", Description = "Explorar la naturaleza" },
                new { Name = "Fotografía", Description = "Capturar momentos especiales" },
                // Agrega más hobbies según sea necesario
            }
        };

            return StatusCode(200, profileData);
        }
    }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] Profile profile)
        {
            if (profile == null || id != profile.ProfileId)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Bad Request",
                    Detail = "El perfil no puede estar vacío y el ID debe coincidir.",
                    Status = 400,
                });
            }

            try
            {
                // Cargar el perfil existente desde la base de datos.
                var existingProfile = await _context.Profile
                    .Include(p => p.Frameworks)
                    .Include(p => p.Hobbies)
                    .FirstOrDefaultAsync(p => p.ProfileId == id);

                if (existingProfile == null)
                {
                    return NotFound("Perfil no encontrado.");
                }

                // Actualizar solo las propiedades principales del perfil.
                existingProfile.Name = profile.Name;
                existingProfile.Lastname = profile.Lastname;
                existingProfile.Email = profile.Email;
                existingProfile.City = profile.City;
                existingProfile.Country = profile.Country;
                existingProfile.Summary = profile.Summary;
                existingProfile.Instagram = profile.Instagram;
                existingProfile.Facebook = profile.Facebook;
                existingProfile.Age = profile.Age;

                // Actualizar los frameworks existentes o agregar nuevos.
                foreach (var framework in profile.Frameworks)
                {
                    var existingFramework = existingProfile.Frameworks
                        .FirstOrDefault(f => f.FrameworkId == framework.FrameworkId);

                    if (existingFramework != null)
                    {
                        // Actualizar framework existente
                        existingFramework.Name = framework.Name;
                        existingFramework.Level = framework.Level;
                        existingFramework.Year = framework.Year;
                    }
                    else
                    {
                        // Agregar nuevo framework
                        existingProfile.Frameworks.Add(new Framework
                        {
                            Name = framework.Name,
                            Level = framework.Level,
                            Year = framework.Year
                        });
                    }
                }

                // Actualizar los hobbies existentes o agregar nuevos.
                foreach (var hobby in profile.Hobbies)
                {
                    var existingHobby = existingProfile.Hobbies
                        .FirstOrDefault(h => h.HobbyId == hobby.HobbyId);

                    if (existingHobby != null)
                    {
                        // Actualizar hobby existente
                        existingHobby.Name = hobby.Name;
                        existingHobby.Description = hobby.Description;
                    }
                    else
                    {
                        // Agregar nuevo hobby
                        existingProfile.Hobbies.Add(new Hobby
                        {
                            Name = hobby.Name,
                            Description = hobby.Description
                        });
                    }
                }
                // Guardar los cambios en la base de datos.
                await _context.SaveChangesAsync();

                return Ok(existingProfile);
            }
            catch (Exception ex)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Error",
                    Detail = $"Error al actualizar el perfil: {ex.Message}",
                    Status = 500,
                });
            }
        }


}
