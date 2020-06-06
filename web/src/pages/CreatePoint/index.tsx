import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react'
import logo from '../../assets/logo.svg';
import {Link, useHistory} from 'react-router-dom'
import { FiArrowDownLeft}  from 'react-icons/fi' 
import {Map ,TileLayer,Marker } from 'react-leaflet'
import{ LeafletMouseEvent} from 'leaflet'
import axios from 'axios'
import api from '../../services/api';


import './styles.css'
import { createUnzip } from 'zlib';

interface Item {
    id:number,
    title: string,
    image_url:string
}

interface IBGEresponse {
    sigla:string,
}

interface IBGECityresponse {
    nome:string,
}

const CreatePoint = ( ) => {
// array ou objeto: manualmente indformar o tipo de variavel 

    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs ] = useState <string[]>([])
    const [cities, setCities ] = useState <string[]>([])

    const [formData, setFormData] = useState({
        name:'',
        email:'',
        whatsapp:'',

    })
    const [initialPosition, setInicialPosition] = useState <[number, number]>([0, 0]);

    const [selectedUf, setSelectegUf] = useState ('0');
    const [selectedCity, setSelectedCity] = useState ('0');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const [selectedPosition, setSelectedPosition] = useState <[number, number]>([0, 0])
   
    const history = useHistory()
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude , longitude}= position.coords;

            setInicialPosition([latitude, longitude])
        });
    },[])
    useEffect(( ) => {
        api.get('items').then( response => {
          setItems(response.data)  
      
        });
    } ,[]);


    useEffect(( )=> {
        axios.get<IBGEresponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(response => {
            const  UfInitials = response.data.map(uf => uf.sigla);
            setUfs(UfInitials)
           
        });
    },[]);

    useEffect( () => {
        //console.log('mudou')

        if(selectedUf ==='0'){
            return
        }
        axios.get<IBGECityresponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
        .then(response => {
            const cityNames= response.data.map( city => city.nome)
            setCities(cityNames) });
    }, [selectedUf]) ;
    
    // guardar estado da variave em um local para ser usado na hora de cadastrar point
    function handleSelectUf(event:ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value
        setSelectegUf(uf);
    }
    function handleSelectCity(event:ChangeEvent<HTMLSelectElement>){
        const city = event.target.value
        setSelectedCity(city);
    }

    // funcao para pegar um local selecionado no mapa pelo usuario 
    function handleMapClick (event : LeafletMouseEvent ){
        setSelectedPosition([ 
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function handaleInputChange (event:ChangeEvent <HTMLInputElement>) {
        //console.log(event.target.name , event.target.value)
        const {name, value} = event.target
        setFormData({ ...formData, [name]:value})
    }
    function handleSelectItem(id:number){
        //console.log("imagem", id)
        const alreadySelected = selectedItems.findIndex(item => item ===id)
        if( alreadySelected >= 0){

            const filterdItems = selectedItems.filter(item => item !== id);

            setSelectedItems(filterdItems)
        }else {
            setSelectedItems([...selectedItems, id]);
        }
        
    }

    async function handleSubmit (event:FormEvent) {
        event.preventDefault()
        //console.log("agorasim ") 
        const { name, email, whatsapp}= formData
        const uf = selectedUf 
        const city = selectedCity
        const [ latitude, longitude] = selectedPosition
        const items = selectedItems

        const data = {
            name,
            email ,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        }
        //console.log(data)
         await api.post('points', data)
         alert("ponto de coleta adicionado")
         history.push('/')
    }
    return (
        <div id="page-create-point" >
            <header>
        <img src={logo} alt="Ecoleta"/>
        <Link to="/">
            <FiArrowDownLeft />
            Voltar Para Home
        </Link>
            </header>

            <form onSubmit={handleSubmit}> 
                <h1>Cadastro do <br/> ponto de coleta </h1>

                <fieldset>
                    <legend>
                        <h2>Dados </h2> 
                    </legend>
                    <div className="field" >
                        <label htmlFor="name"> Nome da entidade </label>
                        <input  type="text" id="name" name="name"  onChange={handaleInputChange} / >
                    </div>


                    <div className="field-group">
                        <div className="field" >
                            <label htmlFor="email"> Email </label>
                            <input  type="email" id="email" name="email" onChange={handaleInputChange} / >
                        </div>
                    <div className="field" >
                        <label htmlFor="whatsapp"> Whatsapp</label>
                        <input  type="text" id="whatsapp" name="whatsapp" onChange={handaleInputChange} / >
                    </div>
                    </div>
                </fieldset>


                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span> Selecione o endereço no mapa </span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick} >
                            
                    <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={initialPosition} />
                     </Map>
                    <div className="field-group">
                        
                    <div className="field">
                        <label htmlFor="uf"> Estado (UF)</label>
                        <select 
                            name="uf"
                            id="uf" 
                            value={selectedUf}
                            onChange={handleSelectUf}
                            > 
                            <option value="0"> Selecione uma UF</option>
                            {ufs.map(uf=> (
                                <option value={uf}> {uf}</option>
                            ) ) }
                            
                        </select>
                        </div>


                        <div className="field">
                            <label htmlFor="city"> Cidade</label>
                            <select 
                                name="city"
                                 id="city" 
                                 onChange={handleSelectCity}
                                 value={selectedCity}
                                 >
                                <option value="0"> Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}> {city} </option>
                                ) ) }
                            </select>
                        </div>
                    </div>
                </fieldset>
                
                <fieldset>
                    <legend>
                        <h2>Itens de coleta </h2>
                        <span> Selecione o endereço no mapa</span>
                    </legend>

                    <ul className="items-grid">
                      {items.map(item => (
                        <li 
                        key={item.id}  
                        className={selectedItems.includes(item.id)?'selected':'' } 
                        onClick={ () => handleSelectItem(item.id)}>
                        <img src={item.image_url} alt={item.title}/>
                        <span>{item.title}</span>
                       </li>
                      ) ) }
                       
                     
                    </ul>
                </fieldset>
                    <button type="submit">Cadastrar ponto de coleta </button>
            </form>
        </div>

    )
    
}

export default CreatePoint;