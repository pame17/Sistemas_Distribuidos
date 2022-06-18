create keyspace prueba with replication = {'class': 'NetworkTopologyStrategy', 'replication_factor': '3'};

use prueba;

CREATE TABLE prueba.paciente (
  id UUID PRIMARY KEY,
  nombre text,
  apellido text,
  rut text,
  email text,
  fecha_nacimiento text
);

CREATE TABLE prueba.recetas (
  id UUID PRIMARY KEY,
  id_paciente UUID,
  comentario text,
  farmacos text,
  doctor text
);