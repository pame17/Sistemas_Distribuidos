create keyspace pac with replication = {'class': 'SimpleStrategy', 'replication_factor': '2'};
create keyspace rec with replication = {'class': 'SimpleStrategy', 'replication_factor': '3'};

use pac;
use rec;

CREATE TABLE pac.paciente (
  id UUID PRIMARY KEY,
  nombre text,
  apellido text,
  rut text,
  email text,
  fecha_nacimiento text
);

CREATE TABLE rec.recetas (
  id UUID PRIMARY KEY,
  id_paciente UUID,
  comentario text,
  farmacos text,
  doctor text
);