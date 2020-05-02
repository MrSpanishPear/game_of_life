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
        const width = (this.props.cols * 16) + 1;
        var rowsArr = []
         var boxClass = "";
        
        //could be replaced with map function
        for (let i = 0; i < this.props.rows; i++){
            for(let j = 0; j < this.props.cols; j++){
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
        this.speed = 300;
        this.rows = 30;
        this.cols = 50;
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
        console.log(`calling select box on ${row},${col}`)
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
        this.play()
    }
    
    pause = () => {
        clearInterval(this.intervalId);
    }

    // sourced with edits from https://medium.com/javascript-in-plain-english/the-game-of-life-using-javascript-fc1aaec8274f
    getNeighborCount(row, col) {
        let count = 0;
        let nrow=Number(row);
        let ncol=Number(col);
        let currGen = this.state.gridFull;
        let rows = this.rows;
        let cols = this.cols;

        // Make sure we are not at the first row
        if (nrow - 1 >= 0) {
            // Check top neighbor
            if (currGen[nrow - 1][ncol] === true) count++;
        }

        // Make sure we are not in the first cell
        if (nrow - 1 >= 0 && ncol - 1 >= 0) {
        //Check upper left neighbor
            if (currGen[nrow - 1][ncol - 1] === true) count++;
        }

        // Make sure we are not on the first row last column
        if (nrow - 1 >= 0 && ncol + 1 < cols) {
            //Check upper right neighbor
            if (currGen[nrow - 1][ncol + 1] === true) count++;
        }
            
        // Make sure we are not on the first column
        if (ncol - 1 >= 0) {
            //Check left neighbor
            if (currGen[nrow][ncol - 1] === true) count++;
        }

        // Make sure we are not on the last column
        if (ncol + 1 < cols) {
            
            //Check right neighbor
            if (currGen[nrow][ncol + 1] === true) count++;
        }

        // Make sure we are not on the bottom left corner
        if (nrow + 1 < rows && ncol - 1 >= 0) {
            //Check bottom left neighbor
            if (currGen[nrow + 1][ncol - 1] === true) count++;
        }

        // Make sure we are not on the bottom right
        if (nrow + 1 < rows && ncol + 1 < cols) {
            //Check bottom right neighbor
            if (ncol==0 && nrow==0) console.log(`bottom right = ${nrow + 1},${ncol +1} = ${currGen[nrow + 1][ncol + 1]}`)

            if (currGen[nrow + 1][ncol + 1] === true) count++;
        }
        
        
        // Make sure we are not on the last row
        if (nrow + 1 < rows) {
            //Check bottom neighbor
            if (currGen[nrow + 1][ncol] === true) count++;
        }
        
        return count;
    }

    //game rules etc
    play = () => {
        let g = this.state.gridFull;
        let g2 = JSON.parse(JSON.stringify(this.state.gridFull))
      
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let neighbors =this.getNeighborCount(i, j);
                if ( i< 1 && j < 1) console.log(i,j, neighbors);
                // Check the rules
                // If Alive
                if (g[i][j] === true) {
                  
                    if (neighbors < 2) {
                        g2[i][j] = false;
                    } else if (neighbors === 2 || neighbors === 3) {
                        g2[i][j] = true;
                    } else if (neighbors > 3) {
                        g2[i][j] = false;
                    }
                } else if (g[i][j] === false) {
                    // If Dead or Empty
                
                    if (neighbors === 3) {
                        // Propogate the species
                        g2[i][j] = true;//Birth?
                    }
                }
            }
        }

        this.setState({
            gridFull: g2,
            generation: this.state.generation + 1
        });

        this.forceUpdate(); 
      
    }

    clear = () => {
        let copy = Array(this.rows).fill().map( () => Array(this.cols).fill(false))
        this.speed = 300;
        this.setState({
            gridFull: copy,
            generation: 0,
        });
        this.pause()
    }
    slow = () => {
        this.speed += 50;
        this.forceUpdate(); 
    }
    speedUp = () => {
        this.speed -= 50;
        this.forceUpdate(); 
    }
    componentDidMount() {
        // this.seed();
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

