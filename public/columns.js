const container = document.getElementById('numberColumn');

for (let i = 1; i <= 25; i++) {
    const div = document.createElement('div');
    div.classList.add('item');

    // Create a label for the number
    const label = document.createElement('label');
    label.textContent = i;

    // Create an input element for the user to enter a number
    const input = document.createElement('input');
    input.type = 'number';  // Set input type to number
    input.min = 0;  // Optional: Set a minimum value for the input
	input.max = 1000;
    input.value = 0;  // Optional: Set an initial value for the input

    div.appendChild(label);
    div.appendChild(input);
    container.appendChild(div);
}

function logAllNumbers() {
    const inputFields = document.querySelectorAll('.item input');
    const values = Array.from(inputFields).map(input => input.value);

    const blockchainContainer = document.getElementById('blockchainMeasurements');
    const currentContainer = document.getElementById('currentMeasurements');
	let currentValue;
    blockchainContainer.innerHTML = ''; // Clear the previous logged items

    for (let i = 0; i < values.length; i++) {
		if (i == 1)
			currentValue = values[i];
		if (i == 0 || i == 20) {
			const currentItem = document.createElement('div');
        	currentItem.classList.add('current-item');
        	currentItem.textContent = `Region: ${i + 1}, Rain in mm: ${values[i]}`;
        	currentContainer.appendChild(currentItem);
		}
        const blockchainItem = document.createElement('div');
        blockchainItem.classList.add('blockchain-item');
        blockchainItem.textContent = `Region: ${i + 1}, Rain in mm: ${values[i]}`;
        blockchainContainer.appendChild(blockchainItem);
    }

    console.log('Logging all numbers:', values);
    // Send the values array to the server for logging
}
