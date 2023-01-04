import React from 'react';
import { nanoid } from 'nanoid';
import Card from './Card';

const Main = () => {
  const [pokemonData, setPokemonData] = React.useState(() => {return []})
  const [score, setScore] = React.useState(0);
  const [bestScore, setBestScore] = React.useState(0);
  const [game, setGame] = React.useState(false);

  React.useEffect(() => {
    const loadData = async () =>{
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=100")
      const data = await response.json();
      const resultsArray = pickCards(data.results);
      const parsedData = parsePokemonData(resultsArray);
      const finalResult = [];
      (await parsedData).forEach(entry => finalResult.push(entry))
      setPokemonData(finalResult)
    }

    loadData()

  }, [game]);

  const pickCards = (data) =>{
    const length = 4;
    let cardsArray = [];
    for(let i = 0; i < length; i++){
      const rng = Math.floor((Math.random() * data.length))
      cardsArray.push(data[rng])
    }
    return cardsArray;
  }

  const parsePokemonData = async (data) =>{

    const urls = data.map(entry => {return entry.url})
    const names = data.map(entry => {return entry.name})
 
    const sprites = getSprites(urls);
    const spritesArray = [];
    (await sprites).forEach(sprite => spritesArray.push(sprite))

    let result = []
    for(let i = 0; i < names.length; i++){
      result.push({id:nanoid(), name: names[i], photo:spritesArray[i], selected:false})
    }

    return result;
  }

  const getSprites = async (data) =>{
    const pokemonSprites = await Promise.all(data.map(async entry =>{
      const response = await fetch(entry);
      const data =  await response.json()
      return data.sprites.other["official-artwork"].front_default;
    }))

    return pokemonSprites;
  }


  const toggleSelected = (cardId) =>{
    const clicked = pokemonData.find(element => element.id === cardId)
    if(clicked.selected === true){
      setScore(0);
      setGame(prevGame => {return !prevGame})
      checkBestScore(score, bestScore)
    }else{
      setPokemonData(prevData => {
        return prevData.map(item =>{
          return item.id === cardId ? {...item, selected: true} : item
        })
      })
      shuffleCards(pokemonData);
      setScore(score + 1);
    }
  }

  const checkBestScore = (current, best) =>{
    if(current > best){
      setBestScore(current)
    }
  }

  const shuffleCards = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array
  }
   
  const cards = pokemonData.map(data => {
    return (
      <Card 
        key={data.id} 
        id={data.id} 
        name={data.name} 
        photo={data.photo} 
        selected={data.selected} 
        toggleSelected={() => toggleSelected(data.id)}
        />)
      })

  return (
    <main>
      <div className="score">
        <h1>Current: {score}</h1>
        <h1>Best: {bestScore}</h1>
      </div>
      <div className="cards">
        {cards}
      </div>
    </main>
  );
}

export default Main;
