import { mazeEngine } from "./src/mazeEngine.js"

let canvas = document.querySelector("canvas")
let maze = new mazeEngine(canvas)
let DfsAlgo = document.getElementById("dfs_algo")
let AstarAlgo = document.getElementById("A*_algo")

DfsAlgo.addEventListener("click", function () {

    if(maze.solver)maze.solver.cancel()

    maze.clear()
    maze.solve("dfs")
    maze.animate()
})

AstarAlgo.addEventListener("click", function () {

    if(maze.solver)maze.solver.cancel()

    maze.clear()
    maze.solve("Astar")
    maze.animate()

})