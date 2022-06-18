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
		// If the parameter is an array, ensure it contains at least one value.
		if (typeof arguments[0] == 'object' && arguments[0].constructor == Array) {
			matrix = new Matrix(arguments[0].length, 1);
			
			// Can't be an empty array.
			if (arguments[0].length < 1)
				this.constructorError("A vector must have at least one value");
			
			// Ensure all elements of the array are numbers, and add them to the column vector.
			for (let i = 0; i < arguments[0].length; i++) {
				if (typeof arguments[0][i] != 'number')
					this.constructorError("Non-numerical element in array");
				else {
					matrix.setElementAt(i, 0, arguments[0][i]);
				}
			}
		// If the parameter is a number, it represents the vector size.
		} else if (typeof arguments[0] == 'number') {
			matrix = new Matrix(arguments[0], 1);
		}
	}
	
	return matrix;
}

function Ones(rows, cols) {
	let matrix = new Matrix(rows, cols);
	
	// Create a matrix of ones. A default matrix will be a matrix of zeros.
	
	for (let i = 0; i < rows; i++)
		for (let j = 0; j < cols; j++)
			matrix.setElementAt(i, j, 1);
	
	return matrix;
}

function Identity(n) {
	let matrix = new Matrix(n, n);
	
	// Create an identity matrix.
	
	for (let i = 0; i < n; i++)
		matrix.setElementAt(i, i, 1);
	
	return matrix;
}

function Matrix() {
	// BEGIN Construction:
	this.rows = null;
	this.cols = null;
	this.t = false; // Used to transpose without having to rearrange the data array.
	this.data = [];
	
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
	
	if (arguments.length == 0) {
		this.constructorError("No arguments given");
	}
	
	if (arguments.length > 2) {
		this.constructorError("Too many arguments given");
	}
	
	// Must be a 2d array of equal sized columns, containing numbers.
	if (arguments.length == 1) {
		if (typeof arguments[0] != 'object' || arguments[0].constructor != Array)
			this.constructorError("A 2D array should be given");
		
		// arguments[0] is an array
		
		this.rows = arguments[0].length;
		
		// Foreach row, check column sizes are equal.
		for (let i = 0; i < this.rows; i++) {
			if (typeof arguments[0][i] != 'object' || arguments[0][i].constructor != Array)
				this.constructorError("A 2D array should be given");
			
			if (this.cols == null)
				this.cols = arguments[0][i].length;
			else if (arguments[0][i].length != this.cols)
				this.constructorError("The number of columns is inconsistent");
		}
		
		// Ensure there is at least one element in the matrix.
		if (this.cols < 1 || this.rows < 1)
			this.constructorError("A matrix must have at least one value");
		
		// Add values to the matrix.
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				this.data[j + this.cols * i] = arguments[0][i][j];
			}
		}
	}
	
	// Or two numbers representing the quantity of rows and columns respectively.
	if (arguments.length == 2) {
		if (typeof arguments[0] != 'number' || typeof arguments[1] != 'number')
			this.constructorError("The number of rows and columns must be numbers");
		
		if (arguments[0] < 1 || arguments[1] < 1)
			this.constructorError("A matrix must have at least one value");
		
		this.rows = arguments[0];
		this.cols = arguments[1];
		
		// Populate the matrix with zeros.
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				this.data[j + this.cols * i] = 0;
			}
		}
	}
	
	// END Construction:
	
	this.print = function() {
		// Output the matrix to the console.
		let str = "";
		for (let i = 0; i < this.shape()[0]; i++) {
			for (let j = 0; j < this.shape()[1]; j++) {
				if (this.t)
					str += this.data[i + this.shape()[0] * j] + " ";
				else
					str += this.data[j + this.shape()[1] * i] + " ";
			}
			str += "\n";
		}
		console.log(str);
	}
	
	this.size = function() {
		// Return the total number of elements in the matrix.
		return this.rows * this.columns;
	}
	
	this.shape = function() {
		// Return a tuple of rows and columns.
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
		// Return the element at position (row, column).
		if (col < 0 || col >= this.shape()[1] || row < 0 || row >= this.shape()[0])
			throw "Out of bounds";
		
		if (this.t)
			return this.data[row + this.shape()[0] * col];
		
		return this.data[col + this.shape()[1] * row];
	}
	
	this.setElementAt = function(row, col, value) {
		// Set the element at position (row, column) to 'value'.
		if (col < 0 || col >= this.shape()[1] || row < 0 || row >= this.shape()[0])
			throw "Out of bounds";

		if (typeof value != 'number')
			throw "Value must be a number";
		
		if (this.t)
			this.data[row + this.shape()[0] * col] = value;
		else
			this.data[col + this.shape()[1] * row] = value;
	}
	
	this.transpose = function() {
		// Toggle the transpose flag (the transpose of a transposed matrix is the original matrix).
		this.t = !this.t;
	}
	
	this.dataAs2dArray = function() {
		// Return the matrix as a 2d array.
		let rows = [];
		
		for (let i = 0; i < this.shape()[0]; i++) {
			rows[i] = [];
			
			for (let j = 0; j < this.shape()[1]; j++) {
				if (this.t)
					rows[i][j] = this.data[i + this.shape()[0] * j];
				else
					rows[i][j] = this.data[j + this.shape()[1] * i];
			}
		}
		
		return rows;
	}
	
	this.copy = function() {
		// Return a copy of the array.
		return new Matrix(this.dataAs2dArray());
	}
}


MATRICES.Multiply = function(matrixA, matrixB) {
	// Either a scalar by a matrix or a matrix by a matrix.
	if (typeof matrixB != 'object' || matrixB.constructor != Matrix)
		throw "The second parameter must be a matrix"
	
	// Create a new array of the resulting size.
	let matrix = new Matrix(matrixB.shape()[0], matrixB.shape()[1]);
	
	// If scalar multiplication, multiply each value in the matrix by the scalar.
	// If not scalar, throw an error if the matrices can't be multiplied.
	// Otherwise, do matrix multiplication.
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
				let value = 0;
				
				// Calculate the matrix multiplication for each element in the new matrix.
				for (let k = 0; k < matrixA.shape()[1]; k++) {
					value += matrixA.getElementAt(i, k) * matrixB.getElementAt(k, j)
				}
				
				matrix.setElementAt(i, j, value);
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

MATRICES.IsSingular = function(matrix) {
	// Using try to catch any thrown errors about shape.
	try {
		return MATRICES.Determinant(matrix) == 0;
	} catch (err) {
		return false;
	}
}




MATRICES.Adjugate = function(matrix) {
	// A matrix can only have an adjugate if it's square.
	if (matrix.shape()[0] != matrix.shape()[1])
		throw "A matrix can only have a determinant if it's square";
	
	// Base case: if the matrix is (1 x 1), return this.
	if (matrix.shape()[0] == 1)
		return matrix.getElementAt(0, 0);
	
	let m = new Identity(matrix.shape()[0]);
	
	// For each element on the top row of the matrix, multiply by its minor and add
	// to the determinant value (subtract if the top value is at an odd index).
	for (let i = 0; i < matrix.shape()[0]; i++) {
		for (let j = 0; j < matrix.shape()[0]; j++) {
			let sub_matrix = new Identity(matrix.shape()[0] - 1);

			// Assign minor values to sub-matrix.
			for (let k = 0; k < matrix.shape()[0]; k++) {
				for (let l = 0; l < matrix.shape()[0]; l++) {
					let value = matrix.getElementAt(k, l);
					
					if (k < i) {
						if (l < j)
							sub_matrix.setElementAt(k, l, value);
						else if (l > j)
							sub_matrix.setElementAt(k, l - 1, value);
					} else if (k > i) {
						if (l < j)
							sub_matrix.setElementAt(k - 1, l, value);
						else if (l > j)
							sub_matrix.setElementAt(k - 1, l - 1, value);
					}
				}
			}
			
			// Calculate the determinant of the sub-matrix.
			let value = MATRICES.Determinant(sub_matrix);
			
			// Multiply determinant by (-1)^(i+j)
			if ((i + j) % 2 != 0)
				value = -value;
			
			m.setElementAt(i, j, value);
		}
	}
	
	// Transpose the matrix.
	m.transpose();
	
	return m;
}

MATRICES.HasInverse = function(matrix) {
	// A matrix must have a non-zero determinant to have an inverse.
	if (MATRICES.IsSingular(matrix))
		throw "Determinant is 0, so this matrix has no inverse";
}

MATRICES.Inverse = function(matrix) {
	// Calculate the determinant (det(M)).
	let determinant = MATRICES.Determinant(matrix);
	
	if (determinant == 0)
		throw "Determinant is 0, so this matrix has no inverse";
	
	// Calculate the adjugate (C^T).
	let adjugate = MATRICES.Adjugate(matrix);
	
	// Return the inverse: (1 / det(M)) * C^T.
	return MATRICES.Multiply(1 / determinant, adjugate);
}

MATRICES.Concatenate = function(matrixA, matrixB, axis) {
	// Concatenate matrixA and matrixB on a given axis (0 = new rows, 1 = new columns).
	
	if (axis == 0 && matrixA.shape()[1] != matrixB.shape()[1])
		throw "Both matrices must have the same number of columns";
	
	if (axis == 1 && matrixA.shape()[0] != matrixB.shape()[0])
		throw "Both matrices must have the same number of rows";
	
	
	// Calculate the resulting matrix size and the offsets for each axis.
	let matrix, offsetI, offsetJ;
	
	if (axis == 0) {
		matrix = new Matrix(matrixA.shape()[0] + matrixB.shape()[0], matrixA.shape()[1]);
		offsetI = matrixA.shape()[0];
		offsetJ = 0;
	} else if (axis == 1) {
		matrix = new Matrix(matrixA.shape()[0], matrixA.shape()[1] + matrixB.shape()[1]);
		offsetI = 0;
		offsetJ = matrixA.shape()[1];
	} else {
		throw "The third parameter (" + axis + ") must be 0 or 1";
	}
	
	// Add the first matrix.
	for (let i = 0; i < matrixA.shape()[0]; i++) {
		for (let j = 0; j < matrixA.shape()[1]; j++) {
			matrix.setElementAt(i, j, matrixA.getElementAt(i, j));
		}
	}
	
	// Add the second matrix.
	for (let i = 0; i < matrixB.shape()[0]; i++) {
		for (let j = 0; j < matrixB.shape()[1]; j++) {
			matrix.setElementAt(i + offsetI, j + offsetJ, matrixB.getElementAt(i, j));
		}
	}
	
	return matrix;
}