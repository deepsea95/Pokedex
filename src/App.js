import React, { useEffect, useState } from "react";
import axios from "axios";
import PokemonLogo from "./assets/Pokemon-Logo.png";

function Pokedex() {
  const [pokemon, setPokemon] = useState(null);
  const [search, setSearch] = useState("");
  const [showAllPokemon, setShowAllPokemon] = useState(true);
  const [allPokemon, setAllPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);

  async function getAllPokemon() {
    await axios
      .get("https://pokeapi.co/api/v2/pokemon?limit=151")
      .then((response) => {
        const pokemonList = response.data.results;
        Promise.all(
          pokemonList.map(async (pokemon) => {
            const pokemonData = await axios.get(pokemon.url);
            return {
              name: pokemonData.data.name,
              id: pokemonData.data.id,
              image: pokemonData.data.sprites.front_default,
              weight: pokemonData.data.weight,
              height: pokemonData.data.height,
              types: pokemonData.data.types.map((t) => t.type.name).join(", "),
              stats: pokemonData.data.stats.find((s) => s.stat.name === "hp").base_stat,
              moves: pokemonData.data.moves.map((move) => move.move.name).slice(0,2).join(", ")
            };
          })
        ).then((data) => {
          setAllPokemon(data);
          setFilteredPokemon(data);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    getAllPokemon();
  }, []);

  function handleSearch(event) {
    setSearch(event.target.value);
    const filtered = allPokemon.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredPokemon(filtered);
    setPokemon(null);
  }

  function handlePokemonClick(clickedPokemon) {
    setPokemon(clickedPokemon);
    setShowAllPokemon(false);
  }

  return (
    <React.Fragment>
      <div className="pokedex">
        <nav className="navbar">
          <img src={PokemonLogo} alt="Pokemon logo" className="logo" />
          <div className="search">
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search for a Pokemon..."
            />
          </div>
          <img src={PokemonLogo} alt="Pokemon logo" className="logo" />
        </nav>

        {showAllPokemon && (
          <ul className="pokemon-list">
            {filteredPokemon.map((pokemon) => (
              <li key={pokemon.id} onClick={() => handlePokemonClick(pokemon)}>
                <img src={pokemon.image} alt={pokemon.name} />
                <p>{pokemon.name}</p>
              </li>
            ))}
          </ul>
        )}

        {pokemon && (
          <div className="card">
            <p># {pokemon.id}</p>
            <div className="header">
              <h2>{pokemon.name}</h2>
              <h3>HP {pokemon.stats}</h3>
            </div>
            <img src={pokemon.image} alt={pokemon.name} />
            <p>{pokemon.types}</p>
            <p>
              weight: {pokemon.weight} m, height: {pokemon.height} kg
            </p>
            <p>moves: {pokemon.moves}</p>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default Pokedex;
