-- Insert demo contractors
INSERT INTO contractors (
  name, city, region, verified, financially_healthy,
  full_guidance_premiums, offers_roof, offers_facade,
  offers_insulation, offers_solar, avg_project_value_min,
  avg_project_value_max, avg_projects_per_year, rating, notes
) VALUES
  (
    'Dak & Gevel BV',
    'Antwerpen',
    'Antwerpen',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    FALSE,
    15000,
    35000,
    120,
    4.7,
    'Gespecialiseerd in dak- en gevelrenovatie met focus op energie-efficiëntie, isolatie en premie-optimalisatie.'
  ),
  (
    'Isolatie+ Collectief',
    'Leuven',
    'Vlaams-Brabant',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    FALSE,
    12000,
    28000,
    85,
    4.6,
    'Collectief van isolatiespecialisten die je volledige schil aanpakken voor een lager energieverbruik en betere EPC-score.'
  ),
  (
    'RenovaPro',
    'Gent',
    'Oost-Vlaanderen',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    18000,
    45000,
    95,
    4.8,
    'Full-service renovatiebedrijf met specialisatie in totaalrenovaties en energie-optimalisatie.'
  );
