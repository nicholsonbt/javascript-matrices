var MATRICES = {};

function Matrix() {
	this.constructorError = function(err) {
		console.log(`A matix must be initialised as 'Matrix(a, b)' or 'Matrix([[a, b], [c, d], [e, f]])'
  - 'Matrix(a, b)' will construct a matrix with 'a' rows and 'b' columns.
  - 'Matrix([[a, b], [c, d], [e, f]])' will construct the matrix:
      a b
      c d
      e f
  (3 rows, 2 columns)`);
		throw err;
	}
	
	this.rows = null;
	this.cols = null;
	this.t = false; // Will be used to transpose without having to rearrange the data array.
	this.data = [];
	
	this.isValidMatrix
	
	if (arguments.length == 0) {
		this.constructorError("No arguments given");
	}
	
	if (arguments.length > 2) {
		this.constructorError("Too many arguments given");
	}
	
	// Must be a 2d array of equal size, containing numbers.
	if (arguments.length == 1) {
		console.log(arguments[0]);
		if (typeof arguments[0] != 'object' || arguments[0].constructor != Array)
			this.constructorError("A 2D array should be given");
		
		// arguments[0] is an array
		
		this.rows = arguments[0].length;
		
		for (let i = 0; i < this.rows; i++) {
			if (typeof arguments[0][i] != 'object' || arguments[0][i].constructor != Array)
				this.constructorError("A 2D array should be given");
			
			if (this.cols == null)
				this.cols = arguments[0][i].length;
			else if (arguments[0][i].length != this.cols)
				this.constructorError("The number of columns is inconsistent");
		}
		
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				this.data[j + this.cols * i] = arguments[0][i][j];
			}
		}
	}
	
	if (arguments.length == 2) {
		if (typeof arguments[0] != 'number' || typeof arguments[1] != 'number')
			this.constructorError("The number of rows and columns must be numbers");
		
		this.rows = arguments[0];
		this.cols = arguments[1];
		
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				this.data[j + this.cols * i] = 0;
			}
		}
	}
	
	this.print = function() {
		let str = "";
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				str += this.data[j + this.cols * i] + " ";
			}
			str += "\n";
		}
		console.log(str);
	}
	
	this.size = function() {
		return "(" + this.rows + ", " + this.cols + ")";
	}
	
	this.shape = function() {
		return [this.rows, this.cols];
	}
	
	this.getElementAt = function(row, col) {
		if (col < 0 || col >= this.cols || row < 0 || row >= this.rows)
			throw "Out of bounds";
			
		return this.data[col + this.cols * row];
	}
	
	this.setElementAt = function(row, col, value) {
		if (col < 0 || col >= this.cols || row < 0 || row >= this.rows)
			throw "Out of bounds";
		
		if (typeof value != 'number')
			throw "Value must be a number";
		
		this.data[col + this.cols * row] = value;
	}
}

MATRICES.CanCross = function(matrixA, matrixB) {
	return matrixA.cols == matrixB.rows;
}

MATRICES.CrossProduct = function(matrixA, matrixB) {
	if (!MATRICES.CanCross(matrixA, matrixB))
		throw "MatrixA.columns == MatrixB.rows must be true to calculate the cross product";
	
	let matrix = new Matrix(matrixA.rows, matrixB.cols);
	
	for (let i = 0; i < matrix.rows; i++) {
		for (let j = 0; j < matrix.cols; j++) {
			for (let k = 0; k < matrixA.cols; k++) {
				let value = matrix.getElementAt(i, j) + matrixA.getElementAt(i, k) * matrixB.getElementAt(k, j)
				matrix.setElementAt(i, j, value);
			}
		}
	}
	
	return matrix;
}


// Immediate features to add:
//  - Transpose,
//  - Determinant,
//  - Inverse,
//  - Identity matrix,
//  - Adjugate,
//  - Etc,