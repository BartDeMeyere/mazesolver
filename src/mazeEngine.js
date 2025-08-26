import { Cell } from "./cell.js"
import { solveDFS } from "./solveDFS.js"

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
        this.solve("dfs")

    }

    createGrid() {

        let desiredCellsize = 10
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

    render() {

        let innerloop = () => {

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

            //draw start
            this.ctx.beginPath()
            this.ctx.fillStyle = "magenta"
            this.ctx.rect(this.start.x , this.start.y , this.start.width , this.start.height)
            this.ctx.fill()
            this.ctx.closePath()

            //draw end
            this.ctx.beginPath()
            this.ctx.fillStyle = "yellow"
            this.ctx.rect(this.end.x , this.end.y , this.end.width , this.end.height)
            this.ctx.fill()
            this.ctx.closePath()

            //draw the maze
            this.grid.forEach(row => {
                row.forEach(cell => cell.draw(this.ctx));
            });

            //draw path depth first search
            if (this.solver.algo === "dfs") {

                //render dfs path
                this.ctx.beginPath()
                this.ctx.strokeStyle = "lime"
                this.ctx.lineWidth = 3

                for (let i = 0; i < this.solver.stack.length; i++) {

                    this.ctx.lineTo(this.solver.stack[i].x + this.solver.stack[i].width / 2, this.solver.stack[i].y + this.solver.stack[i].height / 2)
                }

                this.ctx.stroke()
                this.ctx.closePath()
            }

            requestAnimationFrame(innerloop)
        }

        innerloop()

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
                this.render()
                break;
        }
    }
}