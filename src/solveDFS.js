export class solveDFS{

    constructor(algo , grid , start , end){

        this.algo = "dfs"
        this.grid = grid
        this.start = start
        this.end = end
        this.stack = [this.start]
        this.current = this.start

    }
    
    getNeighbors(r,c){

        let cells = []
        let checkcell , current
        current = this.isValue(r,c)

        checkcell = this.isValue(r - 1 , c)

        if(checkcell && !checkcell.visited && !current.top) { cells.push(checkcell)}

        checkcell = this.isValue(r + 1 , c)

        if(checkcell && !checkcell.visited && !checkcell.top) { cells.push(checkcell)}

        checkcell = this.isValue(r , c - 1)

        if(checkcell && !checkcell.visited && !current.left) { cells.push(checkcell)}

        checkcell = this.isValue(r , c + 1)

        if(checkcell && !checkcell.visited && !checkcell.left) { cells.push(checkcell)}

        return cells[Math.floor(Math.random() * cells.length)]

    }

    isValue(r, c) {

        if (!this.grid[r] || this.grid[r][c] === undefined) return false;
        return this.grid[r][c];
    }

    solve(){

        let innerloop = () => {

            let next = this.getNeighbors(this.current.row , this.current.col)

            if(next === this.end){

                this.stack.push(this.end)
                this.end.visited = true
                console.log("we are done")
                return
            }

            if(next){

                next.visited = true
                this.stack.push(next)
                this.current = next 

            }else{

                if(this.stack.length > 0){

                    this.stack.pop()
                    this.current = this.stack[this.stack.length-1]

                }else{

                    console.log("no solution found")
                    return
                }

               
            }


            requestAnimationFrame(innerloop)
        }

        innerloop()
    }
}