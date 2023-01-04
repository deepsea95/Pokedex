import React, { useState } from 'react';
import axios from 'axios';
import PokemonLogo from './assets/Pokemon-Logo.png';

function Pokedex() {
	const [ pokemon, setPokemon ] = useState(null);
	const [ search, setSearch ] = useState('');

	async function handleClick() {
		await axios
			.get(`https://pokeapi.co/api/v2/pokemon/${search}`)
			.then((response) => {
				const pokemon = response.data;
				setPokemon({
					name: pokemon.name,
					id: pokemon.id,
					weight: pokemon.weight,
					height: pokemon.height,
					image: pokemon.sprites.front_default,
					types: pokemon.types.map((t) => t.type.name).join(', '),
					stats: pokemon.stats.find((s) => s.stat.name === 'hp').base_stat,
					moves: `${pokemon.moves[0].move.name}, ${pokemon.moves[1].move.name}`
				});
			})
			.catch((error) => {
				console.error(error);
			});
	}

	return (
		<div>
			<div className="pokedex">
				<nav className="navbar">
					<img src={PokemonLogo} alt="Pokemon logo" />
					<div className="search">
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.currentTarget.value)}
							placeholder="Search for a Pokemon"
						/>
						<button className="btn" onClick={handleClick} />
					</div>
				</nav>
			</div>

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
	);
}

export default Pokedex;
