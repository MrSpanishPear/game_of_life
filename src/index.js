import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class Box extends React.Component{
	selectBox = () => {
		this.props.selectBox(this.props.row, this.props.col)
	}
	render() {
		return(
			<div
				className={this.props.boxClass}
				id={this.props.id}
				onClick={this.selectBox}
			/>
		)
	}
}


class Grid extends React.Component {

	render() {
		const width = (this.props.cols * 16);
		var rowsArr = []
	 	var boxClass = "";
		
		//could be replaced with map function
		for (let i = 0; i < this.props.rows; i++){
			for(let j = 0; j < this.props.rows; j++){
				let boxId = i + "_" + j;
				boxClass = this.props.gridFull[i][j] ? "box on" : "box off";

				rowsArr.push(
					<Box
						boxClass={boxClass}
						key={boxId}
						boxId={boxId}
						row={i}
						col={j}
						selectBox={this.props.selectBox}

					/>

				);
			}
		}

		return(
			<div id="grid" className="grid" style={{width:width}}>
				{rowsArr}
			</div>
		)
		
	}
}




class Main extends React.Component {
	constructor() {
		super();
		this.speed = 100;
		this.rows = 60;
		this.cols = 100;
		this.state = {
			generation: 0,
			//Fills the grid with FALSE initially
			gridFull: Array(this.rows).fill().map( () => Array(this.cols).fill(false))
		}
	}

	selectBox = (row,col) =>{
		//.slice wont work because gridFull is 2D array
		//https://blog.andrewray.me/how-to-clone-a-nested-array-in-javascript/
		let grid = JSON.parse(JSON.stringify(this.state.gridFull))

		grid[row][col] = !grid[row][col];
		this.setState({
			gridFull: grid
		})
	}

	seed = () => {
		let grid = JSON.parse(JSON.stringify(this.state.gridFull))
		for (let i = 0; i < this.rows; i++){
			for(let j = 0; j < this.rows; j++){
				//random number between 0 and 4, if 1 then: 
				let random = Math.floor(Math.random() * 4);
				if(random === 1) {
					grid[i][j] = true;
				}
			}
		}

		this.setState({
			gridFull: grid
		});
	}

	playButton = () => {
		clearInterval(this.intervalId)
		this.intervalId = setInterval(this.play, this.speed);
	}
	
	pause = () => {
		clearInterval(this.intervalId);
	}
	//game rules etc
	//sourced froms
	//https://gist.github.com/beaucarnes/1c22fc5e10b15a1f2bf338bf7d09b1b9
	play = () => {
		let g = this.state.gridFull;
		let g2 = JSON.parse(JSON.stringify(this.state.gridFull))
	  
		for (let i = 0; i < this.rows; i++) {
		  for (let j = 0; j < this.cols; j++) {
			let count = 0;
			if (i > 0) if (g[i - 1][j]) count++;
			if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
			if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
			if (j < this.cols - 1) if (g[i][j + 1]) count++;
			if (j > 0) if (g[i][j - 1]) count++;
			if (i < this.rows - 1) if (g[i + 1][j]) count++;
			if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
			if (i < this.rows - 1 && this.cols - 1) if (g[i + 1][j + 1]) count++;
			if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
			if (!g[i][j] && count === 3) g2[i][j] = true;
		  }
		}
		this.setState({
		  gridFull: g2,
		  generation: this.state.generation + 1
		});
	  
	}

	clear = () => {
		let copy = Array(this.rows).fill().map( () => Array(this.cols).fill(false))
		this.speed = 200;
		this.setState({
			gridFull: copy,
			generation: 0,
		});
		this.pause()
	}
	slow = () => {
		this.speed += 50;
		this.playButton();
	}
	speedUp = () => {
		this.speed -= 50;
		this.playButton();
	}
	componentDidMount() {
		this.seed();
		this.playButton();
	}
    render() {
        return (
            <div>
                <h1>
					Conways Game of Life!
				</h1>
				<Grid
					gridFull={this.state.gridFull}
					rows={this.rows}
					cols={this.cols}
					selectBox={this.selectBox}
				/>
				<h2>
					Generation: {this.state.generation}
				</h2>
				<h2>
					Speed: Update every {this.speed}ms
				</h2>
				<div className="buttonContainer">
					<button 
						onClick={this.playButton}
						className={"button"}

					>
						Play
					</button>
					<button
						onClick={this.pause}
						className={"button"}
					>
						Pause
					</button>
					<button
						onClick={this.clear}
						className={"button"}
					>
						Clear
					</button>
					<button
						onClick={this.seed}
						className={"button"}
					>
						Seed
					</button>
					<button
						onClick={this.slow}
						className={"button"}
					>
						Slow
					</button>
					<button
						onClick={this.speedUp}
						className={"button"}
					>
						Speed
					</button>
				</div>
				
            </div>
        )
    } 
}


//render main on the root node
ReactDOM.render(<Main/>, document.getElementById('root'));

