import Knex from 'knex';
export async function seed(knex: Knex) {
   await knex('items').insert( [ 
        { title:'Lânpadas', image:'lampadas.svg'},
        { title:'Pilhas', image:'baterias.svg'},
        { title:'Papéis e Papelão', image:'papeis-papelao.svg'},
        { title:'Resíduos Eletrõnicos', image:'eletronicos.svg'},
        { title:'Resíduos Orgânicos', image:'organicos.svg'},
        { title:'Óleo de Cozinha', image:'oleo.svg'},
    ])
}