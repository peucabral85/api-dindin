create table usuarios(
  id serial primary key,
  nome varchar(150) not null,
  email varchar(150) not null unique,
  senha text not null
);

create table categorias(
  id serial primary key,
  descricao text not null
);

create table transacoes(
  id serial primary key,
  descricao text not null,
  valor integer not null,
  data timestamp not null,
  categoria_id int not null references categorias(id),
  usuario_id int not null references usuarios(id),
  tipo varchar(7) not null
);  