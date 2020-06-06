import knex from '../database/connection'
import {Request,Response} from 'express'

class PointsController {
    async index(request:Request , response:Response){
        // (query params)
        const {city , uf, items} = request.query ;
        
        const parseItems = String(items).split(',').map(item => Number(item.trim()));
        
        const points = await knex('points')
         .join('pont_items','points.id', "=", 'pont_items.point_id')
         .whereIn('pont_items.item_id', parseItems)
         .where('city', String(city))
         .where('uf', String(uf))
         .distinct()
         .select('points.*')
        

    return response.json(points)

    }
    async show(request:Request , response:Response){
        //params trazido pela rota obrigatorio 
        const { id } = request.params


        const point = await knex('points').where('id', id).first();
        if(!point) {
            return response.status(400).json({message:"point not falt"})
        }
        const items =await knex('items').join('pont_items', "items.id",'=', 'pont_items.item_id').where('pont_items.item_id',id)
        return response.json({point ,items})
    }
    async create(request:Request , response:Response) {
        const{ 
            name,
            email, 
            whatsapp, 
            latitude,
             longitude,
             city,
             uf,
             items } = request.body;
    const trx = await knex.transaction();     
    const point = {
        image :'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
         name,
         email, 
         whatsapp, 
         latitude, 
         longitude,
         city,
         uf
    }  
     const insertedIds = await trx('points').insert(point);
    
        const point_id = insertedIds[0]
        const pointItems = items.map( (item_id: number) =>{
            return {
                item_id,
                point_id,
            }
        })
    
         await trx('pont_items').insert(pointItems)

         await trx.commit();

        return response.json({
            id:point_id,
            ...point,
        });
    }
}


export default PointsController;