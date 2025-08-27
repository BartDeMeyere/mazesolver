export class Cell{

    constructor(x , y , width , height , row , col){

        this.x = x;
        this.y = y 
        this.width = width
        this.height = height
        this.row = row 
        this.col = col
        this.top = true 
        this.left = true 
        this.visited = false
    
    }

    draw(ctx){

        ctx.strokeStyle = "rgb(60,60,60)";
    
        let x = this.x;
        let y = this.y;
        let w = this.width;
        let h = this.height;

        if(this.visited){

            ctx.beginPath()
            ctx.fillStyle = "rgba(128, 0, 128,.5)"
            ctx.rect(x , y , w , h)
            ctx.fill()
            ctx.closePath()
        }
    
        if(this.top){

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + w, y);
            ctx.stroke();
            ctx.closePath();
        }
    
        if(this.left){

            ctx.beginPath();
            ctx.moveTo(x , y);
            ctx.lineTo(x , y + h);
            ctx.stroke();
            ctx.closePath();
        }
     
    }
}
