var MATRICES = {};

// Treat vectors as matrices with 1 column.
function Vector() {
	let matrix;
	
	this.constructorError = function(err) {
		console.log(`A vector must be initialised as 'Vector(a)' or 'Vector([a, b, c])'
  - 'Vector(a)' will construct a column vector with 'a' rows (initialised to 0).
  - 'Vector([a, b, c])' will construct the column vector:
      a
      b
      c
  (3 rows)`);
		throw err;
	}
	
	if (arguments.length == 0) {
		this.constructorError("No arguments given");
	}
	
	if (arguments.length > 1) {
		this.constructorError("Too many arguments given");
	}
	
	// Must be a 1d array of numbers or an integer
	if (arguments.length == 1) {
		if (typeof arguments[0] == 'object' && arguments[0].constructor == Array) {
			matrix = new Matrix(arguments[0].length, 1);
			
			if (arguments[0].length < 1)
				this.constructorError("A vector must have at least one value");
			
			for (let i = 0; i < arguments[0].length; i++) {
				if (typeof arguments[0][i] != 'number')
					this.constructorError("Non-numerical element in array");
				else {
					matrix.setElementAt(i, 0, arguments[0][i]);
				}
			}
		} else if (typeof arguments[0] == 'number') {
			matrix = new Matrix(arguments[0], 1);
		}
	}
	
	return matrix;
}

function Identity(n) {
	let matrix = new Matrix(n, n);
	
	for (let i = 0; i < n; i++)
		matrix.setElementAt(i, i, 1);
	
	return matrix;
}

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
	
	if (arguments.length == 0) {
		this.constructorError("No arguments given");
	}
	
	if (arguments.length > 2) {
		this.constructorError("Too many arguments given");
	}
	
	// Must be a 2d array of equal size, containing numbers.
	if (arguments.length == 1) {
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
		
		if (this.cols < 1 || this.rows < 1)
			this.constructorError("A matrix must have at least one value");
		
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				this.data[j + this.cols * i] = arguments[0][i][j];
			}
		}
	}
	
	if (arguments.length == 2) {
		if (typeof arguments[0] != 'number' || typeof arguments[1] != 'number')
			this.constructorError("The number of rows and columns must be numbers");
		
		if (arguments[0] < 1 || arguments[1] < 1)
			this.constructorError("A matrix must have at least one value");
		
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
		for (let i = 0; i < this.shape()[0]; i++) {
			for (let j = 0; j < this.shape()[1]; j++) {
				str += this.data[j + this.shape()[1] * i] + " ";
			}
			str += "\n";
		}
		console.log(str);
	}
	
	this.size = function() {
		return this.rows * this.columns;
	}
	
	this.shape = function() {
		let columns, rows;
		
		if (this.t) {
			columns = this.rows;
			rows = this.cols;
		} else {
			columns = this.cols;
			rows = this.rows;
		}
		
		return [rows, columns];
	}
	
	this.getElementAt = function(row, col) {
		if (col < 0 || col >= this.shape()[1] || row < 0 || row >= this.shape()[0])
			throw "Out of bounds";
			
		return this.data[col + this.shape()[1] * row];
	}
	
	this.setElementAt = function(row, col, value) {
		if (col < 0 || col >= this.shape()[1] || row < 0 || row >= this.shape()[0])
			throw "Out of bounds";

		if (typeof value != 'number')
			throw "Value must be a number";
		
		this.data[col + this.shape()[1] * row] = value;
	}
	
	this.transpose = function() {
		this.t = !this.t;
	}
}


MATRICES.Multiply = function(matrixA, matrixB) {
	if (typeof matrixB != 'object' || matrixB.constructor != Matrix)
		throw "The second parameter must be a matrix"
	
	let matrix = new Matrix(matrixB.shape()[0], matrixB.shape()[1]);
	
	if (typeof matrixA == 'number') {
		for (let i = 0; i < matrix.shape()[0]; i++) {
			for (let j = 0; j < matrix.shape()[1]; j++) {
				matrix.setElementAt(i, j, matrixB.getElementAt(i, j) * matrixA);
			}
		}
	} else if (matrixA.shape()[1] != matrixB.shape()[0]) {
		throw "MatrixA.columns == MatrixB.rows must be true to calculate the product";
	} else {
		for (let i = 0; i < matrix.shape()[0]; i++) {
			for (let j = 0; j < matrix.shape()[1]; j++) {
				for (let k = 0; k < matrixA.shape()[1]; k++) {
					let value = matrix.getElementAt(i, j) + matrixA.getElementAt(i, k) * matrixB.getElementAt(k, j)
					matrix.setElementAt(i, j, value);
				}
			}
		}
	}
	
	return matrix;
}


MATRICES.Add = function(matrixA, matrixB) {
	// The two matrices must have the same shape for us to add them.
	if (matrixA.shape()[0] != matrixB.shape()[0] || matrixA.shape()[1] != matrixB.shape()[1])
		throw "MatrixA and MatrixB must have the same shape to add";
	
	// Create a new matrix of the same shape.
	let matrix = new Matrix(matrixA.shape()[0], matrixA.shape()[1]);
	
	// For each row and column, add the values in matrixA and matrixB at that index.
	for (let i = 0; i < matrix.shape()[0]; i++) {
		for (let j = 0; j < matrix.shape()[1]; j++) {
			let value = matrixA.getElementAt(i, j) + matrixB.getElementAt(i, j)
			matrix.setElementAt(i, j, value);
		}
	}
	
	return matrix;
}

MATRICES.Subtract = function(matrixA, matrixB) {
	// Adding a matrix multiplied by the scalar -1 is the same as subtracting by it.
	return MATRICES.Add(matrixA, MATRICES.Multiply(-1, matrixB));
}

MATRICES.Determinant = function(matrix) {
	// A matrix can only have a determinant if it's square.
	if (matrix.shape()[0] != matrix.shape()[1])
		throw "A matrix can only have a determinant if it's square";
	
	// Base case: if the matrix is (1 x 1), return this.
	if (matrix.shape()[0] == 1)
		return matrix.getElementAt(0, 0);
	
	// Set value to 0 initially.
	let value = 0;
	
	// For each element on the top row of the matrix, multiply by its minor and add
	// to the determinant value (subtract if the top value is at an odd index).
	for (let i = 0; i < matrix.shape()[0]; i++) {
		// Used identity as it must be a square matrix and we will change the values anyway.
		let sub_matrix = new Identity(matrix.shape()[0] - 1);
		
		// Assign minor values to sub-matrix.
		for (let j = 1; j < matrix.shape()[0]; j++) {
			for (let k = 0; k < matrix.shape()[0]; k++) {
				let value = matrix.getElementAt(j, k);
				if (k < i) {
					sub_matrix.setElementAt(j - 1, k, value);
				} else if (k > i) {
					sub_matrix.setElementAt(j - 1, k - 1, value);
				}
			}
		}
		
		// Find the sub-determinant using the minor matrix.
		let sub_det = matrix.getElementAt(0, i) * MATRICES.Determinant(sub_matrix);

		// Add if even index. Subtract if odd.
		if (i % 2 == 0)
			value += sub_det;
		else
			value -= sub_det;
	}
	
	return value;
}




// Immediate features to add:
//  - Inverse,
//  - Adjugate,
//  - Etc,