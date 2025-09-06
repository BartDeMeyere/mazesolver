import { Cell } from "./cell.js"
import { solveDFS } from "./solveDFS.js"
import { solveAstar } from "./solveAstar.js"

export class mazeEngine {

    constructor(canvas) {

        this.dpr = devicePixelRatio || 1
        this.canvas = canvas
        this.canvas.width = innerWidth * this.dpr
        this.canvas.height = innerHeight * this.dpr
        this.canvas.style.height = "100%"
        this.canvas.style.width = "100%"
        this.ctx = this.canvas.getContext("2d")
        this.grid = []
        this.currentcell = null
        this.stack = []
        this.rows = null
        this.cols = null
        this.solver = null
        this.createGrid()
        this.createMaze()
        this.render()

    }

    createGrid() {

        let desiredCellsize = 15
        this.cols = Math.floor(innerWidth / desiredCellsize)
        this.rows = Math.floor(innerHeight / desiredCellsize)
        let cellWidth = this.dpr * innerWidth / this.cols
        let cellHeight = this.dpr * innerHeight / this.rows

        for (let i = 0; i < this.rows; i++) {
            this.grid[i] = []
            for (let j = 0; j < this.cols; j++) {
                this.grid[i][j] = new Cell(j * cellWidth, i * cellHeight, cellWidth, cellHeight, i, j)
            }
        }

        this.currentcell = this.pickRandomCell()

        //change this line to pick another start- and endcell
        this.start = this.pickRandomCell()
        this.end = this.pickRandomCell()
    }

    animate() {

        let innerloop = () => {

            if (this.solver.finished) {
                console.log("done")
                this.render()
                return

            } else {

                this.render()

            }

            //console.log("animating in progress..")

            requestAnimationFrame(innerloop)
        }

        innerloop()
    }

    render() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        //draw the maze
        this.grid.forEach(row => {
            row.forEach(cell => cell.draw(this.ctx));
        });

        if (this.solver) {

            //render Dfs alogrithm
            if (this.solver.algo === "dfs") {

                //render dfs path
                this.ctx.beginPath()
                this.ctx.strokeStyle = "lime"
                this.ctx.lineWidth = 3

                this.ctx.moveTo(this.solver.stack[0].x + this.solver.stack[0].width / 2, this.solver.stack[0].y + this.solver.stack[0].height / 2)

                for (let i = 1; i < this.solver.stack.length; i++) {

                    this.ctx.lineTo(this.solver.stack[i].x + this.solver.stack[i].width / 2, this.solver.stack[i].y + this.solver.stack[i].height / 2)
                }

                this.ctx.stroke()
                this.ctx.closePath()

            }

            //render Astar algorithm
            if (this.solver.algo === "Astar") {

                for (let i = 0; i < this.solver.closedset.length; i++) {

                    this.ctx.beginPath()
                    this.ctx.fillStyle = "rgba(128, 0, 128,.5)"
                    this.ctx.rect(this.solver.closedset[i].x, this.solver.closedset[i].y, this.solver.closedset[i].width, this.solver.closedset[i].height)
                    this.ctx.fill()
                    this.ctx.closePath()
                }

                for (let i = 0; i < this.solver.openset.length; i++) {

                    this.ctx.beginPath()
                    this.ctx.fillStyle = "rgba(0, 255, 0, 0.8)"
                    this.ctx.rect(this.solver.openset[i].x, this.solver.openset[i].y, this.solver.openset[i].width, this.solver.openset[i].height)
                    this.ctx.fill()
                    this.ctx.closePath()
                }

                if (this.solver.path.length > 0) {

                    //render Astar  path
                    this.ctx.save()
                    this.ctx.beginPath()
                    this.ctx.strokeStyle = "lime"
                    this.ctx.lineWidth = 3

                    this.ctx.moveTo(this.solver.path[0].x + this.solver.path[0].width / 2, this.solver.path[0].y + this.solver.path[0].height / 2)

                    for (let i = 1; i < this.solver.path.length; i++) {

                        this.ctx.lineTo(this.solver.path[i].x + this.solver.path[i].width / 2, this.solver.path[i].y + this.solver.path[i].height / 2)
                    }

                    this.ctx.stroke()
                    this.ctx.closePath()
                    this.ctx.restore()

                }

            }
        }


        //draw start
        this.ctx.beginPath()
        this.ctx.fillStyle = "magenta"
        this.ctx.rect(this.start.x, this.start.y, this.start.width, this.start.height)
        this.ctx.fill()
        this.ctx.closePath()

        //draw end
        this.ctx.beginPath()
        this.ctx.fillStyle = "yellow"
        this.ctx.rect(this.end.x, this.end.y, this.end.width, this.end.height)
        this.ctx.fill()
        this.ctx.closePath()

    }

    pickRandomCell(rows, cols) {

        let r = Math.floor(Math.random() * this.grid.length)
        let c = Math.floor(Math.random() * this.grid[0].length)
        return this.grid[r][c]

    }

    isValue(r, c) {

        if (!this.grid[r] || this.grid[r][c] === undefined) return false;
        return this.grid[r][c];
    }

    getAdjacentCells(r, c) {

        let cells = []
        let dir = [

            [-1, 0], [0, 1], [1, 0], [0, -1]
        ]

        for (let i = 0; i < dir.length; i++) {

            let current = this.isValue(r + dir[i][0], c + dir[i][1])

            if (current && !current.visited) { cells.push(current) }
        }

        return cells[Math.floor(Math.random() * cells.length)]
    }

    removeWalls(a, b) {

        if (a.row === b.row - 1) b.top = false;
        if (a.row === b.row + 1) a.top = false;
        if (a.col === b.col - 1) b.left = false;
        if (a.col === b.col + 1) a.left = false;

    }

    createMaze() {

        do {

            let next = this.getAdjacentCells(this.currentcell.row, this.currentcell.col)

            if (next) {

                next.visited = true
                this.removeWalls(this.currentcell, next)
                this.stack.push(next)
                this.currentcell = next

            } else {

                if (this.stack.length > 0) {

                    this.currentcell = this.stack.pop()

                } else {

                    this.currentcell = null
                }
            }

        } while (this.currentcell)

        //reset all cells 
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.grid[i][j].visited = false
            }
        }

    }

    solve(algorithm) {

        switch (algorithm) {

            case "dfs":
                this.solver = new solveDFS("dfs", this.grid, this.start, this.end);
                this.solver.solve()
                break;
            case "Astar":
                this.solver = new solveAstar("Astar", this.grid, this.start, this.end);
                this.solver.solve()
                break;
        }
    }

    clear(){

        this.solver = null
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.grid[i][j].visited = false
            }
        }
    }
}