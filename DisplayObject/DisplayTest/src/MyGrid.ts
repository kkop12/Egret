class MyGrid extends egret.Sprite {
	public constructor() {
		super();
		this.drawGrid();
	}

	private drawGrid()
	{
		var greenCode = 0x1DDB16;
		var blueCode = 0x00D8FF;

		let index = 0;

		for(let row = 0; row < 5; row++)
		{
			for(let col = 0; col < 5; col++)
			{
				if(index == 0)
				{
					this.graphics.beginFill( greenCode );
					index++;
				}
				else
				{
					this.graphics.beginFill( blueCode );
					index = 0;
				}				
		        this.graphics.drawRect( 50*row, 50*col, 50,50 );
        		this.graphics.endFill();				
			}
		}		
	}
}