export class solveAstar {

    constructor(algo, grid, start, end) {

        this.algo = algo
        this.grid = grid
        this.start = start
        this.end = end
        this.openset = []
        this.closedset = []
        this.path = []
        this.cancelled = false
    }

    isValue(r, c) {

        if (!this.grid[r] || this.grid[r][c] === undefined) return false;
        return this.grid[r][c];
    }

   
    cancel() {
        this.cancelled = true;
    }
    

    getNeighbors(r, c) {

        let cells = []
        let checkcell, current
        current = this.isValue(r, c)

        checkcell = this.isValue(r - 1, c)

        if (checkcell && !current.top) { cells.push(checkcell) }

        checkcell = this.isValue(r + 1, c)

        if (checkcell && !checkcell.top) { cells.push(checkcell) }

        checkcell = this.isValue(r, c - 1)

        if (checkcell && !current.left) { cells.push(checkcell) }

        checkcell = this.isValue(r, c + 1)

        if (checkcell && !checkcell.left) { cells.push(checkcell) }

        return cells

    }

    heuristic(cell, end) {

        return Math.abs(cell.row - end.row) + Math.abs(cell.col - end.col)
    }

    solve() {

        let current = null

        this.start.g = 0 //kost vanaf start naar huidige cell
        this.start.h = this.heuristic(this.start, this.end)
        this.start.f = this.start.g + this.start.h

        this.openset.push(this.start)

        let innerloop = () => {

            if (this.cancelled) return;

            if (this.openset.length > 0) {

                let winner = 0

                for (let i = 0; i < this.openset.length; i++) {

                    if (this.openset[i].f < this.openset[winner].f) {

                        winner = i

                    }
                }

                current = this.openset[winner]

                if (current === this.end) {

                    console.log("maze solved with Astar")
                    let temp = current 
                    while(temp){

                        this.path.push(temp)
                        temp = temp.parent
                    }

                    this.path.reverse()
                    console.log(this.path)
                    return
                }

                this.openset.splice(winner , 1)
                this.closedset.push(current)

                let neighbors = this.getNeighbors(current.row, current.col)

                for (let i = 0; i < neighbors.length; i++) {

                    if (this.closedset.includes(neighbors[i])) continue

                    if(!this.openset.includes(neighbors[i])){

                        this.openset.push(neighbors[i])
                       
                    }

                    neighbors[i].g =  current.g + 1
                    neighbors[i].h = this.heuristic(neighbors[i] , this.end)
                    neighbors[i].f = neighbors[i].h + neighbors[i].g
                    neighbors[i].parent = current
                   
                }

            }

            requestAnimationFrame(innerloop)
        }

        innerloop()
    }
}